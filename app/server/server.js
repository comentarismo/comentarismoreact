
import path from 'path';
import os from 'os';

import favicon from 'serve-favicon';
import serveStatic from 'serve-static';
import timeout from 'connect-timeout';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import Express from 'express';

//Helmet package - 11 security modules
const helmet = require('helmet');

import logger, { logMiddleware } from 'server/logger_middleware';
const utils = require('server/utils/utils')

const requestIp = require('request-ip')
const compress = require('compression')

const REDIS_HOST = process.env.REDIS_HOST || 'g7-box'
const REDIS_PORT = process.env.REDIS_PORT || 6379
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''
const EXPIRE_REDIS = process.env.EXPIRE_REDIS || '3600'
const DISABLE_CACHE = process.env.DISABLE_CACHE === 'false'

const RETHINKDB_HOST = process.env.RETHINKDB_HOST || 'g7-box'
const RETHINKDB_PORT = process.env.RETHINKDB_PORT || 28015
const RETHINKDB_PASSWORD = process.env.RETHINKDB_PASSWORD
const RETHINKDB_TABLE = process.env.RETHINKDB_TABLE || 'test'
const RETHINKDB_TIMEOUT = process.env.RETHINKDB_TIMEOUT || 120
const RETHINKDB_DISCOVERY = /true/.test(process.env.RETHINKDB_DISCOVERY)

const PORT = process.env.PORT || 3002

const REDIS_CONNECTION = require('server/db/redis').
    createRedisClient(REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, EXPIRE_REDIS,
        DISABLE_CACHE)
const RETHINKDB_CONNECTION = require('server/db/rethinkdb').
    createRethinkDBClient(RETHINKDB_HOST, RETHINKDB_PORT, RETHINKDB_PASSWORD,
        RETHINKDB_TABLE, RETHINKDB_TIMEOUT, RETHINKDB_DISCOVERY)

const app = new Express()

//disable powered by
app.disable('x-powered-by');

//set timeout for all requests 20s
app.use(timeout(20000));

//parse json
app.use(bodyParser.json());

//parse cookies
app.use(cookieParser());

// add robots.txt
app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  const robotstxt = utils.getRobotsTXT()
  res.send(robotstxt);
});

const limiter = require('server/handlers/limiter_handler')(app, REDIS_CONNECTION,
    RETHINKDB_CONNECTION)

// ******************* START MIDDLEWARES ******************* //

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(compress())

// security
app.use(helmet())

app.use(serveStatic(path.join(__dirname, '../..', 'dist')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(favicon(path.join(__dirname, '../..', 'dist/static/img/favicon.ico')))

app.use(requestIp.mw())

app.use(limiter)

app.post('/log', logMiddleware);


// ******************* END MIDDLEWARES ******************* //



// ******************* START ROUTES ******************* //

require('server/handlers/api_handler')(app, REDIS_CONNECTION,
    RETHINKDB_CONNECTION, limiter)

require('server/handlers/health_handler')(app, REDIS_CONNECTION,
    RETHINKDB_CONNECTION, limiter)

require('server/handlers/react_handler')(app, REDIS_CONNECTION,
    RETHINKDB_CONNECTION, limiter)

require('server/handlers/error_handler')(app, REDIS_CONNECTION,
    RETHINKDB_CONNECTION, limiter)

// ******************* END ROUTES ******************* //


var server = app.listen(PORT, () => {
  logger.info(`Express started PORT=${PORT}, HOSTNAME=${os.hostname()} `);
});


module.exports = server;
