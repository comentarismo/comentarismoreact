import Express from 'express';
import path from 'path';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { RoutingContext, match } from 'react-router';

import { createMemoryHistory, useQueries } from 'history';
import compression from 'compression';
import Promise from 'bluebird';

import configureStore from 'store/configureStore';
import createRoutes from 'routes/index';

import { Provider } from 'react-redux';

import r from 'rethinkdb';


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
        `/${assets.app.js}`
    ];
    styleSrc =[
        `/${refManifest['main.css']}`
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
server.get('/api/questions', (req, res)=> {
    let { allcommentators } = require('./comentarismo_api');
    allcommentators(conn,function(data){
        res.send(data);
    });
});

server.get('/api/questions/:id', (req, res)=> {
    let { getCommentator } = require('./comentarismo_api');
    getCommentator(req.params.id,conn,function(err, data){
        if(err){
            console.log(err);
        }
        res.send(data);
    });
});

// mock apis
server.get('/api/commentators/:index/:value/:skip/:limit', (req, res)=> {
    let { getAllByIndexFilterSkipLimit } = require('./comentarismo_api');
    console.log(req.params)
    var index= req.params.index;
    var value= req.params.value;
    var skip = parseInt(req.params.skip);
    var limit= parseInt(req.params.limit);

    getAllByIndexFilterSkipLimit("commentator",index,value,{},skip,limit,conn,function(err,data){
        if(err){
            console.log(err);
        }
        res.send(data);
    });
});

server.get('/api/commentators/:id', (req, res)=> {
    let { getCommentator } = require('./comentarismo_api');
    getCommentator(req.params.id,conn,function(err, data){
        if(err){
            console.log(err);
        }
        res.send(data);
    });
});

server.get('/api/articles', (req, res)=> {
    let { allcommentators } = require('./comentarismo_api');
    allcommentators(conn,function(data){
        res.send(data);
    });
});

server.get('/fapi/:table/:index/:value/:filter/:filtervalue/:skip/:limit', (req, res)=> {
    let { getAllByIndexFilterSkipLimit } = require('./comentarismo_api');

    var table = req.params.table;
    var index= req.params.index;
    var value= req.params.value;
    var filter = req.params.filter;
    var filtervalue = req.params.filtervalue;
    var skip = parseInt(req.params.skip);
    var limit= parseInt(req.params.limit);

    var filt = {};
    if(filter && filtervalue){
        filt = {filter:filtervalue}
    }

    getAllByIndexFilterSkipLimit(table,index,value,filt,skip,limit,conn,function(err,data){
        if(err){
            console.log(err);
        }
        res.send(data);
    });
});

server.get('/gapi/:table/:index/:value/:skip/:limit', (req, res)=> {
    let { getAllByIndexFilterSkipLimit } = require('./comentarismo_api');

    var table = req.params.table;
    var index= req.params.index;
    var value= req.params.value;
    var skip = parseInt(req.params.skip);
    var limit= parseInt(req.params.limit);

    getAllByIndexFilterSkipLimit(table,index,value,{},skip,limit,conn,function(err,data){
        if(err){
            console.log(err);
        }
        res.send(data);
    });
});


server.get('/api/news/:id', (req, res)=> {
    let { getAllByIndexFilterSkipLimit,getOneBySecondaryIndex } = require('./comentarismo_api');
    getOneBySecondaryIndex("news","titleurlize",req.params.id,conn,function(err, news){
        if(err){
            console.log(err);
        }
        getAllByIndexFilterSkipLimit("commentaries","titleurlize",req.params.id,{},0,50,conn,function(err,comments){
            if(err){
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

server.get('*', (req, res, next)=> {
    let history = useQueries(createMemoryHistory)();
    let store = configureStore();
    let routes = createRoutes(history);
    let location = history.createLocation(req.url);

    match({routes, location}, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
            res.redirect(301, redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
            res.status(500).send(error.message);
        } else if (renderProps == null) {
            res.status(404).send('Not found')
        } else {
            let [ getCurrentUrl, unsubscribe ] = subscribeUrl();
            let reqUrl = location.pathname + location.search;

            getReduxPromise().then(()=> {
                    let reduxState = escape(JSON.stringify(store.getState()));
                    let html = ReactDOMServer.renderToString(
                        <Provider store={store}>
                            { <RoutingContext {...renderProps}/> }
                        </Provider>
                    );

                    if (getCurrentUrl() === reqUrl) {
                        res.render('index', {html, scriptSrcs, reduxState, styleSrc});
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
});

server.use((err, req, res, next)=> {
    if(err) {
        console.log(err.stack);
    }
    // TODO report error here or do some further handlings

    res.status(500).send("something went wrong... --> "+err.stack)
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


