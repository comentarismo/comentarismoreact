let _ = require('lodash')

var xml2js = require("xml2js");
var superAgent = require("superagent");
import config from 'config'
var host = config.BASE_URL;
import r from 'rethinkdb';

let {getSample} = require("./comentarismo_api");

/** LOGGER **/
var log = require("./logger");
var logger = log.getLogger();
/** LOGGER **/

export function getAlexaRank(url, table, index, value, skip, limit, sort,sample, conn, cb) {

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
                    //table, index, value, skip, limit, sort, conn, cb
                    getSample(table, index, value, skip, limit, sort,sample, conn, function (err, r) {
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