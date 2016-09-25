var xml2js = require("xml2js");
//var config = require('config')
//var ELK_URL = config.ELK_URL;
var ELK_URL = "http://188.166.57.236:8080";

/** LOGGER **/
var log = require("./logger");
var logger = log.getLogger();
/** LOGGER **/

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: ELK_URL,
    log: 'info'
});
export function getElkByQuery(index, type, query, cb) {
    console.log("getElkByQuery, ",index, type, query)

    client.search({
        index: index,
        type: type,
        body: {
            query: query.query
        }
    }, function (err, resp) {
        if (err) {
            console.trace(err.message);
            cb(err);
        } else {
            var hits = resp.hits.hits;
            var target = [];
            filterArray(hits,0,target,function(result){

                console.log(result);

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
            console.log("filterArray err: ",err);
        }
        i = i + 1;
        filterArray(hits, i, target, cb);
    } else {
        cb(target);
    }
}
//
//getElkByQuery('g1', 'commentaries', {
//    "query": {
//        "bool": {
//            "should": [
//                {
//                    "simple_query_string": {
//                        "query": "Thomas",
//                        "fields": [
//                            "new_val.nick"]
//                    }
//                }]
//        }
//    },
//    "size": 100
//}, function (err, resp) {
//
//    console.log("Yey", resp)
//});


//{"query":{"bool":{"should":[{"simple_query_string":{"query":"Figueiredo","fields":["nick"]}}]}},"size":10,"_source":["new_val.nick"]}
//
//{"query":{"bool":{"should":[{"simple_query_string":{"query":"brexit","fields":["_all"]}},{"multi_match":{"query":"brexit","type":"phrase_prefix","fields":["nick","genre","operator","title","language","sentiment"]}}]}},"aggs":{"new_val.languages3":{"filter":{},"aggs":{"new_val.languages":{"terms":{"field":"new_val.languages","size":1}},"new_val.languages_count":{"cardinality":{"field":"new_val.languages"}}}},"new_val.nick4":{"filter":{},"aggs":{"new_val.nick":{"terms":{"field":"new_val.nick","size":5}},"new_val.nick_count":{"cardinality":{"field":"new_val.nick"}}}},"new_val.sentiment5":{"filter":{},"aggs":{"new_val.sentiment":{"terms":{"field":"new_val.sentiment","size":5}},"new_val.sentiment_count":{"cardinality":{"field":"new_val.sentiment"}}}},"new_val.operator":{"filter":{},"aggs":{"new_val.operator":{"filter":{},"aggs":{"new_val.operator":{"terms":{"field":"new_val.operator","size":0}}}}}}},"size":10,"_source":["new_val.title","new_val.comment","new_val.nick","new_val.operator","new_val.sentiment"]}
