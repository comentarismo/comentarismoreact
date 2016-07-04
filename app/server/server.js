import Express from 'express';
import path from 'path';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { RoutingContext, match } from 'react-router';

var DOM = React.DOM, body = DOM.body, div = DOM.div, script = DOM.script;
import {GoogleSearchScript} from "components/GoogleSearchScript"
import {MainNavbar} from "components/MainNavbar"

var redis = require("redis");

import { createMemoryHistory, useQueries } from 'history';
import compression from 'compression';
import Promise from 'bluebird';

import configureStore from 'store/configureStore';
import createRoutes from 'routes/index';

import { Provider } from 'react-redux';

import r from 'rethinkdb';

import {generateSitemap,generateIndexXml} from './sitemap';
import Helmet from "react-helmet";

var REDIS_HOST = process.env.REDIS_HOST || "g7-box";
var REDIS_PORT = process.env.REDIS_PORT || 6379;
var REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";
var EXPIRE_REDIS = process.env.EXPIRE_REDIS;

let { getAllByIndexOrderBySkipLimit,getOneBySecondaryIndex,getCommentator,getCommentatorByNick,getByID,getAllByIndexSkipLimit } = require('./comentarismo_api');

let server = new Express();
let port = process.env.PORT || 3002;
let scriptSrcs;

let conn;

var conn_url = process.env.RETHINKURL || 'g7-box';
var dbport = process.env.RETHINKPORT || 28015;
var authKey = process.env.RETHINKAUTHKEY || '';

var rethinkdb_table = process.env.RETHINKTABLE || 'test';

var aday = 86400000;
var dayHours = 24;

var expireTime = aday / dayHours;
var expireTimeStr = process.env.expiretime;
if (expireTimeStr) {
    expireTime = parseInt(expireTimeStr);
}

/** LOGGER **/
var log = require("./logger");
var logger = log.getLogger();
/** LOGGER **/

logger.info("Will set expire time for redis/cache as --> " + expireTime);

let styleSrc;
if (process.env.NODE_ENV === 'production') {
    //let assets = require('../../dist/webpack-assets.json');
    scriptSrcs = [
        `/static/vendor.js`,
        `/static/app.js`,
        '/static/all.min.js'
    ];
    styleSrc = [
        '/static/all.min.css',
    ];
} else {
    scriptSrcs = [
        'http://localhost:3001/static/vendor.js',
        'http://localhost:3001/static/dev.js',
        'http://localhost:3001/static/app.js',
        '/static/all.js',
    ];
    styleSrc = [
        '/static/all.css'
    ];
}



console.log(`REDIS_HOST -> ${REDIS_HOST}, REDIS_PORT -> ${REDIS_PORT}, REDIS_PASSWORD -> ${REDIS_PASSWORD}`);

var client = redis.createClient({
    host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASSWORD,
    retry_strategy: function (options) {

        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.times_connected > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.max(options.attempt * 100, 3000);
    }
});

client.on("connect", function () {
    //client.set("foo_rand000000000000", "testing redis connection", redis.print);
    //client.get("foo_rand000000000000", redis.print);
});

client.on("error",function(err){
   logger.error(err);
});


server.use(compression());
server.use(Express.static(path.join(__dirname, '../..', 'dist')));
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');


server.get('/api/comment/:id', (req, res) => {
    var id = req.params.id;
    logger.info(`/comment/${id}`)
    getByID("commentaries", id, conn, function (err, data) {
        if (err || !data) {
            console.error(err);
            return res.status(500).send('Something broke!');
        } else {
            res.send(data);
        }
    });
});

server.get('/api/suggestcomment/:id', (req, res) => {
    var id = req.params.id;
    logger.info(`/comment/${id}`)
    getByID("commentaries", id, conn, function (err, data) {
        if (err || !data) {
            console.error(err);
            return res.status(500).send('Something broke!');
        } else {
            res.send(data);
        }
    });
});

server.get('/api/admin/r/:table/:id', (req, res) => {
    var table = req.params.table;
    var id = req.params.id;
    var targetUrl = `/api/admin/r/${table}/${id}`;
    logger.info(""+targetUrl);
    getByID(`${table}`, id, conn, function (err, data) {
        if (err || !data) {
            console.error(err);
            return res.status(500).send('Something broke!');
        } else {
            res.send(data);
        }
    });
});


//bind to action/commentators.js -> loadCommentators
server.get('/fapi/commentators/:index/:value/:skip/:limit', (req, res)=> {
    logger.info(req.params);
    var index = req.params.index;
    var value = req.params.value;
    var skip = parseInt(req.params.skip);
    var limit = parseInt(req.params.limit);

    var sort = req.query.sort;

    var urlTag = `/fapi/commentators/${index}/${value}/${skip}/${limit}?sort=${sort}`;
    logger.info(urlTag);

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (err || !js) {
            if (err) {
                console.error(err.stack);
            }
        } else {
            logger.info(urlTag + " will return cached result ");
            if(EXPIRE_REDIS) {
                client.expire(urlTag,1);
            }
            res.type('application/json');
            return res.send(js);
        }
        //-------REDIS CACHE END ------//

        getAllByIndexOrderBySkipLimit("commentator", index, value, skip, limit, sort, conn, function (err, data) {
            if (err) {
                console.error(err.stack);
                return res.status(500).send('Something broke!');
            }

            if (data) {
                //-------REDIS CACHE SAVE START ------//
                logger.info(urlTag + " will save cached");
                client.set(urlTag, JSON.stringify(data), redis.print);
                client.expire(urlTag, 1800);
                //-------REDIS CACHE SAVE END ------//
                res.send(data);
            }


        });

    });


});

//bind to action/commentators.js -> loadCommentatorDetail
server.get('/api/commentators/:id', (req, res)=> {
    var id = req.params.id;

    if (!id) {
        return res.status(404).send('Not found');
    }

    var urlTag = `/api/commentators/${id}`;
    logger.info(urlTag);

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (err || !js) {
            if (err) {
                console.error(err);
            }
            //return res.status(500).send('Cache is broken!');
        } else {
            logger.info(urlTag + " will return cached result ");
            if(EXPIRE_REDIS) {
                client.expire(urlTag, 1);
            }
            res.type('application/json');
            return res.send(js);
        }
        //-------REDIS CACHE END ------//


        getCommentator(req.params.id, conn, function (err, data) {
            if (err) {
                logger.info("Error: " + err);
                //console.error(err.stack);
                //return res.status(500).send('Something broke!');
            }

            if (data) {
                //-------REDIS CACHE SAVE START ------//
                logger.info(urlTag + " will save cached");
                var js = JSON.stringify(data);
                //logger.info(js);
                client.set(urlTag, js, redis.print);
                client.expire(urlTag, expireTime);
                //-------REDIS CACHE SAVE END ------//
                res.send(data);
            } else {

                logger.info("commentator not found, will retry with nick");

                //retry
                var idAux = "";
                if (req.params.id.indexOf("-") !== -1) {
                    idAux = req.params.id.split("-")[1];
                }

                if(!idAux){
                    logger.info("Error: " + err);
                    console.error(err.stack);
                    return res.status(404).send();
                }

                getCommentatorByNick((idAux ? idAux : req.params.id), conn, function (err, data) {
                    if (err) {
                        logger.info("Error: " + err);
                        //console.error(err.stack);
                        return res.status(404).send();
                    }

                    if (data) {
                        //-------REDIS CACHE SAVE START ------//
                        logger.info(urlTag + " will save cached");
                        client.set(urlTag, JSON.stringify(data), redis.print);
                        client.expire(urlTag, expireTime);
                        //-------REDIS CACHE SAVE END ------//
                    } else {

                        logger.info("nothing found ? how did we got here ?  getCommentatorByNick --> "+urlTag)
                    }

                    res.send(data);
                });
            }


        });

    });
});

/**
 * Get all from a table with a index and its value and optional pos filtering like /genre/politics with skip and limit
 */
server.get('/fapi/:table/:index/:value/:filter/:filtervalue/:skip/:limit', (req, res)=> {
    var table = req.params.table;
    var index = req.params.index;
    var value = req.params.value;
    var filter = req.params.filter;
    var filtervalue = req.params.filtervalue;
    var skip = parseInt(req.params.skip);
    var limit = parseInt(req.params.limit);

    var filt = {};
    if (filter && filtervalue) {
        filt = {filter: filtervalue}
    }
    var sort = req.query.sort;

    var urlTag = `/fapi/${table}/${index}/${value}/${filter}/${filtervalue}/${skip}/${limit}?sort=${sort}`;
    logger.info(urlTag);

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (err || !js) {
            if (err) {
                console.error(err.stack);
            }
            //return res.status(500).send('Cache is broken!');
        } else {
            logger.info(urlTag + " will return cached result ");
            if(EXPIRE_REDIS) {
                client.expire(urlTag,1);
            }
            res.type('application/json');
            return res.send(js);
        }
        //-------REDIS CACHE END ------//


        getAllByIndexOrderBySkipLimit(table, index, value, skip, limit, sort, conn, function (err, data) {
            if (err) {
                console.error(err.stack);
                return res.status(500).send('Something broke!');
            }

            if (data) {
                //-------REDIS CACHE SAVE START ------//
                logger.info(urlTag + " will save cached");
                client.set(urlTag, JSON.stringify(data), redis.print);
                client.expire(urlTag, expireTime);
                //-------REDIS CACHE SAVE END ------//
            }
            res.send(data);
        });
    });
});

/**
 * Get all from a table with a index and its value with skip and limit
 * bind to action/articles.js -> loadArticles
 * bind to app/sa.js -> used for listing all news and commentators infinitescroll
 *
 */
server.get('/gapi/:table/:index/:value/:skip/:limit', (req, res)=> {
    var table = req.params.table;
    var index = req.params.index;
    var value = req.params.value;
    var skip = parseInt(req.params.skip);
    var limit = parseInt(req.params.limit);

    var sort = req.query.sort;

    var urlTag = `/gapi/${table}/${index}/${value}/${skip}/${limit}?sort=${sort}`;
    //logger.info(urlTag);

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (err || !js) {
            if (err) {
                console.error(err.stack);
            }
            //return res.status(500).send('Cache is broken!');
        } else {
            logger.info(urlTag + " will return cached result ");
            if(EXPIRE_REDIS) {
                client.expire(urlTag,1);
            }
            res.type('application/json');
            return res.send(js);
        }
        //-------REDIS CACHE END ------//


        getAllByIndexOrderBySkipLimit(table, index, value, skip, limit, sort, conn, function (err, data) {
            if (err) {
                console.error(err.stack);
                return res.status(500).send('Something broke!');
            }

            if (data) {
                //-------REDIS CACHE SAVE START ------//
                logger.info(urlTag + " will save cached");
                res.type('application/json');
                client.set(urlTag, JSON.stringify(data), redis.print);
                client.expire(urlTag, expireTime);
                //-------REDIS CACHE SAVE END ------//
            }
            res.send(data);
        });

    });
});


/**
 * Get all from a table with a index and its value with skip and limit
 * bind to action/articles.js -> loadArticles
 * bind to app/sa.js -> used for listing all news and commentators infinitescroll
 *
 */
server.get('/commentsapi/:table/:index/:value/:skip/:limit', (req, res)=> {
    var table = req.params.table;
    var index = req.params.index;
    var value = req.params.value;
    var skip = parseInt(req.params.skip);
    var limit = parseInt(req.params.limit);

    var urlTag = `/commentsapi/${table}/${index}/${value}/${skip}/${limit}`;
    //logger.info(urlTag);

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (err || !js) {
            if (err) {
                console.error(err.stack);
            }
            //return res.status(500).send('Cache is broken!');
        } else {
            console.log(urlTag + " will return cached result");
            if(EXPIRE_REDIS) {
                client.expire(urlTag,1);
            }
            res.type('application/json');
            return res.send(js);
        }
        //-------REDIS CACHE END ------//

        getAllByIndexOrderBySkipLimit(table, index, value, skip, limit, "date", conn, function (err, data) {
            if (err) {
                console.error(err.stack);
                return res.status(500).send('Something broke!');
            }

            if (data) {
                //-------REDIS CACHE SAVE START ------//
                console.log(urlTag + " will save cached fdp");
                res.type('application/json');
                client.set(urlTag, JSON.stringify(data), redis.print);
                client.expire(urlTag, expireTime);
                //-------REDIS CACHE SAVE END ------//
            }
            res.send(data);
        });

    });
});

//bind to action/articles.js -> loadArticleDetail
server.get('/api/news/:id', (req, res)=> {
    var sort = req.query.sort;

    var urlTag = `/api/news/${req.params.id}`;
    //logger.info(urlTag);

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (err || !js) {
            if (err) {
                console.error(err.stack);
            }
            //return res.status(500).send('Cache is broken!');
        } else {
            logger.info(urlTag + " will return cached result ");
            if(EXPIRE_REDIS) {
                client.expire(urlTag,1);
            }
            res.type('application/json');
            return res.send(js);
        }
        //-------REDIS CACHE END ------//


        getOneBySecondaryIndex("news", "titleurlize", req.params.id, conn, function (err, news) {
            if (err) {
                console.error(err.stack);
                return res.status(500).send('Something broke!');
            } else if (!news) {
                logger.info("News not found --> " + req.params.id);
                return res.status(404).send("News not found --> " + req.params.id);
            }
            getAllByIndexOrderBySkipLimit("commentaries", "titleurlize", req.params.id, 0, 50, sort, conn, function (err, comments) {
                if (err) {
                    console.error(err.stack);
                    return res.status(500).send('Something broke!');
                }
                //logger.info(comments.length)
                news.comments = comments;

                if (news) {
                    //-------REDIS CACHE SAVE START ------//
                    logger.info(urlTag + " will save cached");
                    client.set(urlTag, JSON.stringify(news), redis.print);
                    client.expire(urlTag, expireTime);
                    //-------REDIS CACHE SAVE END ------//
                }
                res.send(news);
            });
        });

    });

});

var comentarismosite = "http://www.comentarismo.com";
server.get('/intropage/:table/:index/:value/:skip/:limit', (req, res) => {

    var table = req.params.table;
    var index = req.params.index;
    var value = req.params.value;
    var skip = parseInt(req.params.skip);
    var limit = parseInt(req.params.limit);

    var urlTag = `/${table}/${index}/${value}/${skip}/${limit}`;
    //console.log(urlTag);

    //-------REDIS CACHE START ------//
    client.get("intropage"+urlTag, function (err, js) {
        if (err || !js) {
            if (err) {
                console.log("intropage err ",err);
            }
            //return res.status(500).send('Cache is broken!');
        }
        else {
            console.log("intropage"+urlTag + " will return cached result");
            if(EXPIRE_REDIS) {
                client.expire("intropage"+urlTag, 1);
            }
            res.type('application/json');
            return res.send(js);
        }
        //-------REDIS CACHE END ------//

        let { getAlexaRank } = require('./alexa_api');

        getAlexaRank(comentarismosite, table, index, value, skip, limit, "date", conn, function(err,alexarank){
            if(err){
                return res.status(500).send({});
            }else {
                client.set("intropage"+urlTag, JSON.stringify(alexarank), redis.print);
                client.expire("intropage"+urlTag, expireTime);
                res.type('application/json');
                //-------REDIS CACHE SAVE END ------//
                //get comments
                return res.send(alexarank);
            }
        });
    });
});


//TODO: cache sitemap with redis

server.get('*', (req, res, next)=> {
    let history = useQueries(createMemoryHistory)();
    let location = history.createLocation(req.url);
    let reqUrl = location.pathname + location.search;

    let store = configureStore();
    let routes = createRoutes(history);

    //sitemap
    if (reqUrl.indexOf("sitemap.xml") !== -1) {
        logger.info("Will generate sitemap.xml for request --> " + reqUrl);

        var urlTag = "sitemap.xml";
        //-------REDIS CACHE START ------//
        client.get(urlTag, function (err, js) {
            if (err || !js) {
                if (err) {
                    logger.info("Error: Redis client " + location);
                    console.error(err.stack);
                }
                //return res.status(500).send('Cache is broken!');
            } else {
                logger.info(urlTag + " will return cached result ");
                if(EXPIRE_REDIS) {
                    client.expire(urlTag, 1);
                }
                res.header('Content-Type', 'application/xml');
                return res.send(js);
            }
            //-------REDIS CACHE END ------//

            generateSitemap(conn, function (err, xml) {
                if (!xml) {
                    logger.info("Error: generateSitemap " + location);
                    logger.info("Error generateSitemap sitemap.xml --> ");
                    console.error(err.stack);
                    res.status(500).send("Server unavailable");
                    return;
                }

                if (xml) {
                    //-------REDIS CACHE SAVE START ------//
                    logger.info(urlTag + " will save cached");
                    client.set(urlTag, xml, redis.print);
                    client.expire(urlTag, expireTime);
                    //-------REDIS CACHE SAVE END ------//
                }
                res.header('Content-Type', 'application/xml');
                return res.send(xml);
            });

        });
        //section sitemap
    } else if (reqUrl.indexOf("index.xml") !== -1) {
        logger.info("Will generate index.xml for request --> " + reqUrl);
        var vars = location.pathname.split("/");
        if (!vars || vars.length < 3) {
            logger.info("Error: index.xml " + location);
            logger.info("Error generateSitemap index.xml --> ");
            return res.status(500).send("Server unavailable");
        }
        var table = vars[1];
        var index = vars[2];
        var value = vars[3];

        logger.info("table: "+table+" index: "+index+" value: "+value);

        if (table == "news" || table == "commentators" || table == "sentiment_report") {

            var urlTag = "index.xml_" + table + "_" + index + "_" + value;
            //-------REDIS CACHE START ------//
            client.get(urlTag, function (err, js) {
                if (err || !js) {
                    if (err) {
                        console.error(err.stack);
                    }
                    //return res.status(500).send('Cache is broken!');
                } else {
                    logger.info(urlTag + " will return cached result ");
                    if(EXPIRE_REDIS) {
                        client.expire(urlTag,1);
                    }
                    res.header('Content-Type', 'application/xml');
                    return res.send(js);
                }
                //-------REDIS CACHE END ------//

                generateIndexXml(table, index, value, conn, function (err, xml) {
                    if (err || !xml) {
                        logger.info("Error generateSitemap sitemap.xml --> ");
                        if (err) {
                            console.error(err.stack);
                        }
                        return res.status(500).send("Server unavailable");
                    }

                    if (xml) {
                        //-------REDIS CACHE SAVE START ------//
                        logger.info(urlTag + " will save cached");
                        client.set(urlTag, xml, redis.print);
                        client.expire(urlTag, expireTime);
                        //-------REDIS CACHE SAVE END ------//
                    }
                    res.header('Content-Type', 'application/xml');
                    return res.send(xml);
                });

            });

        } else {
            //not alllowed
            logger.info("Error generateSitemap index.xml --> ");
            return res.status(500).send("Server unavailable");
        }

    } else {

        //logger.info(location);
        match({routes, location}, (error, redirectLocation, renderProps) => {
            if (redirectLocation) {
                return res.redirect(301, redirectLocation.pathname + redirectLocation.search);
            } else if (error) {
                logger.info("Error: 500 " + location);
                console.error(err.stack);
                logger.info("500 internal error")
                return res.status(500).send(error.message);
            }

            let [ getCurrentUrl, unsubscribe ] = subscribeUrl();

            getReduxPromise().then(()=> {
                    let reduxState = escape(JSON.stringify(store.getState()));
                    let html = ReactDOMServer.renderToString(
                        <Provider store={store}>
                            { <RoutingContext {...renderProps}/> }
                        </Provider>
                    );

                    //let html = ReactDOMServer.renderToStaticMarkup(body(null,
                    //    div({id: 'content', dangerouslySetInnerHTML: {__html:
                    //        //ReactDOMServer.renderToString(App(props))
                    //        ReactDOMServer.renderToString(
                    //            <Provider store={store}>
                    //                { <RoutingContext {...renderProps}/> }
                    //            </Provider>)
                    //    }})
                    //    //script({src: '/bundle.js'})
                    //));

                    let head = Helmet.rewind();
                    //logger.info("Helmet.rewind -> "+head.title.toString());
                    if (head.title.toString() == "<title data-react-helmet=\"true\"></title>") {
                        head.title = "<title data-react-helmet=\"true\">404 Not Found</title>";
                    }

                    var searchCss = [];
                    if(reqUrl.indexOf("/search") !== -1){
                        searchCss.push("/static/search_theme.css")
                    }

                    if (getCurrentUrl() === reqUrl) {
                        res.render('index', {html, head, scriptSrcs, reduxState, styleSrc,searchCss});
                    } else {
                        logger.info("Redirect 302 " + location);
                        res.redirect(302, getCurrentUrl());
                    }

                    unsubscribe();
                })
                .catch((err)=> {
                    unsubscribe();
                    next(err);
                });
            function getReduxPromise() {
                let { query, params } = renderProps;
                if(!renderProps.components[renderProps.components.length - 1]){
                    return Promise.resolve()
                }
                let comp = renderProps.components[renderProps.components.length - 1].WrappedComponent;
                let promise = comp.fetchData ?
                    comp.fetchData({query, params, store, history}) :
                    Promise.resolve();

                return promise;
            }
        });
        function subscribeUrl() {
            let currentUrl = location.pathname + location.search;
            let unsubscribe = history.listen((newLoc)=> {
                if (newLoc.action === 'PUSH') {
                    currentUrl = newLoc.pathname + newLoc.search;
                }
            });
            return [
                ()=> currentUrl,
                unsubscribe
            ];
        }
    }
});

server.on('error', (err) => {
    console.error("server.on('error' --> " , err);
});

server.use((err, req, res, next)=> {
    if (err) {
        console.error("server.use((err, --> " , err);
        logger.info("err stack ",err.stack);
    }
    // TODO report error here or do some further handlings

    res.status(500).send("something went wrong... --> " + err.stack)
});


//auth rethinkdb
r.connect({
    host: conn_url,
    port: dbport,
    authKey: authKey,
    db: rethinkdb_table
}, function (err, c) {
    conn = c;
    if (err) {
        logger.info("rethinkdb -> ",err);
    } else {
        logger.info("Rethinkdb is connected");

        logger.info(`Server is listening to port: ${port}`);
        server.listen(port);
    }
});


