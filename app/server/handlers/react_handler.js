import React from 'util/safe-react';
import {createMemoryHistory,createLocation} from 'history';
import configureStore from 'store/configureStore';
import createRoutes from 'routes/index';
import {RouterContext, match} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import ReactDOMServer from 'react-dom/server';
import {Provider} from 'react-redux';
var serialize = require('serialize-javascript');
import Helmet from "react-helmet";


var DISABLE_CACHE = /true/.test(process.env.DISABLE_CACHE)
var EXPIRE_REDIS = process.env.EXPIRE_REDIS || '3600';

import logger from 'server/logger_middleware'

import {generateSitemap, generateIndexXml} from 'server/api/sitemap';

var utils = require("server/utils/utils")

var scriptSrcs = utils.getScriptSrcs()
const styleSrc = utils.getStyleSrc()

module.exports = function (app, REDIS_CONNECTION, RETHINKDB_CONNECTION, limiter) {
    
    app.get('*', limiter, (req, res, next) => {
        let location = createLocation(req.url)
        let reqUrl = location.pathname + location.search
        
        //sitemap
        if (reqUrl.indexOf('sitemap.xml') !== -1) {
            logger.info('Will generate sitemap.xml for request --> ' + reqUrl)
            
            var urlTag = 'sitemap.xml'
            //-------REDIS CACHE START ------//
            REDIS_CONNECTION.get(urlTag, function (err, js) {
                if (!DISABLE_CACHE) {
                    if (err || !js) {
                        if (err) {
                            logger.info('Error: Redis client ' + location,
                                err.stack)
                            return res.status(500).send('Server unavailable')
                        }
                        //return res.status(500).send('Cache is broken!');
                    } else {
                        logger.info(urlTag + ' will return cached result ')
                        res.header('Content-Type', 'application/xml')
                        return res.send(js)
                    }
                }
                //-------REDIS CACHE END ------//
                
                generateSitemap(RETHINKDB_CONNECTION, function (err, xml) {
                    if (!xml) {
                        logger.info('Error: generateSitemap ' + location)
                        logger.info('Error generateSitemap sitemap.xml --> ')
                        console.error('Error: ', urlTag, err.stack)
                        res.status(500).send('Server unavailable')
                        return
                    }
                    
                    if (xml) {
                        //-------REDIS CACHE SAVE START ------//
                        logger.debug(urlTag + ' will save cached')
                        if (!DISABLE_CACHE) {
                            REDIS_CONNECTION.set(urlTag, xml, 'EX', EXPIRE_REDIS)
                        }
                        //-------REDIS CACHE SAVE END ------//
                    }
                    res.header('Content-Type', 'application/xml')
                    return res.send(xml)
                })
                
            })
            //section sitemap
        } else if (reqUrl.indexOf('index.xml') !== -1) {
            logger.info('Will generate index.xml for request --> ' + reqUrl)
            var vars = location.pathname.split('/')
            if (!vars || vars.length < 3) {
                logger.info('Error: index.xml ' + location)
                logger.info('Error generateSitemap index.xml --> ')
                return res.status(500).send('Server unavailable')
            }
            var table = vars[1]
            var index = vars[2]
            var value = vars[3]
            
            logger.info('table: ' + table + ' index: ' + index + ' value: ' +
                value)
            
            if (table === 'topvideos') {
                table = 'sentiment_report'
            }
            
            if (table === 'news' || table === 'commentators' ||
                table === 'commentators_product' || table === 'product' ||
                table === 'sentiment_report') {
                
                var urlTag = 'index.xml_' + table + '_' + index + '_' + value
                //-------REDIS CACHE START ------//
                REDIS_CONNECTION.get(urlTag, function (err, js) {
                    if (!DISABLE_CACHE) {
                        if (err || !js) {
                            if (err) {
                                console.error('Error: section sitemap -> ',
                                    urlTag, err.stack)
                            }
                            //return res.status(500).send('Cache is broken!');
                        } else {
                            logger.info(urlTag + ' will return cached result ')
                            res.header('Content-Type', 'application/xml')
                            return res.send(js)
                        }
                    }
                    //-------REDIS CACHE END ------//
                    
                    generateIndexXml(table, index, value, RETHINKDB_CONNECTION,
                        function (err, xml) {
                            if (err || !xml) {
                                logger.info(
                                    'Error: generateSitemap sitemap.xml, will return 500 server unavailable --> ')
                                if (err) {
                                    logger.debug('Error: ', urlTag, err.stack)
                                }
                                return res.status(500).
                                    send('Server unavailable')
                            }
                            
                            if (xml) {
                                //-------REDIS CACHE SAVE START ------//
                                if (!DISABLE_CACHE) {
                                    if (!DISABLE_CACHE) {
                                        REDIS_CONNECTION.set(urlTag, xml, 'EX',
                                            EXPIRE_REDIS)
                                    }
                                }
                                //-------REDIS CACHE SAVE END ------//
                            }
                            res.header('Content-Type', 'application/xml')
                            return res.send(xml)
                        })
                    
                })
                
            } else {
                //not alllowed
                logger.info(
                    'Error generateSitemap index.xml --> not alllowed --> Server unavailable')
                return res.status(500).send('Server unavailable')
            }
            
        } else {
            
            let memoryHistory = createMemoryHistory({
                initialEntries: ['/'],  // The initial URLs in the history stack
                initialIndex: 0,          // The starting index in the history stack
                keyLength: 6,             // The length of location.key
                // A function to use to confirm navigation with the user. Required
                // if you return string prompts from transition hooks (see below)
                getUserConfirmation: null,
            })
            
            let store = configureStore()
            let routes = createRoutes(history)
            const history = syncHistoryWithStore(memoryHistory, store, {
                selectLocationState: () => (state => state.routing),
            })
            
            match({routes, location},
                (error, redirectLocation, renderProps) => {
                    if (redirectLocation) {
                        return res.redirect(301, redirectLocation.pathname +
                            redirectLocation.search)
                    } else if (error) {
                        logger.info('Error: 500 internal error ' + location,
                            error.stack)
                        return res.status(500).send(error.message)
                    }
                    
                    let [getCurrentUrl, unsubscribe] = subscribeUrl()
                    
                    var searchCss = []
                    if (reqUrl.indexOf('/search') !== -1) {
                        var q = req.query.q
                        // console.log("SERVER QUERY -> ", q)
                        renderProps.query = q
                    }
                    
                    getReduxPromise().then(() => {
                        
                        // Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
                        // user agent is not known.
                        global.navigator = {userAgent: req.headers['user-agent']}
                        
                        let html = ReactDOMServer.renderToString(
                            <Provider store={store} key="provider">
                                {<RouterContext {...renderProps}/>}
                            </Provider>,
                        )
                        
                        let reduxState = serialize(store.getState(),
                            {isJSON: true})
                        
                        let head = Helmet.renderStatic()
                        //logger.info("Helmet.rewind -> "+head.title.toString());
                        if (head.title.toString() ===
                            '<title data-react-helmet="true"></title>') {
                            head.title = '<title data-react-helmet="true">Loading ... </title>'
                        }
                        
                        if (getCurrentUrl() === reqUrl) {
                            res.render('index', {
                                html,
                                head,
                                scriptSrcs,
                                reduxState,
                                styleSrc,
                                searchCss,
                            })
                        } else {
                            logger.info('Redirect 302 ' + location)
                            res.redirect(302, getCurrentUrl())
                        }
                        
                        unsubscribe()
                    }).catch((err) => {
                        unsubscribe()
                        next(err)
                    })
                    
                    function getReduxPromise () {
                        let {query, params} = renderProps
                        if (!renderProps.components[renderProps.components.length -
                            1]) {
                            return Promise.resolve()
                        }
                        let comp = renderProps.components[renderProps.components.length -
                        1].WrappedComponent
                        // console.log("getReduxPromise, ",(comp && comp.fetchData), {query})
                        let promise = comp && comp.fetchData
                            ? comp.fetchData({query, params, store, history})
                            : Promise.resolve()
                        
                        return promise
                    }
                })
            
            function subscribeUrl () {
                let currentUrl = location.pathname + location.search
                let unsubscribe = history.listen((newLoc) => {
                    if (newLoc && newLoc.action === 'PUSH') {
                        currentUrl = newLoc.pathname + newLoc.search
                    }
                })
                return [
                    () => currentUrl,
                    unsubscribe,
                ]
            }
        }
    })
}