let _ = require('lodash')

//get all nicks for a operator
//get all nicks for a language
//get all nicks for a genregetAllByIndexOrderByFilterSkipLimit
//get commentator profile by nickurlize

//r.db('test').table('commentaries').between(new Date().getDate()-5, r.maxval, {index: 'updatedAt'})
/** LOGGER **/
var log = require("./logger");
var logger = log.getLogger();
/** LOGGER **/

var elk_api = require("./elk_api");

var errMsg = "Error: ";
var moment = require("moment");

var LATEST_NEWS_DAYS_STR = process.env.LATEST_NEWS_DAYS;
var LATEST_NEWS_DAYS = 30;

if (LATEST_NEWS_DAYS_STR) {
    LATEST_NEWS_DAYS = parseInt(LATEST_NEWS_DAYS_STR)
}

var LATEST_PRODUCT_DAYS_STR = process.env.LATEST_PRODUCT_DAYS;
var LATEST_PRODUCT_DAYS = 60;

if (LATEST_PRODUCT_DAYS_STR) {
    LATEST_PRODUCT_DAYS = parseInt(LATEST_PRODUCT_DAYS_STR)
}

var LATEST_YOUTUBE_DAYS_STR = process.env.LATEST_YOUTUBE_DAYS;
var LATEST_YOUTUBE_DAYS = 180;

if (LATEST_YOUTUBE_DAYS_STR) {
    LATEST_YOUTUBE_DAYS = parseInt(LATEST_YOUTUBE_DAYS_STR)
}

var MAX_SITEMAP_LIMIT = process.env.MAX_SITEMAP_LIMIT;
if(MAX_SITEMAP_LIMIT){
    MAX_SITEMAP_LIMIT = parseInt(MAX_SITEMAP_LIMIT);
}else {
    MAX_SITEMAP_LIMIT = 50000;
}

export function getLatestNewsGroupDay(conn, cb) {

    var query = conn.table('news', {readMode: "outdated"}).between(conn.now().sub(LATEST_NEWS_DAYS * 86400), conn.now(),
        {index: 'date'}).orderBy({index: conn.desc('date')}).group([conn.row('date').month(), conn.row('operator')])
        .ungroup().map(function (row) {
            return {
                group: row("group"),
                reduction: row("reduction").map(function (r) {
                    return {
                        id: r('id'),
                        titleurlize: r('titleurlize'),
                        title: r('title'),
                        author: r('author'),
                        summary: r('summary'),
                        image: r('image'),
                        totalComments: r('totalComments'),
                        languages: r('languages'),
                        date: r('date')
                    }
                }).limit(1)
            }
        })

    console.log("getLatestNewsGroupDay query -> ", query);

    // console.log("getLatestNewsGroupDay, query, ", query);

    query
        .run().then(function (results) {
        if (!results) {
            cb("Error: Could not get getLatestNewsGroupDay");
        } else {
            console.log("getLatestNewsGroupDay result -> ", results.length)
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getLatestNewsGroupDay, ", err);
        cb(err);
    })

}


export function getLatestNewsCommentatorsGroupDay(index, value, conn, cb) {

    var query = conn.table('commentator', {readMode: "outdated"}).between(conn.now().sub(LATEST_NEWS_DAYS * 86400), conn.now(),
        {index: 'maxDate'}).orderBy({index: conn.desc('maxDate')}).limit(5000).group([conn.row('maxDate').month(), conn.row('operator')])
        .ungroup().map(function (row) {
            return {
                group: row("group"),
                reduction: row("reduction").map(function (r) {
                    return r
                }).limit(5)
            }
        });
    console.log("getLatestNewsCommentatorsGroupDay query -> ", query);


    query
        .run().then(function (results) {
        if (!results) {
            cb("Error: Could not get getLatestNewsCommentatorsGroupDay");
        } else {
            console.log("getLatestNewsCommentatorsGroupDay result -> ", results.length)
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getLatestNewsCommentatorsGroupDay, ", err);
        cb(err);
    })
}
export function getLatestNewsWithCommentGroupDay(index, value, conn, cb) {
    var query = conn.table('news', {readMode: "outdated"}).between(conn.now().sub(LATEST_NEWS_DAYS * 86400), conn.now(),
        {index: 'date'}).orderBy({index: conn.desc('date')}).limit(1000)
        .concatMap(function (row) {
            return conn.table("commentaries", {readMode: "outdated"}).getAll([row("operator"), row("titleurlize")], {index: 'operator_titleurlize'}).limit(1).map(function (comment) {
                return row.merge({comment: comment});
            })
        }).group([conn.row('date').month(), conn.row('operator')])
        .ungroup().map(function (row) {
            return {
                group: row("group"),
                reduction: row("reduction").map(function (r) {
                    return {
                        id: r('id'),
                        titleurlize: r('titleurlize'),
                        title: r('title'),
                        author: r('author'),
                        summary: r('summary'),
                        image: r('image'),
                        totalComments: r('totalComments'),
                        languages: r('languages'),
                        date: r('date'),
                        comment: r('comment')
                    }
                }).limit(1)
            }
        });

    console.log("getLatestNewsWithCommentGroupDay query -> ", query);

    query
        .run().then(function (results) {
        if (!results) {
            cb("Error: Could not get getLatestNewsWithCommentGroupDay");
        } else {
            console.log("getLatestNewsWithCommentGroupDay result -> ", results.length)
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getLatestNewsWithCommentGroupDay, ", err);
        cb(err);
    })

}


export function getLatestYoutubeCommentatorsGroupDay(index, value, conn, cb) {

    var query = conn.table('commentator_sentiment_report', {readMode: "outdated"}).between(conn.now().sub(LATEST_YOUTUBE_DAYS * 86400), conn.now(),
        {index: 'maxDate'}).orderBy({index: conn.desc('maxDate')}).limit(5000).group([conn.row('maxDate').month(), conn.row('operator')])
        .ungroup().map(function (row) {
            return {
                group: row("group"),
                reduction: row("reduction").map(function (r) {
                    return r
                }).limit(5)
            }
        });
    console.log("getLatestYoutubeCommentatorsGroupDay query -> ", query);


    query
        .run().then(function (results) {
        if (!results) {
            cb("Error: Could not get getLatestYoutubeCommentatorsGroupDay");
        } else {
            console.log("getLatestYoutubeCommentatorsGroupDay result -> ", results.length);
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getLatestYoutubeCommentatorsGroupDay, ", err);
        cb(err);
    });
}

export function getLatestYoutubeWithCommentGroupDay(index, value, conn, cb) {
    var query = conn.table('sentiment_report', {readMode: "outdated"}).between(conn.now().sub(LATEST_YOUTUBE_DAYS * 86400), conn.now(),
        {index: 'date'}).orderBy({index: conn.desc('date')}).limit(100)
        .eqJoin("id", conn.table("sentiment", {readMode: "outdated"}))
        .without({right: 'sentimentlist'})
        .zip()
            .group([conn.row('date').month(), conn.row('type')])
        .ungroup().map(function (row) {
            return {
                group: row("group"),
                reduction: row("reduction").map(function (r) {
                    return r
                }).limit(1)
            }
        })

    console.log("getLatestYoutubeWithCommentGroupDay query -> ", query);

    query
        .run().then(function (results) {
        if (!results) {
            cb("Error: Could not get getLatestYoutubeWithCommentGroupDay");
        } else {
            console.log("getLatestYoutubeWithCommentGroupDay result -> ", results.length);
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getLatestYoutubeWithCommentGroupDay, ", err);
        cb(err);
    })

}

export function getLatestProductsCommentatorsGroupDay(index, value, conn, cb) {

    var query = conn.table('commentator_product', {readMode: "outdated"}).between(conn.now().sub(LATEST_PRODUCT_DAYS * 86400), conn.now(),
        {index: 'maxDate'}).orderBy({index: conn.desc('maxDate')}).limit(5000).group([conn.row('maxDate').month(), conn.row('operator')])
        .ungroup().map(function (row) {
            return {
                group: row("group"),
                reduction: row("reduction").map(function (r) {
                    return r
                }).limit(5)
            }
        });
    console.log("getLatestProductsCommentatorsGroupDay query -> ", query);


    query
        .run().then(function (results) {
        if (!results) {
            cb("Error: Could not get getLatestProductsCommentatorsGroupDay");
        } else {
            console.log("getLatestProductsCommentatorsGroupDay result -> ", results.length);
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getLatestProductsCommentatorsGroupDay, ", err);
        cb(err);
    })
}

export function getLatestProductsWithCommentGroupDay(index, value, conn, cb) {
    var query = conn.table('product', {readMode: "outdated"}).between(conn.now().sub(LATEST_PRODUCT_DAYS * 86400), conn.now(),
        {index: 'date'}).orderBy({index: conn.desc('date')}).limit(1000)
        .concatMap(function (row) {
            return conn.table("commentaries_product", {readMode: "outdated"}).getAll([row("operator"), row("titleurlize")], {index: 'operator_titleurlize'}).limit(1).map(function (comment) {
                return row.merge({comment: comment});
            })
        }).group([conn.row('date').month(), conn.row('operator')])
        .ungroup().map(function (row) {
            return {
                group: row("group"),
                reduction: row("reduction").map(function (r) {
                    return r
                }).limit(10)
            }
        })

    console.log("getLatestProductsWithCommentGroupDay query -> ", query);

    query
        .run().then(function (results) {
        if (!results) {
            cb("Error: Could not get getLatestProductsWithCommentGroupDay");
        } else {
            console.log("getLatestProductsWithCommentGroupDay result -> ", results.length)
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getLatestProductsWithCommentGroupDay, ", err);
        cb(err);
    })

}


export function getLatestCommentsGroupDay(conn, cb) {

    var query = conn.table('commentaries', {readMode: "outdated"}).between(conn.now().sub(LATEST_NEWS_DAYS_STR * 86400), conn.now(),
        {index: 'date'}).orderBy({index: conn.desc('date')}).limit(1000).group(conn.row('operator'))
        .ungroup().map(function (row) {
            return {
                group: row("group"),
                reduction: row("reduction").map(function (r) {
                    return r
                }).limit(1)
            }
        });

    console.log("getLatestCommentsGroupDay query -> ", query);

    query
        .run().then(function (results) {
        if (!results) {
            cb("Error: Could not get getLatestCommentsGroupDay");
        } else {
            console.log("getLatestCommentsGroupDay result -> ", results.length)
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getLatestCommentsGroupDay, ", err);
        cb(err);
    })
}

export function getAllPluckDistinct(conn, table, pluck, cb) {
    if (!table || !pluck) {
        logger.warn(errMsg + "table --> " + table + " pluck --> " + pluck);
        return cb(errMsg + "getAllPluckDistinct --> search query is not correct.")
    }

    var query = conn.table(table, {readMode: "outdated"})
        .distinct({index: pluck});


    // console.log("getAllPluckDistinct -> ", query)

    query
        .run().then(function (results) {
        if (!results) {
            cb("Error: Could not get getAllPluckDistinct");
        } else {
            // console.log("getAllPluckDistinct result -> ", results)
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getAllPluckDistinct, ", err);
        cb(err);
    })
}

export function getAllByIndexPluckDistinct(table, index, value, pluck, conn, cb) {
    if (!table || !index || !value || !pluck) {
        logger.error(errMsg + "table --> " + table + " index -> " + index + " value --> " + value + " pluck --> " + pluck);
        return cb(errMsg + "getAllByIndexPluckDistinct --> search query is not correct.")
    }
    logger.log('debug', "getAllByIndexPluckDistinct --> table: " + table + " index: " + index + " value: " + value + " pluck: " + pluck);
    var q  = conn.table(table, {readMode: "outdated"})
        .getAll(value, {index: index}).limit(MAX_SITEMAP_LIMIT)
        .pluck("titleurlize", "id","title", "languages", "tags", "date")
        .distinct()
    console.log("getAllByIndexPluckDistinct -> ", q)
        q.run().then(function (results) {
        if (!results) {
            cb('');
        } else {
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getAllByIndexPluckDistinct, ", err);
        cb(err);
    })
}

export function getByID(table, id, conn, cb) {
    if (!table || !id) {
        logger.warn(errMsg + "table --> " + table + " id -> " + id);
        logger.warn(errMsg + "getByID --> search query is not correct.");
        return cb();
    }
    if (!id) {
        //logger.info("getComments EOF ");
        return cb();
    }
   var q =  conn.table(table, {readMode: "outdated"}).get(id)

    console.log("getByID -> ", q);
        q.run().then(function (result) {
        if (!result) {
            logger.info('Error: getByID returns nothing :( ');
            cb('Error: getByID returns nothing :( ');
        } else {
            //logger.info(result);
            cb(null, result);
        }
    }).catch(function (err) {
        console.log("Error: getByID, ", err);
        cb(err);
    });
}

export function getCommentariesByCommentariesIds(commentsTable, commentariesIds, conn, cb) {
    if (!commentariesIds || commentariesIds.length === 0) {
        logger.info("getCommentariesByCommentariesIds EOF ");
        return cb();
    }
    var query = conn.table(commentsTable, {readMode: "outdated"})
        .getAll(conn.args(commentariesIds))

    console.log("getCommentariesByCommentariesIds, query -> ", query);

    query.run().then(function (result) {
        if (!result) {
            logger.info('Error: getCommentariesByCommentariesIds returns no results :( ');
            cb('Error: getCommentariesByCommentariesIds returns no results :( ');
        } else {
            console.log("getCommentariesByCommentariesIds, ", result);
            cb(null, result);
        }
    }).catch(function (err) {
        console.log("Error: getCommentariesByCommentariesIds, ", err);
        cb(err);
    });
}

export function getOneBySecondaryIndex(table, index, value, conn, cb) {
    if (!table || !index || !value) {
        logger.warn(errMsg + "table --> " + table + ", index -> " + index + ", value --> " + value);
        logger.warn(errMsg + "getOneBySecondaryIndex --> search query is not correct.")
        return cb()
    }
    logger.log('getOneBySecondaryIndex', "table --> " + table + ", index -> " + index + ", value --> " + value);
    conn.table(table, {readMode: "outdated"})
        .getAll(value, {index: index}).limit(1)
        .run().then(function (results) {
        if (!results) {
            logger.info('');
            cb('');
        } else {
            logger.info(results.length);
            cb(null, results[0]);
        }
    }).catch(function (err) {
        console.log("Error: getOneBySecondaryIndex, ", err);
        cb(err);
    });
}


export function getSample(table, index, value, skip, limit, sort, sample, conn, cb) {
    if (!table || !index || !value) {
        logger.warn(errMsg + "table --> " + table + " index -> " + index + " value --> " + value);
        logger.warn(errMsg + "getSample --> search query is not correct.");
        return cb()
    }
    var indexSort = "date";
    if (sort) {
        indexSort = sort;
    }
    // console.log("getSample, ", " conn.table('" + table + "').orderBy({'index': conn.desc('" + indexSort + "')}).filter({'" + index + "': '" + value + "'}).skip(" + skip + ").limit(" + limit + ")");

    var query = conn.table(table, {readMode: "outdated"})
        .orderBy({"index": conn.desc(indexSort)})
        .filter(conn.row(index).eq(value))
        .skip(skip).limit(limit).sample(sample);

    console.log("getSample -> ", query);

    query.run().then(function (results) {
        if (!results) {
            logger.info('');
            cb('');
        } else {
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getSample, ", err);
        cb(err);
    });
}

//"commentaries","nick",commentator.nick,{"operator":commentator.operator},0,50,
export function getAllByIndexOrderBySkipLimit(table, index, value, skip, limit, sort, conn, cb) {
    if (!table || !index || !value) {
        logger.warn(errMsg + "table --> " + table + " index -> " + index + " value --> " + value);
        logger.warn(errMsg + "getAllByIndexOrderBySkipLimit --> search query is not correct.");
        return cb()
    }
    var indexSort = "date";
    if (sort) {
        indexSort = sort;
    }

    var query = conn.table(table, {readMode: "outdated"})
        .orderBy({"index": conn.desc(indexSort)})
        .filter(conn.row(index).eq(value))
        .skip(skip).limit(limit)

    console.log("getAllByIndexOrderBySkipLimit, ", query);

    query.run().then(function (results) {
        if (!results) {
            logger.info('');
            cb('');
        } else {
            console.log("getAllByIndexOrderBySkipLimit", results.length);
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getAllByIndexOrderBySkipLimit, ", err);
        cb(err);
    });
}

export function getAllByMultipleIndexCount(params, conn, cb) {
    var table = params.table;
    var index = params.index;
    var value = params.value;
    var operator = params.operator;

    if (!table || !index || !value || !operator) {
        logger.warn(errMsg + "Invalid INPUT --> ", JSON.stringify(params));
        logger.warn(errMsg + "getAllByMultipleIndexCount --> search query is not correct.");
        return cb()
    }

    var query = conn.table(table, {readMode: "outdated"})
        .getAll([operator, value], {index: index}).count();
    console.log("getAllByMultipleIndexCount -> ", query);

    query.run().then(function (results) {
        // console.log("getAllByMultipleIndexCount, results", results);
        cb(null, results);
    }).catch(function (err) {
        console.log("Error: getAllByMultipleIndexCount, ", err);
        cb(err);
    });
}

export function getAllByMultipleIndexOrderBySkipLimit(params, conn, cb) {
    var table = params.table;
    var index = params.index;
    var value = params.value;
    var operator = params.operator;
    var skip = params.skip;
    var limit = params.limit;
    var sort = params.sort;
    var order = params.order || "desc";

    if (!table || !index || !value || !operator || (!skip && skip !== 0) || !limit || !sort) {
        logger.warn(errMsg + "Invalid INPUT --> ", JSON.stringify(params));
        logger.warn(errMsg + "getAllByMultipleIndexOrderBySkipLimit --> search query is not correct.");
        return cb()
    }

    var query = conn.table(table, {readMode: "outdated"})
        .getAll([operator, value], {index: index});
    if (order == "desc") {
        query = query.orderBy(conn.desc(sort));
    } else {
        query = query.orderBy(conn.asc(sort));
    }
    query = query.skip(skip).limit(limit);

    console.log("getAllByMultipleIndexOrderBySkipLimit -> ", query);

    query.run().then(function (results) {
        cb(null, results);
    }).catch(function (err) {
        console.log("Error: getAllByMultipleIndexOrderBySkipLimit, ", err);
        cb(err);
    });
}


export function getAllByDateRangeIndexOrderByFilterSkipLimit(table, index, value, skip, limit, sort, order, range, conn, cb) {
    if (!table || !index || !value) {
        logger.warn(errMsg + "table --> " + table + " index -> " + index + " value --> " + value);
        logger.warn(errMsg + "getAllByDateRangeIndexOrderByFilterSkipLimit --> search query is not correct.");
        return cb()
    }

    if (!range) {
        range = 10
    }

    var date = new Date();
    var dateObj = new Date(
        date.getFullYear(),
        date.getMonth() - range,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    );

    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    var query = conn.table(table, {readMode: "outdated"})
        .between(conn.time(year, month, day, '+00:00'), date, {index: 'date'})
        .orderBy({index: conn.desc('date')})
        .filter(conn.row(index).eq(value))
        .skip(skip).limit(limit);


    console.log("getAllByDateRangeIndexOrderByFilterSkipLimit, ",query);

    query.run().then(function (results) {
        if (!results) {
            logger.info('Error: getAllByDateRangeIndexOrderByFilterSkipLimit could not find anyting  -> ', query);
            cb('');
        } else {
            console.log("getAllByDateRangeIndexOrderByFilterSkipLimit", results.length);
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getAllByDateRangeIndexOrderByFilterSkipLimit, ", err);
        cb(err);
    });
}

export function getAllByIndexOrderByFilterSkipLimit(table, index, value, skip, limit, sort, order, conn, cb) {
    if (!table || !index || !value) {
        logger.warn(errMsg + "table --> " + table + " index -> " + index + " value --> " + value);
        logger.warn(errMsg + "getAllByIndexOrderByFilterSkipLimit --> search query is not correct.");
        return cb()
    }
    var indexSort = "date";
    if (sort) {
        indexSort = sort;
    }
    if (order == "asc") {
        order = conn.asc(indexSort)
        console.log("getAllByIndexOrderByFilterSkipLimit, ", " conn.table('" + table + "').orderBy({'index': conn.asc('" + indexSort + "')}).filter({'" + index + "': '" + value + "'}).skip(" + skip + ").limit(" + limit + ")");
    } else {
        order = conn.desc(indexSort)
        console.log("getAllByIndexOrderByFilterSkipLimit, ", " conn.table('" + table + "').orderBy({'index': conn.desc('" + indexSort + "')}).filter({'" + index + "': '" + value + "'}).skip(" + skip + ").limit(" + limit + ")");
    }

    var query = conn.table(table, {readMode: "outdated"})
        .orderBy({"index": order})
        .filter(conn.row(index).eq(value))
        .skip(skip).limit(limit);

    console.log("getAllByIndexOrderByFilterSkipLimit", query);

    query.run().then(function (results) {
        if (!results) {
            logger.info('');
            cb('');
        } else {
            console.log("getAllByIndexOrderByFilterSkipLimit", results.length);
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getAllByIndexOrderByFilterSkipLimit, ", err);
        cb(err);
    });
}


export function getAllByIndexSkipLimit(table, index, value, skip, limit, conn, cb) {
    if (!table || !index || !value) {
        logger.warn(errMsg + "table --> " + table + " index -> " + index + " value --> " + value);
        logger.warn(errMsg + "getAllByIndexSkipLimit --> search query is not correct.");
        return cb()
    }
    console.log("getAllByIndexSkipLimit, ", " conn.table('" + table + "').getAll('" + value + "', {index: '" + index + "'}).skip(" + skip + ").limit(" + limit + ")");

    conn.table(table, {readMode: "outdated"})
        .getAll(value, {index: index})
        .skip(skip).limit(limit)
        .run().then(function (results) {
        if (!results) {
            //logger.info(err);
            cb('');
        } else {
            //logger.info(results.length);
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getAllByIndexSkipLimit, ", err);
        cb(err);
    });
}

function question(id) {
    let sampleContent = '--the question content--'
    return {
        id,
        content: `sample-${id}: ${sampleContent}`,
        user_id: id
    }
}

export function getCommentator(id, conn, cb) {
    if (!id) {
        logger.warn(errMsg + "table --> commentator " + " id --> " + id);
        return cb(errMsg + "getCommentator --> search query is not correct.")
    }
    //get commentator by id
    getByID("commentator", id, conn, function (err, commentator) {
        //if (err || !commentator) {
        logger.warn(err);
        console.log(`getByID commentator ${id} not found`);
        //} else {
        //get all comments by index nick
        //table, index, value, skip, limit, sort, conn, cb
        //
        var nick = commentator ? commentator.nick : id;

        getAllByIndexSkipLimit("commentaries", "nick", nick, 0, 50, conn, function (err, comments) {
            if (err || !commentator) {
                if (err) {
                    logger.warn(err);
                }

                //TODO: create commentator if comments are returned from elk

                var commentator = {
                    "categories": comments[0].categories,
                    "countries": comments[0].countries,
                    "genre": comments[0].genre,
                    "id": comments[0].id,
                    "languages": comments[0].languages,
                    "nick": comments[0].nick,
                    "operator": comments[0].operator,
                    "slug": comments[0].nick,
                    "totalComments": comments.length
                };

                cb(null, commentator);
                //cb(`getAllByIndexOrderBySkipLimit commentator nick ${commentator.nick} not found`);
            } else {
                commentator.comments = comments;
                //logger.info(commentator);
                cb(null);
            }
        });
        //}
    });
}

export function getCommentatorByNick(id, conn, cb) {
    if (!id) {
        logger.warn(errMsg + "table --> commentator " + " id --> " + id);
        return cb(errMsg + "getCommentator --> search query is not correct.")
    }
    //get commentator by id
    getOneBySecondaryIndex("commentator", "nick", id, conn, function (err, commentator) {
        var nick = commentator ? commentator.nick : id;
        var index = commentator ? commentator.operator : "_all";
        if (err || !commentator) {
            logger.warn("Could not find Commentator on Rethinkdb :| We will retry using the query id on elk search o/ ", nick, err);
        }
        //get all comments by index nick

        elk_api.getElkByQuery(index, 'commentaries', {
            "query": {
                "bool": {
                    "should": [
                        {
                            "simple_query_string": {
                                "query": nick,
                                "fields": [
                                    "nick"]
                            }
                        }]
                }
            },
            "size": 100
        }, function (err, resp) {
            if (err) {
                logger.info(err);
                cb(err);
            } else if (!resp || resp.length === 0) {
                if (!commentator) {
                    commentator = {
                        "categories": "",
                        "countries": "",
                        "genre": "",
                        "id": "",
                        "languages": "",
                        "nick": id,
                        "operator": "",
                        "slug": "",
                        "totalComments": 0
                    };
                }
                commentator.comments = [];

                console.log("Got no comments :(");
                cb(null, commentator);
            } else {

                if (!commentator) {
                    commentator = {
                        "categories": resp[0].categories,
                        "countries": resp[0].countries,
                        "genre": resp[0].genre,
                        "id": resp[0].id,
                        "languages": resp[0].languages,
                        "nick": resp[0].nick,
                        "operator": resp[0].operator,
                        "slug": resp[0].nick,
                        "totalComments": resp.length
                    };
                }

                commentator.comments = resp;
                console.log("Got comments :D ", resp.length);
                cb(null, commentator);
            }
        });

        //getAllByIndexSkipLimit("commentaries", "nick", commentator.nick,
        //    0, 50, conn, function (err, comments) {
        //        if (err || !commentator) {
        //            logger.info(err);
        //            cb(err);
        //        } else {
        //            commentator.comments = comments;
        //            logger.info(commentator.comments.length);
        //            cb(null, commentator);
        //        }
        //    });
    });
}


export function allcommentators(conn, cb) {
    var operators = [
        //"bbcuk",
        //"telegraph", "theguardian", "washingtonpost",
        //"cnn",
        //"nytimes",
        //"rt", "independentuk",
        //"lemonde", "lefigaro",
        //"elpais",
        //"marca",
        //"cartacapital", "folhapolitica", "g1",
        "uol"
        //, "ultimosegundo",
        //"repubblica",
        //"indexhr",
        //"novayagazeta_ru", "chinanews"
    ];

    iterate(0, operators, conn, "commentator", [], function (commentatorList) {
        logger.info("iterate commentator finished");

        _.uniq(commentatorList, 'nick');

        return cb(commentatorList);
    });

    function iterate(count, operators, conn, table, commentatorList, cb) {
        var operator = operators[count];
        if (!operator) {
            logger.info("finish processing all operators");
            return cb(commentatorList);
        }
        count = count + 1;

        logger.info("going to get more comments for operator " + operator);
        conn.table(table, {readMode: "outdated"})
            .getAll(operator, {index: 'operator'})
            .run()
            .then(function (cursor) {
                var hasNextRow = function (cb, prevRow) {
                    cursor.next(function (err, row) {
                        if (err) cb(false, prevRow);
                        if (row) cb(true, prevRow, row);
                    })
                };
                var consoleRow = function (row) {
                    hasNextRow(function (hasNextRow, prevRow, row) {
                        if (row) {
                            geCommentator(0, [row], operator, function (commentator) {
                                if (commentator) {
                                    commentatorList.push(commentator);
                                }

                                if (hasNextRow) {
                                    consoleRow(row);
                                } else {
                                    logger.info('hasNextRow :(');
                                    return iterate(count, operators, conn, table, commentatorList, cb);
                                }

                            })


                        } else {
                            if (hasNextRow) {
                                consoleRow(row);
                            } else {
                                logger.info('hasNextRow returned no rows and hasNextRow was false :(');
                                return iterate(count, operators, conn, table, commentatorList, cb);
                            }
                        }
                    }, row);
                };
                consoleRow();
            });
    }

    function geCommentator(count, result, operator, cb) {
        var n = result[count];
        if (!n) {
            logger.info("ERROR: fixNick EOF");
            return cb();
        }
        //logger.info(e);
        var nick = n;
        if (!nick) {
            logger.info("ERROR: fixNick EOF");
            return cb();
        } else {
            return cb(nick);
        }
    }


}

//eg table=news, index=operator_genre, value=bbcuk
export function getAllDistinctByIndex(conn, table, index, value) {
    var query = conn.table(table, {readMode: "outdated"}).between([value, conn.minval], [value, conn.maxval], {index: index}).distinct({index: index})
    return query.run()
}

export function getUser(id) {
    return {
        id,
        name: `user name - ${id}`
    }
}
export function getQuestion(id) {
    return question(id)
}
