import Express from 'express';
import serveStatic from 'serve-static';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {RouterContext, match} from 'react-router';
// import {GoogleSearchScript} from "components/GoogleSearchScript"
import favicon from 'serve-favicon';
import redis from "redis";
import {createMemoryHistory,createLocation} from 'history';
import compression from 'compression';
import Promise from 'bluebird';

import configureStore from 'store/configureStore';
import createRoutes from 'routes/index';

import {Provider} from 'react-redux';

import {generateSitemap, generateIndexXml} from './sitemap';
import Helmet from "react-helmet";

const Wreck = require('wreck');

// var DOM = React.DOM, body = DOM.body, div = DOM.div, script = DOM.script;

var REDIS_HOST = process.env.REDIS_HOST || "g7-box";
var REDIS_PORT = process.env.REDIS_PORT || 6379;
var REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";
var EXPIRE_REDIS = process.env.EXPIRE_REDIS || '3600';
var DISABLE_CACHE = process.env.DISABLE_CACHE === "false";
var IS_DEBUG = (process.env.DEBUG === "true")
if(IS_DEBUG){
    console.log("******* DEBUG ENABLED ********")
}
if(!DISABLE_CACHE){
    console.log("****** REDIS CACHE ENABLED *******")
}else {
    console.log("****** REDIS CACHE DISABLED *******")
}

let {
    getAllByMultipleIndexOrderBySkipLimit,
    getAllByMultipleIndexCount,
    getAllByIndexOrderBySkipLimit,
    getAllByIndexOrderByFilterSkipLimit,
    getAllByDateRangeIndexOrderByFilterSkipLimit,
    getOneBySecondaryIndex,
    getCommentator,
    getCommentatorByNick,
    getByID,
    getByUID,
    getCommentariesByCommentariesIds,
    getAllByIndexSkipLimit,
    getAllDistinctByIndex
} = require('./comentarismo_api');

let server = new Express();
let port = process.env.PORT || 3002;
let scriptSrcs;

//Helmet package - 11 security modules
const helmet = require('helmet');

var RETHINKDB_HOST = process.env.RETHINKDB_HOST || 'g7-box';
var RETHINKDB_PORT = process.env.RETHINKDB_PORT || 28015;
var RETHINKDB_PASSWORD = process.env.RETHINKDB_PASSWORD;

var RETHINKDB_TABLE = process.env.RETHINKDB_TABLE || 'test';
var RETHINKDB_TIMEOUT = process.env.RETHINKDB_TIMEOUT || 120;

// var aday = 86400;
// var dayHours = 24;
// var expireTime = aday / dayHours;

var REDIS_EXPIRE = process.env.REDIS_EXPIRE || '10'; //1h

var GIT_HASH = require("./version.js").GIT_HASH;
var VERSION = require("./version.js").VERSION;

/** LOGGER **/
var log = require("./logger");
var logger = log.getLogger();
/** LOGGER **/

var WEBPACK_PORT = process.env.WEBPACK_PORT || 3001;

let styleSrc;
if (process.env.NODE_ENV === 'production') {
    //let assets = require('../../dist/webpack-assets.json');
    scriptSrcs = [
        `/assets/${GIT_HASH}/vendor.js`,
        `/assets/${GIT_HASH}/app.js`,
    ];
    styleSrc = [
        `//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800`,
        '//fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,900',
    ];
} else {
    scriptSrcs = [
        `http://localhost:${WEBPACK_PORT}/static/vendor.js`,
        `http://localhost:${WEBPACK_PORT}/static/dev.js`,
        `http://localhost:${WEBPACK_PORT}/static/app.js`,
        '/static/all.js',
    ];
    styleSrc = [
        `//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800`,
        '//fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,900',
        '/static/all.css'
    ];
}

var r = require('rethinkdbdash');
var conn = r({
    discovery: false,
    db: RETHINKDB_TABLE,
    timeout: RETHINKDB_TIMEOUT,
    servers: [
        {
            host: RETHINKDB_HOST,
            port: RETHINKDB_PORT,
            password: RETHINKDB_PASSWORD
        }
    ]
});

console.log(`REDIS_HOST:${REDIS_HOST}, REDIS_PORT:${REDIS_PORT}, REDIS_PASSWORD:${REDIS_PASSWORD}, REDIS_EXPIRE:${REDIS_EXPIRE}`);

var client = redis.createClient({
    host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASSWORD,
    retry_strategy: function (options) {

        if (options.error && options.error.code === 'ECONNREFUSED') {
            console.log('ERROR: REDIS, ECONNREFUSED, ', options)
            // End reconnecting on a specific error and flush all commands with a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            console.log('ERROR: REDIS, options.total_retry_time > 1000 * 60 * 60, ', options)
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.times_connected > 10) {
            console.log('ERROR: REDIS, options.times_connected > 10, ', options)
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.max(options.attempt * 100, 3000);
    }
});

client.on("connect", function () {
    console.log('****** REDIS will test connection');
    client.set("foo_rand000000000000", "testing redis connection", 'EX',
        EXPIRE_REDIS);
    client.get("foo_rand000000000000", redis.print);
});

client.on("error", function (err) {
    console.log('ERROR: REDIS, ', err);
});

var RateLimit = require('./express-rate-limit');
var RedisStore = require('./redis-store');

var expireLimit = process.env.EXPIRE_LIMIT || 60;
var maxLimit = process.env.MAX_LIMIT || 20;
var delayLimit = process.env.DELAY_LIMIT || 0;

var limiter = new RateLimit({
    RETHINKDB_CONNECTION: conn,
    store: new RedisStore({
        client: client,
        expiry: expireLimit
    }),
    max: maxLimit, // limit each IP to 100 requests per windowMs
    delayMs: delayLimit, // disable delaying - full speed until the max limit is reached
    handler: limiterhandler
});

server.use(limiter);
server.use(compression());

//start security
server.use(helmet());

server.use(serveStatic(path.join(__dirname, '../..', 'dist')));

server.get('/versions.json', limiter, (req, res) => {
    var versions = {
        version:VERSION,
        GIT_HASH:GIT_HASH
    }
    res.send(versions);
})

var parseUrl = require('parseurl');
server.use("/assets/:GIT_HASH", (req,res) => {
    
    res.setHeader('Content-Type', 'application/javascript');
    var GIT_HASH = req.params.GIT_HASH;
    
    var PATH  = parseUrl(req).pathname.replace(`/${GIT_HASH}/`, '');
    
    if(IS_DEBUG) {
        console.log(`ASSETS -> PATH=/static${PATH}`)
    }
    
    var filePath = path.join(path.join(__dirname, '../..', 'dist'), `/static${PATH}`).replace(/\\/g, '/');
    
    if(IS_DEBUG) {
        console.log(`ASSETS ->  filePath=${filePath}`)
    }
    
    if(!fs.existsSync(filePath)) {
      return res.status(404);
    }

    var data = fs.readFileSync(filePath);
    res.end(data);
})

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');
server.use(favicon(path.join(__dirname, '../..', 'dist/static/img/favicon.ico')));

var requestIp = require('request-ip');
server.use(requestIp.mw());

var ENABLE_INFLUX = /true/.test(process.env.ENABLE_INFLUX);

var COMENTARISMO_API = process.env.COMENTARISMO_API || "http://api.comentarismo.com"

// example stat collection of process memory usage
console.log("stat influxdb collection of process memory usage for this app");

setInterval(function () {
    var mem = process.memoryUsage();

    // collect this stat into the 'process-memory-usage' series
    // first argument is the data points
    // second (optional) argument are the tags
    if (ENABLE_INFLUX) {
        var Stats = require('influx-collector');

        var INFLUX_HOST = process.env.INFLUX_HOST || "178.62.232.43";
        var INFLUX_PORT = process.env.INFLUX_PORT || "8086";
        var INFLUX_TABLE = process.env.INFLUX_TABLE || "comentarismoanalytics";
        var INFLUX_USERNAME = process.env.INFLUX_USERNAME || "admin";
        var INFLUX_PASSWORD = process.env.INFLUX_PASSWORD || "admin";
        
        var uri = `http://${INFLUX_USERNAME}:${INFLUX_PASSWORD}@${INFLUX_HOST}:${INFLUX_PORT}/${INFLUX_TABLE}`;
        // create a stats collector
        var mem_stats = Stats('test', uri);
        mem_stats.collect({
            rss: mem.rss,
            heap_total: mem.heapTotal,
            heap_used: mem.heapUsed
        }, {
            pid: process.pid,
            app: 'comentarismoreact'
        });
        
        mem_stats.on("error", function (err) {
            console.log("influxdb stats err, ", err);
        });
        
        // make sure to handle errors to avoid uncaughtException
        // would be annoying if stats crashed your app :)
        mem_stats.on('error', function (err) {
            console.error("Error: mem_stats -> ", err); // or whatever you want
        });
    }
}, 10 * 1000);


var limithtml = "";
var fs = require('fs');
fs.readFile(path.join(__dirname, '404.html'), function (err, html) {
    if (!err) {
        limithtml = html;
    } else {
        console.log("Could not open html for 404 err :(")
    }
});

var url = require("url");
function limiterhandler(req, res) {
    var pathname = url.parse(req.url).pathname;
    var ip = req.clientIp;
    console.log("Too many requests -> ", ip);

    //save possible abuser to ratelimit table
    conn.table('ratelimit', {readMode: "outdated"}).get(ip).update({
        blocks: conn.row('blocks').add(1),
        pathname: conn.branch(conn.row('pathname').default([]).contains(pathname),
            conn.row('pathname'),
            conn.row('pathname').default([]).append(pathname))
    }).run().then(function (dbresult) {
        if (dbresult.skipped > 0) {
            //nothing found, so lets insert
            conn.table('ratelimit').insert({id: ip, blocks: 0, pathname: [pathname]}, {
                returnChanges: false,
                conflict: "replace"
            }).run().then(function (dbres) {
                // console.log(dbres);
            })
        }
    }).catch(function (err) {
        console.log("Error: limiterhandler, ", err);
        cb(err);
    });

    res.format({
        html: function () {
            res.status(429).end(limithtml);
        },
        json: function () {
            res.status(429).json({message: "Too many accounts created from this IP, please try again after an hour"});
        }
    });
}


server.get('/html/:page', limiter, (req,res, next) => {
    
    var page = req.params.page;
    
    //?db=test&table=commentaries&skip=100&limit=50&operator=uol&key=operator_uuid&value=uoljohan-cruyff-morre-aos-68-anos-apos-luta-contra-cancer#overview-section
    var target = `${COMENTARISMO_API}/html/${page}?db=test&table=${req.query.table}&skip=${req.query.skip}&limit=${req.query.limit}&operator=${req.query.operator}&key=${req.query.key}&value=${req.query.value}`
    
    if(IS_DEBUG){
        console.log(target)
    }
    Wreck.request("GET", target, {}, (err, response) => {
        
        if (err) {
            return res.status(500).send('Something broke!');
        }
    
        Wreck.read(response, null, (err, body) => {
    
            if (err) {
                return res.status(500).send('Something broke!');
            }
    
            res.write(body, 'binary');
            return res.end(undefined, 'binary');
        });
    });
    
    
})

server.get('/api/comment/:id', limiter, (req, res) => {
    var id = req.params.id;
    logger.info(`/comment/${id}`)
    getByID("commentaries", id, conn, function (err, data) {
        if (err || !data) {
            console.error("Error: ", `/comment/${id}`, err);
            return res.status(500).send('Something broke!');
        } else {
            res.send(data);
        }
    });
});
//
// server.get('/api/suggestcomment/:id', limiter, (req, res) => {
//     var id = req.params.id;
//     logger.info(`/comment/${id}`)
//     getByID("commentaries", id, conn, function (err, data) {
//         if (err || !data) {
//             console.error(err);
//             return res.status(500).send('Something broke!');
//         } else {
//             res.send(data);
//         }
//     });
// });

// server.get('/api/admin/r/:table/:id', limiter, (req, res) => {
//     var table = req.params.table;
//     var id = req.params.id;
//     var targetUrl = `/api/admin/r/${table}/${id}`;
//     logger.info("" + targetUrl);
//     getByID(`${table}`, id, conn, function (err, data) {
//         if (err || !data) {
//             console.error(err);
//             return res.status(500).send('Something broke!');
//         } else {
//             res.send(data);
//         }
//     });
// });
//

function getParams(req) {

    var table = req.query.table;
    var index = req.query.key;
    var value = req.query.value;
    var operator = req.query.operator;
    var skip = req.query.skip;
    var limit = req.query.limit;
    var sort = req.query.sort;
    var order = req.query.order || "desc";

    var returnObj = {
        table: table,
        index: index,
        value: value,
        operator: operator,
        skip: skip,
        limit: limit,
        sort: sort,
        order: order,
    };

    if (!table || !index || !value || !operator) {
        returnObj.error = 'Invalid inputs --> '
    } else {
        if (IS_DEBUG) {
            console.log("Will parse skip, ", req.query.skip);
            console.log("Will parse limit, ", req.query.limit);
        }

        returnObj.skip = parseInt(req.query.skip);
        returnObj.limit = parseInt(req.query.limit);
    }
    return returnObj;
}

///v1/listbykeyskiplimit?key=operator_titleurlize&sort=date&skip=0&limit=50&table=commentaries&operator=g1&value=g1texas-comeca-2016-com-lei-que-permite-porte-aberto-de-armas
server.get('/v1/listbykeyskiplimit', limiter, (req, res) => {
    var params = getParams(req);
    var urlTag = `/v1/listbykeyskiplimit?table=${params.table}&index=${params.index}&value=${params.value}&operator=${params.operator}&skip=${params.skip}&limit=${params.limit}&sort=${params.sort}&order=${params.order}`;
    if (!req.query.skip || !req.query.limit || !params.sort) {
        console.log('Error: Invalid inputs --> ', urlTag)
        return res.sendStatus(500);
    }
    if (params.error) {
        console.log("Error: ", urlTag, params.error);
        return res.sendStatus(500);
    }

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (!DISABLE_CACHE) {
            if (err || !js) {
                if (err) {
                    console.error("Error: ", urlTag, err.stack);
                    return res.sendStatus(500);
                }
            } else {
                logger.info(urlTag + " will return cached result ");
                res.type('application/json');
                return res.send(js);
            }
        }
        //-------REDIS CACHE END ------//
        getAllByMultipleIndexOrderBySkipLimit(params, conn, function (err, data) {
            if (err) {
                console.log("Error: getAllByMultipleIndexOrderBySkipLimit, ", err.stack);
                return res.sendStatus(500);
            } else {
                //-------REDIS CACHE SAVE START ------//
                if (!DISABLE_CACHE) {
                    logger.info(urlTag + " will save cached");
                    client.set(urlTag, JSON.stringify(data), 'EX', EXPIRE_REDIS);
                }
                //-------REDIS CACHE SAVE END ------//
                res.send(data);
            }
        });

    });
});

///v1/listbykeycount?key=operator_titleurlize&table=commentaries&operator=g1&value=g1texas-comeca-2016-com-lei-que-permite-porte-aberto-de-armas
server.get('/v1/listbykeycount', limiter, (req, res) => {
    var params = getParams(req);
    var urlTag = `/v1/listbykeycount?table=${params.table}&index=${params.index}&value=${params.value}&operator=${params.operator}`;

    if (params.error) {
        console.error("Error: ", urlTag, params.error);
        return res.send('Something broke!');
    }

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (!DISABLE_CACHE) {
            if (err || !js) {
                if (err) {
                    console.error("Error: ", urlTag, err.stack);
                    return res.sendStatus(500);
                }
            } else {
                logger.info(urlTag + " will return cached result ");
                res.type('application/json');
                return res.send(js);
            }
        }
        //-------REDIS CACHE END ------//

        getAllByMultipleIndexCount(params, conn, function (err, data) {
            if (err) {
                console.error("Error: ", urlTag, err.stack);
                return res.sendStatus(500);
            } else {
                //-------REDIS CACHE SAVE START ------//
                logger.info(urlTag + " will save cached");
                if (!DISABLE_CACHE) {
                    client.set(urlTag, JSON.stringify({count: data}), 'EX', EXPIRE_REDIS);
                }
                //-------REDIS CACHE SAVE END ------//
                res.json({count: data});
            }
        });

    });

});
//
// //bind to action/commentators.js -> loadCommentators
// server.get('/v1/listbykeyskiplimit', limiter, (req, res) => {
//     logger.info(req.params);
//     var index = req.params.index;
//     var value = req.params.value;
//     var skip = parseInt(req.params.skip);
//     var limit = parseInt(req.params.limit);
//
//     var sort = req.query.sort;
//
//     var urlTag = `/fapi/commentators/${index}/${value}/${skip}/${limit}?sort=${sort}`;
//     logger.info(urlTag);
//
//     //-------REDIS CACHE START ------//
//     client.get(urlTag, function (err, js) {
//         if (err || !js) {
//             if (err) {
//                 console.error(err.stack);
//                 return res.sendStatus(500);
//             }
//         } else {
//             logger.info(urlTag + " will return cached result ");
//             if (EXPIRE_REDIS) {
//                 client.expire(urlTag, 1);
//             }
//             res.type('application/json');
//             return res.send(js);
//         }
//         //-------REDIS CACHE END ------//
//
//         getAllByMultipleIndexOrderBySkipLimit("commentator", index, value, "", skip, limit, sort, conn, function (err, data) {
//             if (err) {
//                 console.error(err.stack);
//                 return res.status(500).send('Something broke!');
//             }
//
//             if (data) {
//                 //-------REDIS CACHE SAVE START ------//
//                 logger.info(urlTag + " will save cached");
//                 client.set(urlTag, JSON.stringify(data), redis.print);
//                 client.expire(urlTag, 1800);
//                 //-------REDIS CACHE SAVE END ------//
//                 res.send(data);
//             }
//
//
//         });
//
//     });
//
//
// });

//bind to action/commentators.js -> loadCommentatorDetail
server.get('/api_v2/:table/:id', limiter, (req, res) => {
    var id = req.params.id;
    var table = req.params.table || "commentator";

    var commentsTable = "";
    if (table === "commentator_product") {
        commentsTable = "commentaries_product";
    } else if (table === "commentator_sentiment_report") {
        commentsTable = "commentaries_sentiment_report";
    } else {
        commentsTable = "commentaries";
    }

    if (!id) {
        return res.status(404).send('Not found');
    }

    var urlTag = `/api/${table}/${id}`;
    logger.info(urlTag);

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (!DISABLE_CACHE) {
            if (err || !js) {
                if (err) {
                    console.error("Error: ", urlTag, err);
                }
                //return res.status(500).send('Cache is broken!');
            } else {
                logger.info(urlTag + " will return cached result ");
                res.type('application/json');
                return res.send(js);
            }
        }
        //-------REDIS CACHE END ------//

        getByID(table, req.params.id, conn, function (err, data) {
            if (err) {
                logger.info("Error: " + err);
                //console.error(err.stack);
                //return res.status(500).send('Something broke!');
            }

            if (data) {

                getCommentariesByCommentariesIds(commentsTable, data.commentariesIds, conn, function (err, commentaries) {
                    if (err) {
                        logger.info("Error: after getCommentariesByCommentariesIds ->  " + err);
                        //console.error(err.stack);
                        return res.status(404).send();
                    }
                    data.comments = commentaries;

                    //-------REDIS CACHE SAVE START ------//
                    logger.info(urlTag + " will save cached");
                    var js = JSON.stringify(data);
                    //logger.info(js);
                    if (!DISABLE_CACHE) {
                        client.set(urlTag, js, 'EX', EXPIRE_REDIS);
                    }
                    //-------REDIS CACHE SAVE END ------//
                    res.send(data);

                })
            } else {


                //retry
                var idAux = "";
                if (req.params.id.indexOf("-") !== -1) {
                    idAux = req.params.id.split("-")[1];
                }
                logger.info("commentator not found, will retry with nick, ", idAux, "original: ", req.params.id);

                if (!idAux) {
                    logger.info("Error: " + err);
                    console.error("Error: ", urlTag, err.stack);
                    return res.status(404).send();
                }

                getCommentatorByNick((idAux ? idAux : req.params.id), conn, function (err, data) {
                    if (err) {
                        logger.info("Error: after getCommentariesByCommentariesIds ->  " + err);
                        //console.error(err.stack);
                        return res.status(404).send();
                    }

                    if (data) {

                        getCommentariesByCommentariesIds(commentsTable, data.commentariesIds, conn, function (err, commentaries) {
                            if (err) {
                                logger.info("Error: after getCommentariesByCommentariesIds ->  " + err);
                                //console.error(err.stack);
                                return res.status(404).send();
                            }

                            data.comments = commentaries;


                            //-------REDIS CACHE SAVE START ------//
                            logger.info(urlTag + " will save cached");
                            if (!DISABLE_CACHE) {
                                client.set(urlTag, JSON.stringify(data), 'EX', EXPIRE_REDIS);
                            }
                            //-------REDIS CACHE SAVE END ------//

                        })

                    } else {

                        logger.info("nothing found ? how did we got here ?  getCommentatorByNick --> " + urlTag)
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
server.get('/fapi/:table/:index/:value/:filter/:filtervalue/:skip/:limit', limiter, (req, res) => {
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
        if (!DISABLE_CACHE) {
            if (err || !js) {
                if (err) {
                    console.error("Error: ", urlTag, err.stack);
                }
                //return res.status(500).send('Cache is broken!');
            } else {
                logger.info(urlTag + " will return cached result ");
                res.type('application/json');
                return res.send(js);
            }
        }
        //-------REDIS CACHE END ------//


        getAllByIndexOrderBySkipLimit(table, index, value, skip, limit, sort, conn, function (err, data) {
            if (err) {
                console.error("Error: ", urlTag, err.stack);
                return res.status(500).send('Something broke!');
            }

            if (data) {
                //-------REDIS CACHE SAVE START ------//
                logger.info(urlTag + " will save cached");
                if (!DISABLE_CACHE) {
                    client.set(urlTag, JSON.stringify(data), 'EX', EXPIRE_REDIS);
                }
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
server.get('/gapi_range/:table/:index/:value/:skip/:limit', limiter, (req, res) => {
    var table = req.params.table;
    var index = req.params.index;
    var value = req.params.value;
    var skip = parseInt(req.params.skip);
    var limit = parseInt(req.params.limit);
    var start = parseInt(req.params.start);
    var end = parseInt(req.params.end);
    var range = parseInt(req.params.range);
    if (!range) {
        //default 6 months
        range = 12
    }
    var sort = req.query.sort;
    var order = req.query.order || "desc";


    var urlTag = `/gapi_range/${table}/${index}/${value}/${skip}/${limit}?sort=${sort}&order=${order}&range=${range}`;
    // logger.info(urlTag);

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (!DISABLE_CACHE) {
            if (err || !js) {
                if (err) {
                    console.error("Error -> ", urlTag, err.stack);
                }
                //return res.status(500).send('Cache is broken!');
            } else {
                logger.info(urlTag + " will return cached result ");
                res.type('application/json');
                return res.send(js);
            }
        }
        //-------REDIS CACHE END ------//

        getAllByDateRangeIndexOrderByFilterSkipLimit(table, index, value, skip, limit, sort, order, range, conn, function (err, data) {
            if (err) {
                console.error("getAllByDateRangeIndexOrderByFilterSkipLimit -> ", err.stack);
                return res.status(500).send('Something broke!');
            }

            if (data) {
                //-------REDIS CACHE SAVE START ------//
                logger.info(urlTag + " will save cached");
                res.type('application/json');
                if (!DISABLE_CACHE) {
                    client.set(urlTag, JSON.stringify(data), 'EX', EXPIRE_REDIS);
                }
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
server.get('/gapi/:table/:index/:value/:skip/:limit', limiter, (req, res) => {
    var table = req.params.table;
    var index = req.params.index;
    var value = req.params.value;
    var skip = parseInt(req.params.skip);
    var limit = parseInt(req.params.limit);

    var sort = req.query.sort;
    var order = req.query.order || "desc";


    var urlTag = `/gapi/${table}/${index}/${value}/${skip}/${limit}?sort=${sort}&order=${order}`;
    // logger.info(urlTag);

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (!DISABLE_CACHE) {
            if (err || !js) {
                if (err) {
                    console.error("Error: ", urlTag, err.stack);
                }
                //return res.status(500).send('Cache is broken!');
            } else {
                logger.info(urlTag + " will return cached result ");
                res.type('application/json');
                return res.send(js);
            }
        }
        //-------REDIS CACHE END ------//


        getAllByIndexOrderByFilterSkipLimit(table, index, value, skip, limit, sort, order, conn, function (err, data) {
            if (err) {
                console.error("Error: ", urlTag, err.stack);
                return res.status(500).send('Something broke!');
            }

            if (data) {
                //-------REDIS CACHE SAVE START ------//
                logger.info(urlTag + " will save cached");
                res.type('application/json');
                if (!DISABLE_CACHE) {
                    client.set(urlTag, JSON.stringify(data), 'EX', EXPIRE_REDIS);
                }
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
 * commentators.js ->  loadSuggestCommentDetail()
 *
 */
server.get('/commentsapi/:table/:index/:value/:skip/:limit', limiter, (req, res) => {
    var table = req.params.table;
    var index = req.params.index;
    var value = req.params.value;
    var skip = parseInt(req.params.skip);
    var limit = parseInt(req.params.limit);

    var urlTag = `/commentsapi/${table}/${index}/${value}/${skip}/${limit}`;
    //logger.info(urlTag);

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (!DISABLE_CACHE) {
            if (err || !js) {
                if (err) {
                    console.error("Error: ", urlTag, err.stack);
                }
                //return res.status(500).send('Cache is broken!');
            } else {
                if (IS_DEBUG) {
                    console.log(urlTag + " will return cached result");
                }
                res.type('application/json');
                return res.send(js);
            }
        }
        //-------REDIS CACHE END ------//

        getAllByIndexOrderBySkipLimit(table, index, value, skip, limit, "date", conn, function (err, data) {
            if (err) {
                console.error("Error: ", urlTag, err.stack);
                return res.status(500).send('Something broke!');
            }

            if (data) {
                //-------REDIS CACHE SAVE START ------//
                if (IS_DEBUG) {
                    console.log(urlTag + " will save cached");
                }
                res.type('application/json');
                if (!DISABLE_CACHE) {
                    client.set(urlTag, JSON.stringify(data), 'EX', EXPIRE_REDIS);
                }
                //-------REDIS CACHE SAVE END ------//
            }
            res.send(data);
        });

    });
});

//bind to action/articles.js -> loadArticleDetail
server.get('/api/news/:id', limiter, (req, res) => {
    var sort = req.query.sort;

    var urlTag = `/api/news/${req.params.id}`;
    //logger.info(urlTag);

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (!DISABLE_CACHE) {
            if (err || !js) {
                if (err) {
                    console.error("Error: ", urlTag, err.stack);
                }
                //return res.status(500).send('Cache is broken!');
            } else {
                logger.info(urlTag + " will return cached result ");
                res.type('application/json');
                return res.send(js);
            }
        }
        //-------REDIS CACHE END ------//

        var uuid = conn.uuid(req.params.id);
        getOneBySecondaryIndex("news", "titleurlize", req.params.id, conn, function (err, news) {
            if (err) {
                console.error("Error: ", urlTag, err.stack);
                return res.status(500).send('Something broke!');
            } else if (!news) {
                logger.info("News not found --> " + req.params.id);
                return res.status(404).send("News not found --> " + req.params.id);
            }

            // "", "", uuid, 0, 50
            var table = "commentaries";
            var index = "operator_uuid";
            var value = uuid;
            var operator = news.operator;
            var skip = 0;
            var limit = 50;
            var sort = "date";
            var order = req.query.order || "desc";

            var params = {
                table: table,
                index: index,
                value: value,
                operator: operator,
                skip: skip,
                limit: limit,
                sort: sort,
                order: order,
            };

            getAllByMultipleIndexOrderBySkipLimit(params, conn, function (err, comments) {
                if (err) {
                    console.error("Error: ", urlTag, err.stack);
                    return res.status(500).send('Something broke!');
                }
                //logger.info(comments.length)
                news.comments = comments;

                if (news) {
                    //-------REDIS CACHE SAVE START ------//
                    logger.info(urlTag + " will save cached");
                    if (!DISABLE_CACHE) {
                        client.set(urlTag, JSON.stringify(news), 'EX', EXPIRE_REDIS);
                    }
                    //-------REDIS CACHE SAVE END ------//
                }
                res.send(news);
            });
        });

    });

});


//bind to action/articles.js -> loadArticleDetail
server.get('/api/product/:id', limiter, (req, res) => {
    var sort = req.query.sort;

    var urlTag = `/api/product/${req.params.id}`;
    //logger.info(urlTag);

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (!DISABLE_CACHE) {
            if (err || !js) {
                if (err) {
                    console.error("Error: ", urlTag, err.stack);
                }
                //return res.status(500).send('Cache is broken!');
            } else {
                logger.info(urlTag + " will return cached result ");
                res.type('application/json');
                return res.send(js);
            }
        }
        //-------REDIS CACHE END ------//


        getOneBySecondaryIndex("product", "titleurlize", req.params.id, conn, function (err, news) {
            if (err) {
                console.error("Error: ", urlTag, err.stack);
                return res.status(500).send('Something broke!');
            } else if (!news) {
                logger.info("Product not found --> " + req.params.id);
                return res.status(404).send("News not found --> " + req.params.id);
            }
            getAllByIndexOrderBySkipLimit("commentaries_product", "titleurlize", req.params.id, 0, 50, sort, conn, function (err, comments) {
                if (err) {
                    console.error("Error: ", urlTag, err.stack);
                    return res.status(500).send('Something broke!');
                }
                //logger.info(comments.length)
                news.comments = comments;

                if (news) {
                    //-------REDIS CACHE SAVE START ------//
                    logger.info(urlTag + " will save cached");
                    if (!DISABLE_CACHE) {
                        client.set(urlTag, JSON.stringify(news), 'EX', EXPIRE_REDIS);
                    }
                    //-------REDIS CACHE SAVE END ------//
                }
                res.send(news);
            });
        });

    });

});

var comentarismosite = "http://www.comentarismo.com";
var {
    getLatestNewsGroupDay, getLatestNewsCommentatorsGroupDay, getLatestNewsWithCommentGroupDay,
    getLatestProductsWithCommentGroupDay, getLatestProductsCommentatorsGroupDay,
    getLatestYoutubeWithCommentGroupDay, getLatestYoutubeCommentatorsGroupDay
} = require("./comentarismo_api");
server.get('/apihomepage/', limiter, (req, res) => {


    var index = req.query.index;
    var value = req.query.value;


    var urlTag = `apihomepage?index=${index}&value=${value}`;

    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (!DISABLE_CACHE) {
            if (err || !js) {
                if (err) {
                    console.log("Error: apihomepage err ", err);
                }
                //return res.status(500).send('Cache is broken!');
            } else {
                if (IS_DEBUG) {
                    console.log("apihomepage will return cached result");
                }
                res.type('application/json');
                return res.send(js);
            }
        }
        //-------REDIS CACHE END ------//

        if (index === "product") {
            getLatestProductsWithCommentGroupDay(index, value, conn, function (err, news) {

                if (err) {
                    console.log("Error: getLatestCommentatorsGroupDay -> ", err);
                    return res.status(500).send({});
                } else {
                    //get commentators reduced
                    getLatestProductsCommentatorsGroupDay(index, value, conn, function (err, commentators) {

                        var result = {
                            news: news,
                            commentators: commentators
                        };

                        if (err) {
                            console.log("Error: getLatestNewsGroupDay, getLatestCommentatorsGroupDay -> ", err);
                            return res.send(result);
                        } else {

                            if (!DISABLE_CACHE) {
                                if (IS_DEBUG) {
                                    console.log(urlTag + " will save cached");
                                }
                                client.set(urlTag, JSON.stringify(result), 'EX',
                                    EXPIRE_REDIS);
                            }
                            return res.send(result);
                        }
                    })
                }
            })
        } else if (index === "youtube") {
            getLatestYoutubeWithCommentGroupDay(index, value, conn, function (err, news) {

                if (err) {
                    console.log("Error: getLatestCommentatorsGroupDay -> ", err);
                    return res.status(500).send({});
                } else {
                    //get commentators reduced
                    getLatestYoutubeCommentatorsGroupDay(index, value, conn, function (err, commentators) {

                        var result = {
                            news: news,
                            commentators: commentators
                        };

                        if (err) {
                            console.log("Error: getLatestNewsGroupDay, getLatestCommentatorsGroupDay -> ", err);
                            return res.send(result);
                        } else {

                            if (!DISABLE_CACHE) {
                                if (IS_DEBUG) {
                                    console.log(urlTag + " will save cached");
                                }
                                client.set(urlTag, JSON.stringify(result), 'EX',
                                    EXPIRE_REDIS);
                            }
                            return res.send(result);
                        }
                    })
                }
            })
        } else {

            getLatestNewsWithCommentGroupDay(index, value, conn, function (err, news) {

                if (err) {
                    console.log("Error: getLatestCommentatorsGroupDay -> ", err);
                    return res.status(500).send({});
                } else {
                    //get commentators reduced
                    getLatestNewsCommentatorsGroupDay(index, value, conn, function (err, commentators) {

                        var result = {
                            news: news,
                            commentators: commentators
                        };

                        if (err) {
                            console.log("Error: getLatestNewsGroupDay, getLatestCommentatorsGroupDay -> ", err);
                            return res.send(result);
                        } else {

                            if (!DISABLE_CACHE) {
                                if (IS_DEBUG) {
                                    console.log(urlTag + " will save cached");
                                }
                                client.set(urlTag, JSON.stringify(result), 'EX',
                                    EXPIRE_REDIS);
                            }
                            return res.send(result);
                        }
                    })
                }
            })
        }
    })

});


server.get('/api/getalldistinctybyindex/:table/:index/:value', limiter, (req, res) => {

    var urlTag = `/api/getalldistinctybyindex/${req.params.table}/${req.params.index}/${req.params.value}`;
    //-------REDIS CACHE START ------//
    client.get(urlTag, function (err, js) {
        if (!DISABLE_CACHE) {
            if (err || !js) {
                if (err) {
                    console.log("Error: " + urlTag + " err ", err);
                }
                //return res.status(500).send('Cache is broken!');
            } else {
                if (IS_DEBUG) {
                    console.log(urlTag+" will return cached result");
                }
                res.type('application/json');
                return res.send(js);
            }
        }
        //-------REDIS CACHE END ------//

        getAllDistinctByIndex(conn, req.params.table, req.params.index, req.params.value).then((result) => {
            if (!DISABLE_CACHE && result.length > 0) {
                client.set(urlTag, JSON.stringify(result), 'EX', '2592000');
            }
            res.type('application/json');
            return res.send(result);
        }).catch((err) => {
            console.log("Error: getAllDistinctByIndex -> ", err);
            return res.status(500).send([])
        })
    })
});


server.get('/intropage/:table/:index/:value/:skip/:limit', limiter, (req, res) => {

    var table = req.params.table;
    var index = req.params.index;
    var value = req.params.value;
    var skip = parseInt(req.params.skip);
    var limit = parseInt(req.params.limit);

    var urlTag = `/${table}/${index}/${value}/${skip}/${limit}`;
    if (IS_DEBUG) {
        console.log(urlTag);
    }

    //-------REDIS CACHE START ------//
    client.get("intropage" + urlTag, function (err, js) {
        if (!DISABLE_CACHE) {
            if (err || !js) {
                if (err) {
                    console.log("Error: intropage err ", err);
                }
                //return res.status(500).send('Cache is broken!');
            } else {
                if (IS_DEBUG) {
                    console.log("intropage" + urlTag + " will return cached result");
                }
                res.type('application/json');
                return res.send(js);
            }
        }
        //-------REDIS CACHE END ------//

        let {getAlexaRank} = require('./alexa_api');

        getAlexaRank(comentarismosite, table, index, value, skip, limit, "date", 50, conn, function (err, alexarank) {
            if (err) {
                console.log("Error: getAlexaRank, ", urlTag)
                return res.status(500).send({});
            } else {
                if (!DISABLE_CACHE) {
                    client.set("intropage" + urlTag, JSON.stringify(alexarank),
                        'EX', EXPIRE_REDIS);
                }
                res.type('application/json');
                //-------REDIS CACHE SAVE END ------//
                //get comments
                return res.send(alexarank);
            }
        });
    });
});


server.get("/random", limiter, (req, res) => {
    conn.table("sentiment_report", {readMode: "outdated"})
        .sample(1)
        .run().then(function (results) {
        if (!results) {
            if (IS_DEBUG) {
                console.log("Got nothing when doing /random --> :| ");
            }
            return res.redirect(301, "/topvideos/type/YouTubeVideo");
        } else {
            var theone = results[0];

            return res.redirect(301, "/sentiment/" + encodeURIComponent(theone.url));
        }
    }).catch(function (err) {
        console.log("Got an error when doing /random --> ", err);
        return res.redirect(301, "/topvideos/type/YouTubeVideo");
    })
});

//TODO: cache sitemap with redis

server.get('*', limiter, (req, res, next) => {
    let history = createMemoryHistory({
      initialEntries: [ '/' ],  // The initial URLs in the history stack
      initialIndex: 0,          // The starting index in the history stack
      keyLength: 6,             // The length of location.key
      // A function to use to confirm navigation with the user. Required
      // if you return string prompts from transition hooks (see below)
      getUserConfirmation: null
    });
    let location = createLocation(req.url);
    let reqUrl = location.pathname + location.search;

    let store = configureStore();
    let routes = createRoutes(history);

    //sitemap
    if (reqUrl.indexOf("sitemap.xml") !== -1) {
        logger.info("Will generate sitemap.xml for request --> " + reqUrl);

        var urlTag = "sitemap.xml";
        //-------REDIS CACHE START ------//
        client.get(urlTag, function (err, js) {
            if (!DISABLE_CACHE) {
                if (err || !js) {
                    if (err) {
                        logger.info("Error: Redis client " + location, err.stack);
                        return res.status(500).send("Server unavailable");
                    }
                    //return res.status(500).send('Cache is broken!');
                } else {
                    logger.info(urlTag + " will return cached result ");
                    res.header('Content-Type', 'application/xml');
                    return res.send(js);
                }
            }
            //-------REDIS CACHE END ------//

            generateSitemap(conn, function (err, xml) {
                if (!xml) {
                    logger.info("Error: generateSitemap " + location);
                    logger.info("Error generateSitemap sitemap.xml --> ");
                    console.error("Error: ", urlTag, err.stack);
                    res.status(500).send("Server unavailable");
                    return;
                }

                if (xml) {
                    //-------REDIS CACHE SAVE START ------//
                    console.log(urlTag + " will save cached");
                    if (!DISABLE_CACHE) {
                        client.set(urlTag, xml, 'EX', EXPIRE_REDIS);
                    }
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

        logger.info("table: " + table + " index: " + index + " value: " + value);

        if (table === "topvideos") {
            table = "sentiment_report"
        }

        if (table === "news" || table === "commentators" || table === "commentators_product" || table === "product" || table === "sentiment_report") {

            var urlTag = "index.xml_" + table + "_" + index + "_" + value;
            //-------REDIS CACHE START ------//
            client.get(urlTag, function (err, js) {
                if (!DISABLE_CACHE) {
                    if (err || !js) {
                        if (err) {
                            console.error("Error: section sitemap -> ", urlTag, err.stack);
                        }
                        //return res.status(500).send('Cache is broken!');
                    } else {
                        logger.info(urlTag + " will return cached result ");
                        res.header('Content-Type', 'application/xml');
                        return res.send(js);
                    }
                }
                //-------REDIS CACHE END ------//

                generateIndexXml(table, index, value, conn, function (err, xml) {
                    if (err || !xml) {
                        logger.info("Error: generateSitemap sitemap.xml, will return 500 server unavailable --> ");
                        if (err) {
                            console.log("Error: ", urlTag, err.stack);
                        }
                        return res.status(500).send("Server unavailable");
                    }

                    if (xml) {
                        //-------REDIS CACHE SAVE START ------//
                        if (!DISABLE_CACHE) {
                            if (!DISABLE_CACHE) {
                                client.set(urlTag, xml, 'EX', EXPIRE_REDIS);
                            }
                        }
                        //-------REDIS CACHE SAVE END ------//
                    }
                    res.header('Content-Type', 'application/xml');
                    return res.send(xml);
                });

            });

        } else {
            //not alllowed
            logger.info("Error generateSitemap index.xml --> not alllowed --> Server unavailable");
            return res.status(500).send("Server unavailable");
        }

    } else {

        //logger.info(location);
        // console.log("React Render ", location.pathname)
        match({routes, location}, (error, redirectLocation, renderProps) => {
            if (redirectLocation) {
                return res.redirect(301, redirectLocation.pathname + redirectLocation.search);
            } else if (error) {
                logger.info("Error: 500 internal error " + location, error.stack);
                return res.status(500).send(error.message);
            }

            let [getCurrentUrl, unsubscribe] = subscribeUrl();

            getReduxPromise().then(() => {
                let reduxState = JSON.stringify(store.getState());
                let html = ReactDOMServer.renderToString(
                    <Provider store={store}>
                        { <RouterContext {...renderProps}/> }
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
                if (head.title.toString() === "<title data-react-helmet=\"true\"></title>") {
                    head.title = "<title data-react-helmet=\"true\">Loading ... </title>";
                }

                var searchCss = [];
                // if (reqUrl.indexOf("/search") !== -1
                //     || reqUrl.indexOf("/jcp") !== -1) {
                // searchCss.push("/static/search_theme.css")
                // }

                if (getCurrentUrl() === reqUrl) {
                    res.render('index', {html, head, scriptSrcs, reduxState, styleSrc, searchCss});
                } else {
                    logger.info("Redirect 302 " + location);
                    res.redirect(302, getCurrentUrl());
                }

                unsubscribe();
            })
                .catch((err) => {
                    unsubscribe();
                    next(err);
                });
            function getReduxPromise() {
                let {query, params} = renderProps;
                if (!renderProps.components[renderProps.components.length - 1]) {
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
            let unsubscribe = history.listen((newLoc) => {
                if (newLoc.action === 'PUSH') {
                    currentUrl = newLoc.pathname + newLoc.search;
                }
            });
            return [
                () => currentUrl,
                unsubscribe
            ];
        }
    }
});

server.on('error', (err) => {
    // console.error("server.on('error' --> ", err);
    console.log("Got error on server level, something may be really wrong!!! ")
});

server.use((err, req, res, next) => {
    if (err) {
        // console.error("server.use((err, --> ", err);
        // logger.info("err stack ", err.stack);
        // console.log("Error: server.use((err, req, res, next) => ", err);
        console.log("Got error on server.use, something may be really wrong!!! ")
    }
    // TODO report error here or do some further handlings

    res.status(500).send("something went wrong... --> " + err.stack)
});

logger.info(`Server is listening to port: ${port}`);
server.listen(port);