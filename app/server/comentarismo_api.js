let _ = require('lodash')

import r from 'rethinkdb';

//get all nicks for a operator
//get all nicks for a language
//get all nicks for a genre
//get all comments for a nick
//get commentator profile by nickurlize

/** LOGGER **/
var log = require("./logger");
var logger = log.getLogger();
/** LOGGER **/

var errMsg = "Error: ";
export function getAllPluckDistinct(conn, table, pluck, cb) {
    if (!table || !pluck) {
        logger.warn(errMsg + "table --> " + table + " pluck --> " + pluck);
        return cb(errMsg + "getAllPluckDistinct --> search query is not correct.")
    }

    r.table(table)
        .pluck(pluck)
        .distinct()
        .run(conn, function (err, cursor) {
            if (err || !cursor) {
                logger.error(err);
                cb(err);
            } else {
                cursor.toArray(function (err, results) {
                    if (err) return cb(err);
                    cb(null, results);
                });
            }
        });
}

export function getAllByIndexPluckDistinct(table, index, value, pluck, conn, cb) {
    if (!table || !index || !value || !pluck) {
        logger.error(errMsg + "table --> " + table + " index -> " + index + " value --> " + value + " pluck --> " + pluck);
        return cb(errMsg + "getAllByIndexPluckDistinct --> search query is not correct.")
    }
    logger.log('debug', "getAllByIndexPluckDistinct --> table: " + table + " index: " + index + " value: " + value + " pluck: " + pluck);
    r.table(table)
        .getAll(value, {index: index}).limit(50000)
        .pluck(pluck)
        .distinct()
        .run(conn, function (err, cursor) {
            if (err || !cursor) {
                logger.error(err);
                cb(err);
            } else {
                cursor.toArray(function (err, results) {
                    if (err) return cb(err);
                    cb(null, results);
                });
            }
        });
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
    r.table(table)
        .get(id)
        .run(conn, function (err, result) {
            if (err || !result) {
                logger.info(err);
                cb(err);
            } else {
                //logger.info(result);
                cb(null, result);
            }
        });
}

export function getOneBySecondaryIndex(table, index, value, conn, cb) {
    if (!table || !index || !value) {
        logger.warn(errMsg + "table --> " + table + ", index -> " + index + ", value --> " + value);
        logger.warn(errMsg + "getOneBySecondaryIndex --> search query is not correct.")
        return cb()
    }
    logger.log('debug', "table --> " + table + ", index -> " + index + ", value --> " + value);
    r.table(table)
        .getAll(value, {index: index}).limit(1)
        .run(conn, function (err, cursor) {
            if (err || !cursor) {
                logger.info(err);
                cb(err);
            } else {
                cursor.toArray(function (err, results) {
                    if (err) return cb(err);
                    logger.info(results.length);
                    cb(null, results[0]);
                });
            }
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
    r.table(table)
        .getAll(value, {index: index})
        .limit(50000)
        .orderBy(r.desc(indexSort))
        .skip(skip).limit(limit)
        .run(conn, function (err, cursor) {
            if (err || !cursor) {
                //logger.info(err);
                cb(err);
            } else {
                cursor.toArray(function (err, results) {
                    if (err) return cb(err);
                    //logger.info(results.length);
                    cb(null, results);
                });
            }
        });
}

export function getAllByIndexSkipLimit(table, index, value, skip, limit, conn, cb) {
    if (!table || !index || !value) {
        logger.warn(errMsg + "table --> " + table + " index -> " + index + " value --> " + value);
        logger.warn(errMsg + "getAllByIndexSkipLimit --> search query is not correct.");
        return cb()
    }

    r.table(table)
        .getAll(value, {index: index})
        .skip(skip).limit(limit)
        .run(conn, function (err, cursor) {
            if (err || !cursor) {
                //logger.info(err);
                cb(err);
            } else {
                cursor.toArray(function (err, results) {
                    if (err) return cb(err);
                    //logger.info(results.length);
                    cb(null, results);
                });
            }
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
        if (err || !commentator) {
            logger.warn(err);
            cb(`getByID commentator ${id} not found`);
        } else {
            //get all comments by index nick
            //table, index, value, skip, limit, sort, conn, cb
            getAllByIndexOrderBySkipLimit("commentaries", "nick", commentator.nick, 0, 50, "date", conn, function (err, comments) {
                if (err || !commentator) {
                    if (err) {
                        logger.warn(err);
                    }
                    cb(`getAllByIndexOrderBySkipLimit commentator nick ${commentator.nick} not found`);
                } else {
                    commentator.comments = comments;
                    //logger.info(commentator);
                    cb(null, commentator);
                }
            });
        }
    });
}

export function getCommentatorByNick(id, conn, cb) {
    if (!id) {
        logger.warn(errMsg + "table --> commentator " + " id --> " + id);
        return cb(errMsg + "getCommentator --> search query is not correct.")
    }
    //get commentator by id
    getOneBySecondaryIndex("commentator", "nick", id, conn, function (err, commentator) {
        if (err || !commentator) {
            logger.warn(err);
            cb(err);
        } else {
            logger.warn(commentator)
            //get all comments by index nick
            getAllByIndexOrderBySkipLimit("commentaries", "nick", commentator.nick,
                0, 50, "date", conn, function (err, comments) {
                    if (err || !commentator) {
                        logger.info(err);
                        cb(err);
                    } else {
                        commentator.comments = comments;
                        logger.info(commentator.comments.length);
                        cb(null, commentator);
                    }
                });
        }
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
        r.table(table)
            .getAll(operator, {index: 'operator'})
            .run(conn)
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
