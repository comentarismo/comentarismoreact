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


export function getLatestNewsGroupDay(conn, cb) {

    var query = conn.table('news').between(conn.now().sub(2 * 86400), conn.now(),
        {index: 'date'}).orderBy({index: conn.desc('date')}).group([conn.row('date').day(), conn.row('operator')]);

    console.log("getLatestNewsGroupDay, query, ", query);

    query
        .run().then(function (results) {
        if (!results) {
            cb("Could not get getLatestNewsGroupDay");
        } else {
            console.log("getLatestNewsGroupDay result -> ", results.length)
            cb(null, results);
        }
    }).catch(function (err) {
        console.log("Error: getLatestNewsGroupDay, ", err);
        cb(err);
    })

}


export function getAllPluckDistinct(conn, table, pluck, cb) {
    if (!table || !pluck) {
        logger.warn(errMsg + "table --> " + table + " pluck --> " + pluck);
        return cb(errMsg + "getAllPluckDistinct --> search query is not correct.")
    }

    var query = conn.table(table)
        .distinct({index: pluck});


    console.log("getAllPluckDistinct -> ", query)

    query
        .run().then(function (results) {
        if (!results) {
            cb("Could not get getAllPluckDistinct");
        } else {
            console.log("getAllPluckDistinct result -> ", results)
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
    conn.table(table)
        .getAll(value, {index: index}).limit(100)
        .pluck("titleurlize", "title", "languages", "tags", "date")
        .distinct()
        .run().then(function (results) {
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
    conn.table(table)
        .get(id)
        .run().then(function (result) {
        if (!result) {
            logger.info('');
            cb('');
        } else {
            //logger.info(result);
            cb(null, result);
        }
    }).catch(function (err) {
        console.log("Error: getByID, ", err);
        cb(err);
    });
}

export function getOneBySecondaryIndex(table, index, value, conn, cb) {
    if (!table || !index || !value) {
        logger.warn(errMsg + "table --> " + table + ", index -> " + index + ", value --> " + value);
        logger.warn(errMsg + "getOneBySecondaryIndex --> search query is not correct.")
        return cb()
    }
    logger.log('debug', "table --> " + table + ", index -> " + index + ", value --> " + value);
    conn.table(table)
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
        logger.warn(errMsg + "getAllByIndexOrderBySkipLimit --> search query is not correct.");
        return cb()
    }
    var indexSort = "date";
    if (sort) {
        indexSort = sort;
    }
    // console.log("getSample, ", " conn.table('" + table + "').orderBy({'index': conn.desc('" + indexSort + "')}).filter({'" + index + "': '" + value + "'}).skip(" + skip + ").limit(" + limit + ")");

    var query = conn.table(table)
        .orderBy({"index": conn.desc(indexSort)})
        .filter(conn.row(index).eq(value))
        .skip(skip).limit(limit).sample(sample);

    console.log("getSample", query);

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
    console.log("getAllByIndexOrderBySkipLimit, ", " conn.table('" + table + "').orderBy({'index': conn.desc('" + indexSort + "')}).filter({'" + index + "': '" + value + "'}).skip(" + skip + ").limit(" + limit + ")");

    conn.table(table)
        .orderBy({"index": conn.desc(indexSort)})
        .filter(conn.row(index).eq(value))
        .skip(skip).limit(limit)
        .run().then(function (results) {
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

    var query = conn.table(table)
        .getAll([operator, value], {index: index}).count();
    console.log("getAllByMultipleIndexCount -> ", query);

    query.run().then(function (results) {
        console.log("getAllByMultipleIndexCount, results", results);
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

    var query = conn.table(table)
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

    var query = conn.table(table)
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

    conn.table(table)
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
        conn.table(table)
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

export function getUser(id) {
    return {
        id,
        name: `user name - ${id}`
    }
}
export function getQuestion(id) {
    return question(id)
}
