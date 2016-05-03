import Express from 'express';
import path from 'path';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { RoutingContext, match } from 'react-router';

var DOM = React.DOM, body = DOM.body, div = DOM.div, script = DOM.script;

import { createMemoryHistory, useQueries } from 'history';
import compression from 'compression';
import Promise from 'bluebird';

import configureStore from 'store/configureStore';
import createRoutes from 'routes/index';

import { Provider } from 'react-redux';

import r from 'rethinkdb';

import {generateSitemap,generateIndexXml} from './sitemap';
import Helmet from "react-helmet";

var REDIS_URL = process.env.REDISURL || "g7-box";
var REDIS_PORT = process.env.REDISPORT || 6379;

let { getAllByIndexFilterSkipLimit,getOneBySecondaryIndex,getCommentator } = require('./comentarismo_api');


var redis = require("redis"),
    client = redis.createClient({
        host: REDIS_URL, port: REDIS_PORT,
        retry_strategy: function (options) {
            if (options.error.code === 'ECONNREFUSED') {
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
    client.set("foo_rand000000000000", "testing redis connection", redis.print);
    client.get("foo_rand000000000000", redis.print);
});

let server = new Express();
let port = process.env.PORT || 3002;
let scriptSrcs;

let conn;

var conn_url = process.env.RETHINKURL || 'g7-box';
var dbport = process.env.PORT || 28015;
var authKey = process.env.AUTHKEY || '';
var rethinkdb_table = 'test';

let styleSrc;
if (process.env.NODE_ENV === 'production') {
    let assets = require('../../dist/webpack-assets.json');
    let refManifest = require('../../dist/rev-manifest.json');
    scriptSrcs = [
        `/${assets.vendor.js}`,
        `/${assets.app.js}`,
        '/static/jquery/dist/jquery.js',
        '/static/bootstrap/dist/js/bootstrap.js',
        '/vendor/comentarismo-client.js'
    ];
    styleSrc = [
        `/${refManifest['main.css']}`,
        '/static/css/all.css',
        '/static/bootstrap/dist/css/bootstrap.css',
        `/static/bootstrap/dist/css/bootstrap-theme.css`
    ];
} else {
    scriptSrcs = [
        'http://localhost:3001/static/vendor.js',
        'http://localhost:3001/static/dev.js',
        'http://localhost:3001/static/app.js',
        '/static/jquery/dist/jquery.js',
        '/static/bootstrap/dist/js/bootstrap.js',
        '/vendor/comentarismo-client.js'
    ];
    styleSrc = [
        '/main.css',
        '/static/css/all.css',
        '/static/bootstrap/dist/css/bootstrap.css',
        `/static/bootstrap/dist/css/bootstrap-theme.css`
    ];
}

server.use(compression());
server.use(Express.static(path.join(__dirname, '../..', 'dist')));
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

// apis
//server.get('/api/questions', (req, res)=> {
//    let { allcommentators } = require('./comentarismo_api');
//    allcommentators(conn, function (data) {
//        res.send(data);
//    });
//});

server.get('/api/questions/:id', (req, res)=> {
    let { getCommentator } = require('./comentarismo_api');
    getCommentator(req.params.id, conn, function (err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data);
    });
});

// mock apis
server.get('/api/commentators/:index/:value/:skip/:limit', (req, res)=> {
    console.log(req.params)
    var index = req.params.index;
    var value = req.params.value;
    var skip = parseInt(req.params.skip);
    var limit = parseInt(req.params.limit);

    var sort = req.query.sort;

    getAllByIndexFilterSkipLimit("commentator", index, value, {}, skip, limit, sort, conn, function (err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data);
    });
});

server.get('/api/commentators/:id', (req, res)=> {
    getCommentator(req.params.id, conn, function (err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data);
    });
});

//server.get('/api/articles', (req, res)=> {
//    let { allcommentators } = require('./comentarismo_api');
//    allcommentators(conn, function (data) {
//        res.send(data);
//    });
//});

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

    getAllByIndexFilterSkipLimit(table, index, value, filt, skip, limit, sort, conn, function (err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data);
    });
});

/**
 * Get all from a table with a index and its value with skip and limit
 */
server.get('/gapi/:table/:index/:value/:skip/:limit', (req, res)=> {
    var table = req.params.table;
    var index = req.params.index;
    var value = req.params.value;
    var skip = parseInt(req.params.skip);
    var limit = parseInt(req.params.limit);

    var sort = req.query.sort;

    getAllByIndexFilterSkipLimit(table, index, value, {}, skip, limit, sort, conn, function (err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data);
    });
});


server.get('/api/news/:id', (req, res)=> {
    var sort = req.query.sort;

    getOneBySecondaryIndex("news", "titleurlize", req.params.id, conn, function (err, news) {
        if (err) {
            console.log(err);
        }
        getAllByIndexFilterSkipLimit("commentaries", "titleurlize", req.params.id, {}, 0, 50, sort, conn, function (err, comments) {
            if (err) {
                console.log(err);
            }
            //console.log(comments.length)
            news.comments = comments;
            res.send(news);
        });
    });

});

server.get('/api/users/:id', (req, res)=> {
    let { getUser } = require('./mock_api');
    res.send(getUser(req.params.id));
});

server.get('sitemap.xml', (req, res, next)=> {
    console.log("sitemap");
    res.send([]);
});


var sitemap;

server.get('*', (req, res, next)=> {
    let history = useQueries(createMemoryHistory)();
    let location = history.createLocation(req.url);
    let reqUrl = location.pathname + location.search;

    let store = configureStore();
    let routes = createRoutes(history);

    //sitemap
    if (reqUrl.indexOf("sitemap.xml") !== -1) {
        console.log(location.pathname);
        console.log("sitemap");

        if (!sitemap) {
            generateSitemap(conn, function (err, xml) {
                if (!xml) {
                    console.log("Error generateSitemap sitemap.xml --> ");
                    console.log(err);
                    res.status(500).send("Server unavailable");
                    return;
                }
                sitemap = xml;
                res.header('Content-Type', 'application/xml');
                res.send(xml);
            });
        } else {
            console.log("send from cache");
            res.header('Content-Type', 'application/xml');
            res.send(sitemap);
        }
    //section sitemap
    } else if (reqUrl.indexOf("index.xml") !== -1) {
        var vars = location.pathname.split("/");
        if(!vars || vars.length < 3){
            console.log("Error generateSitemap index.xml --> ");
            res.status(500).send("Server unavailable");
            return;
        }
        var table = vars[1];
        var index = vars[2];
        var value = vars[3];

        //console.log("table: "+table+" index: "+index+" value: "+value);

        if(table == "news" || table == "commentators"){

            generateIndexXml(table,index,value,conn,function(err,xml){
                if (!xml) {
                    console.log("Error generateSitemap sitemap.xml --> ");
                    console.log(err);
                    res.status(500).send("Server unavailable");
                    return;
                }
                res.header('Content-Type', 'application/xml');
                return res.send(xml);
            });

        }else {
            //not alllowed
            console.log("Error generateSitemap index.xml --> ");
            res.status(500).send("Server unavailable");
            return;
        }

    } else {

        match({routes, location}, (error, redirectLocation, renderProps) => {
            if (redirectLocation) {
                res.redirect(301, redirectLocation.pathname + redirectLocation.search);
            } else if (error) {
                res.status(500).send(error.message);
            } else if (renderProps == null) {
                res.status(404).send('Not found')
            } else {
                let [ getCurrentUrl, unsubscribe ] = subscribeUrl();

                getReduxPromise().then(()=> {
                        let reduxState = escape(JSON.stringify(store.getState()));
                        //let html = ReactDOMServer.renderToString(
                        //    <Provider store={store}>
                        //        { <RoutingContext {...renderProps}/> }
                        //    </Provider>
                        //);

                        //if (getCurrentUrl() === reqUrl) {
                        //    res.render('index', {html, scriptSrcs, reduxState, styleSrc});
                        //} else {
                        //    res.redirect(302, getCurrentUrl());
                        //}


                        let html = ReactDOMServer.renderToStaticMarkup(body(null,

                            // The actual server-side rendering of our component occurs here, and we
                            // pass our data in as `props`. This div is the same one that the client
                            // will "render" into on the browser



                            div({id: 'content', dangerouslySetInnerHTML: {__html:
                                //ReactDOMServer.renderToString(App(props))
                                ReactDOMServer.renderToString(
                                    <Provider store={store}>
                                        { <RoutingContext {...renderProps}/> }
                                    </Provider>)
                            }})

                            // The props should match on the client and server, so we stringify them
                            // on the page to be available for access by the code run in browser.js
                            // You could use any var name here as long as it's unique
                            //script({dangerouslySetInnerHTML: {__html:
                            //'var APP_PROPS = ' + safeStringify(props) + ';'
                            //}}),
                            //
                            //// We'll load React from a CDN - you don't have to do this,
                            //// you can bundle it up or serve it locally if you like
                            //script({src: '//cdnjs.cloudflare.com/ajax/libs/react/15.0.1/react.min.js'}),
                            //script({src: '//cdnjs.cloudflare.com/ajax/libs/react/15.0.1/react-dom.min.js'}),
                            //
                            //// Then the browser will fetch and run the browserified bundle consisting
                            //// of browser.js and all its dependencies.
                            //// We serve this from the endpoint a few lines down.
                            //script({src: '/bundle.js'})
                        ));

                        let head = Helmet.rewind();
                        console.log("karaidiasa -> "+head.title);

                        // Return the page to the browser
                        //res.end(html);


                        if (getCurrentUrl() === reqUrl) {
                            res.render('index', {html, head, scriptSrcs, reduxState, styleSrc});
                        } else {
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
                    let comp = renderProps.components[renderProps.components.length - 1].WrappedComponent;
                    let promise = comp.fetchData ?
                        comp.fetchData({query, params, store, history}) :
                        Promise.resolve();

                    return promise;
                }
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

server.use((err, req, res, next)=> {
    if (err) {
        console.log(err.stack);
    }
    // TODO report error here or do some further handlings

    res.status(500).send("something went wrong... --> " + err.stack)
})


//auth rethinkdb
r.connect({
    host: conn_url,
    port: dbport,
    authKey: authKey,
    db: rethinkdb_table
}, function (err, c) {
    conn = c;
    if (err) {
        console.log(err);
    } else {
        console.log("Rethinkdb is connected");

        console.log(`Server is listening to port: ${port}`);
        server.listen(port);
    }
});


