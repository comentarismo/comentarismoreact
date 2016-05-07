let _ = require('lodash')

import r from 'rethinkdb';

//get all nicks for a operator
//get all nicks for a language
//get all nicks for a genre
//get all comments for a nick
//get commentator profile by nickurlize

var errMsg = "Error: ";
export function getAllPluckDistinct(conn, table, pluck, cb){
    if(!table || !pluck){
        console.log(errMsg+"table --> "+table+" pluck --> "+pluck);
        return cb(errMsg+"getAllPluckDistinct --> search query is not correct.")
    }

    r.table(table)
        .pluck(pluck)
        .distinct()
        .run(conn, function (err, cursor) {
            if (err || !cursor) {
                console.log(err);
                cb(err);
            } else {
                cursor.toArray(function (err, results) {
                    if (err) return cb(err);
                    cb(null, results);
                });
            }
        });
}

export function getAllByIndexPluckDistinct(table, index, value, pluck, conn, cb){
    if(!table || !index || !value || !pluck){
        console.log(errMsg+"table --> "+table+" index -> "+index+" value --> "+value+" pluck --> "+pluck);
        return cb(errMsg+"getAllByIndexPluckDistinct --> search query is not correct.")
    }
    console.log("getAllByIndexPluckDistinct --> table: "+table+" index: "+index+" value: "+value+" pluck: "+pluck);
    r.table(table)
        .getAll(value, {index: index}).limit(50000)
        .pluck(pluck)
        .distinct()
        .run(conn, function (err, cursor) {
            if (err || !cursor) {
                console.log(err);
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
    if(!table || !id){
        console.log(errMsg+"table --> "+table+" id -> "+id);
        console.log(errMsg+"getByID --> search query is not correct.");
        return cb();
    }
    if (!id) {
        //console.log("getComments EOF ");
        return cb();
    }
    r.table(table)
        .get(id)
        .run(conn, function (err, result) {
            if (err || !result) {
                console.log(err);
                cb(err);
            } else {
                //console.log(result);
                cb(null, result);
            }
        });
}

export function getOneBySecondaryIndex(table, index, value, conn, cb) {
    if(!table || !index || !value){
        console.log(errMsg+"table --> "+table+" index -> "+index+" value --> "+value);
        console.log(errMsg+"getOneBySecondaryIndex --> search query is not correct.")
        return cb()
    }
    r.table(table)
        .getAll(value, {index: index}).limit(1)
        .run(conn, function (err, cursor) {
            if (err || !cursor) {
                console.log(err);
                cb(err);
            } else {
                cursor.toArray(function (err, results) {
                    if (err) return cb(err);
                    //console.log(results.length);
                    cb(null, results[0]);
                });
            }
        });
}


//"commentaries","nick",commentator.nick,{"operator":commentator.operator},0,50,
export function getAllByIndexFilterSkipLimit(table, index, value, filter, skip,limit, sort, conn, cb) {
    if(!table || !index || !value){
        console.log(errMsg+"table --> "+table+" index -> "+index+" value --> "+value);
        console.log(errMsg+"getAllByIndexFilterSkipLimit --> search query is not correct.");
        return cb()
    }
    var indexSort = "date";
    if(sort){
        indexSort = sort;
    }

    r.table(table)
        .getAll(value, {index: index}).limit(50000)
        .orderBy(r.desc(indexSort))
        .skip(skip).limit(limit)
        .run(conn, function (err, cursor) {
            if (err || !cursor) {
                //console.log(err);
                cb(err);
            } else {
                cursor.toArray(function (err, results) {
                    if (err) return cb(err);
                    //console.log(results.length);
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

export function getCommentator(id,conn,cb) {
    if(!id){
        console.log(errMsg+"table --> commentator " + " id --> "+id);
        return cb(errMsg+"getCommentator --> search query is not correct.")
    }
    //get commentator by id
    getByID("commentator", id, conn, function(err,commentator){
        if (err || !commentator) {
            console.log(err);
            cb(err);
        } else {
            //get all comments by index nick
            getAllByIndexFilterSkipLimit("commentaries","nick",commentator.nick,{"operator":commentator.operator},0,50, "date", conn, function(err,comments){
                if (err || !commentator) {
                    console.log(err);
                    cb(err);
                } else {
                    commentator.comments = comments;
                    //console.log(commentator);
                    cb(null,commentator);
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
        console.log("iterate commentator finished");

        _.uniq(commentatorList, 'nick');

        return cb(commentatorList);
    });

    function iterate(count, operators, conn, table, commentatorList, cb) {
        var operator = operators[count];
        if (!operator) {
            console.log("finish processing all operators");
            return cb(commentatorList);
        }
        count = count + 1;

        console.log("going to get more comments for operator " + operator);
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
                                    console.log('hasNextRow :(');
                                    return iterate(count, operators, conn, table, commentatorList, cb);
                                }

                            })


                        } else {
                            if (hasNextRow) {
                                consoleRow(row);
                            } else {
                                console.log('hasNextRow returned no rows and hasNextRow was false :(');
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
            console.log("ERROR: fixNick EOF");
            return cb();
        }
        //console.log(e);
        var nick = n;
        if (!nick) {
            console.log("ERROR: fixNick EOF");
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
