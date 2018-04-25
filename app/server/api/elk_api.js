var xml2js = require("xml2js");
//var config = require('config')
//var ELK_URL = config.ELK_URL;
// var ELK_URL = "http://188.166.57.236:8080";
var ELK_URL = process.env.ELASTICSEARCH_HOST || "http://147.75.100.173:8080";

/** LOGGER **/
import logger from 'server/logger_middleware'
/** LOGGER **/

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: ELK_URL,
    log: 'info'
});
export function getElkByQuery(index, type, query, cb) {
    // console.log("getElkByQuery, ",index, type, query)

    client.search({
        index: index,
        type: type,
        body: {
            query: query.query
        },
        requestTimeout : 5000
    }, function (err, resp) {
        if (err) {
            logger.error(err.message);
            cb(err);
        } else {
            var hits = resp.hits.hits;
            var target = [];
            filterArray(hits,0,target,function(result){

                // console.log(result);

                cb(null, result);
            })


        }
    });
}

function filterArray(hits, i, target, cb) {
    var row = hits[i];
    if (row) {
        try {
            var r = row["_source"];
            target.push(r);
        }catch(e){
            logger.error("Error: filterArray err: ",e);
        }
        i = i + 1;
        filterArray(hits, i, target, cb);
    } else {
        cb(target);
    }
}
