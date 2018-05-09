import path from 'path'

var url = require('url')

var expireLimit = process.env.EXPIRE_LIMIT || 60
var maxLimit = process.env.MAX_LIMIT || 20
var delayLimit = process.env.DELAY_LIMIT || 0

var RateLimit = require('server/handlers/express-rate-limit')
var RedisStore = require('server/db/redis-store')
var utils = require('server/utils/utils')

import logger from 'server/logger_middleware'

module.exports = function (app, REDIS_CONNECTION, RETHINKDB_CONNECTION) {
    
    function limiterhandler (req, res) {
        var pathname = url.parse(req.url).pathname
        var ip = req.clientIp
        logger.debug('Too many requests -> ', ip)
        
        //save possible abuser to ratelimit table
        RETHINKDB_CONNECTION.table('ratelimit', {readMode: 'outdated'}).
            get(ip).
            update({
                blocks: RETHINKDB_CONNECTION.row('blocks').add(1),
                pathname: RETHINKDB_CONNECTION.branch(
                    RETHINKDB_CONNECTION.row('pathname').
                        default([]).
                        contains(pathname),
                    RETHINKDB_CONNECTION.row('pathname'),
                    RETHINKDB_CONNECTION.row('pathname').
                        default([]).
                        append(pathname)),
            }).
            run().
            then(function (dbresult) {
                if (dbresult.skipped > 0) {
                    //nothing found, so lets insert
                    RETHINKDB_CONNECTION.table('ratelimit', {readMode: 'outdated'}).
                        insert({id: ip, blocks: 0, pathname: [pathname]}, {
                            returnChanges: false,
                            conflict: 'replace',
                        }).
                        run().
                        then(function (dbres) {
                            // logger.debug(dbres);
                        })
                }
            }).
            catch(function (err) {
                logger.error('Error: limiterhandler, ', err)
            })
        
        res.format({
            html: function () {
                res.status(429).sendFile(path.join(__dirname, '../errors', '429.html'))
            },
            json: function () {
                res.status(429).
                    json(
                        {message: 'Too many accounts created from this IP, please try again after an hour'})
            },
        })
    }
    
    var limiter = new RateLimit({
        RETHINKDB_CONNECTION: RETHINKDB_CONNECTION,
        store: new RedisStore({
            client: REDIS_CONNECTION,
            expiry: expireLimit,
        }),
        max: maxLimit, // limit each IP to 100 requests per windowMs
        delayMs: delayLimit, // disable delaying - full speed until the max limit is reached
        handler: limiterhandler,
    })
    
    return limiter
}