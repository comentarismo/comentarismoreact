let _ = require('lodash')

var xml2js = require("xml2js");
var superAgent = require("superagent");
import config from 'config'
var host = config.BASE_URL;
import r from 'rethinkdb';

/** LOGGER **/
var log = require("./logger");
var logger = log.getLogger();
/** LOGGER **/

export function getAlexaRank(url, table, index, value, skip, limit, sort, conn, cb) {

    superAgent.get('http://data.alexa.com/data?cli=10&url=' + url).end(function (err, r) {
        //console.log(r);
        if (err) {
            cb(err);
        } else if (r.statusCode != 200) {
            cb("statusCode != 200 --> " + r.statusCode);
        } else {
            xml2js.parseString(r.text, {
                normalizeTags: true,
                explicitArray: false
            }, function (err, result) {

                if (err || !result) {
                    logger.error(err);
                    cb("Error when doing xml2js.parseString of --> " + r.text);
                } else {
                    //console.log(JSON.stringify(result));

                    var alexa = {
                        popularity: {
                            URL: result.alexa.sd.popularity.$.URL,
                            TEXT: result.alexa.sd.popularity.$.TEXT,
                            SOURCE: result.alexa.sd.popularity.$.SOURCE
                        },
                        reach: {
                            RANK: result.alexa.sd.reach.$.RANK
                        },
                        rank: {
                            DELTA: result.alexa.sd.rank.$.DELTA
                        },
                        country: {
                            CODE: result.alexa.sd.country.$.CODE,
                            NAME: result.alexa.sd.country.$.NAME,
                            RANK: result.alexa.sd.country.$.RANK
                        }
                    };

                    //var target = `${host}/${urlTag}`;

                    getAllByIndexOrderByFilterDateSkipLimit(table, index, value, skip, limit, sort, conn, function (err, r) {
                        if (err) {
                            cb("error when running --> " + target);
                        } else {
                            var data = {
                                alexa: alexa,
                                comment: r
                            };
                            cb(null, data);
                        }
                    });

                }
            })

        }
    });
}

export function getAllByIndexOrderByFilterDateSkipLimit(table, index, value, skip, limit, sort, conn, cb) {
    if (!table || !index || !value) {
        logger.warn("table --> " + table + " index -> " + index + " value --> " + value);
        logger.warn("getAllByIndexOrderByFilterDateSkipLimit --> search query is not correct.");
        return cb()
    }
    var indexSort = "date";
    if (sort) {
        indexSort = sort;
    }
    console.log("getAllByIndexOrderByFilterDateSkipLimit",table, index, value, skip, limit, sort)

    r.table(table)
        .getAll(value, {index: index})
        .filter(r.row(indexSort).lt(r.now()))
        .limit(50000)
        .orderBy(r.desc(indexSort))
        .skip(skip).limit(limit)
        .run(conn, function (err, cursor) {
            if (err || !cursor) {
                console.log(err);
                cb(err);
            } else {
                cursor.toArray(function (err, results) {
                    if (err) return cb(err);
                    console.log(results.length);
                    cb(null, results);
                });
            }
        });
}