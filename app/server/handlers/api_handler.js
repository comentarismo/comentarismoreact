const Wreck = require('wreck')

var COMENTARISMO_API = process.env.COMENTARISMO_API ||
    'http://api.comentarismo.com'
var DISABLE_CACHE = /true/.test(process.env.DISABLE_CACHE)

var EXPIRE_REDIS = process.env.EXPIRE_REDIS || '3600'
var GIT_HASH = require('server/version.js').GIT_HASH

var VERSION = require('server/version.js').VERSION

let {
    getAllByMultipleIndexOrderBySkipLimit,
    getAllByMultipleIndexCount,
    getAllByIndexOrderBySkipLimit,
    getAllByIndexOrderByFilterSkipLimit,
    getAllByDateRangeIndexOrderByFilterSkipLimit,
    getOneBySecondaryIndex,
    getCommentator,
    getCommentatorByNick,
    getByID,
    getByUID,
    getCommentariesByCommentariesIds,
    getAllByIndexSkipLimit,
    getAllDistinctByIndex,
    
    getLatestNewsGroupDay,
    getLatestNewsCommentatorsGroupDay,
    getLatestNewsWithCommentGroupDay,
    getLatestProductsWithCommentGroupDay,
    getLatestProductsCommentatorsGroupDay,
    getLatestYoutubeWithCommentGroupDay,
    getLatestYoutubeCommentatorsGroupDay,
} = require('server/api/comentarismo_api')

var comentarismosite = 'http://www.comentarismo.com'

/** LOGGER **/
import logger from 'server/logger_middleware'
/** LOGGER **/

module.exports = function (
    app, REDIS_CONNECTION, RETHINKDB_CONNECTION, limiter) {
    
    app.get('/versions.json', limiter, (req, res) => {
        var versions = {
            version: VERSION,
            GIT_HASH: GIT_HASH,
        }
        res.send(versions)
    })
    
    app.get('/html/:page', limiter, (req, res, next) => {
        
        var page = req.params.page
        
        //?db=test&table=commentaries&skip=100&limit=50&operator=uol&key=operator_uuid&value=uoljohan-cruyff-morre-aos-68-anos-apos-luta-contra-cancer#overview-section
        var target = `${COMENTARISMO_API}/html/${page}?db=test&table=${req.query.table}&skip=${req.query.skip}&limit=${req.query.limit}&operator=${req.query.operator}&key=${req.query.key}&value=${req.query.value}`
        
        logger.debug(target)
        Wreck.request('GET', target, {}, (err, response) => {
            
            if (err) {
                return res.status(500).send('Something broke!')
            }
            
            Wreck.read(response, null, (err, body) => {
                
                if (err) {
                    return res.status(500).send('Something broke!')
                }
                
                res.write(body, 'binary')
                return res.end(undefined, 'binary')
            })
        })
        
    })
    
    app.get('/api/comment/:id', limiter, (req, res) => {
        var id = req.params.id
        logger.info(`/comment/${id}`)
        getByID('commentaries', id, RETHINKDB_CONNECTION, function (err, data) {
            if (err || !data) {
                console.error('Error: ', `/comment/${id}`, err)
                return res.status(500).send('Something broke!')
            } else {
                res.send(data)
            }
        })
    })
    
    ///v1/listbykeyskiplimit?key=operator_titleurlize&sort=date&skip=0&limit=50&table=commentaries&operator=g1&value=g1texas-comeca-2016-com-lei-que-permite-porte-aberto-de-armas
    app.get('/v1/listbykeyskiplimit', limiter, (req, res) => {
        var params = getParams(req)
        var urlTag = `/v1/listbykeyskiplimit?table=${params.table}&index=${params.index}&value=${params.value}&operator=${params.operator}&skip=${params.skip}&limit=${params.limit}&sort=${params.sort}&order=${params.order}`
        if (!req.query.skip || !req.query.limit || !params.sort) {
            logger.debug('Error: Invalid inputs --> ', urlTag)
            return res.sendStatus(500)
        }
        if (params.error) {
            logger.debug('Error: ', urlTag, params.error)
            return res.sendStatus(500)
        }
        
        //-------REDIS CACHE START ------//
        REDIS_CONNECTION.get(urlTag, function (err, js) {
            if (!DISABLE_CACHE) {
                if (err || !js) {
                    if (err) {
                        console.error('Error: ', urlTag, err.stack)
                        return res.sendStatus(500)
                    }
                } else {
                    logger.info(urlTag + ' will return cached result ')
                    res.type('application/json')
                    return res.send(js)
                }
            }
            //-------REDIS CACHE END ------//
            getAllByMultipleIndexOrderBySkipLimit(params, RETHINKDB_CONNECTION,
                function (err, data) {
                    if (err) {
                        logger.debug(
                            'Error: getAllByMultipleIndexOrderBySkipLimit, ',
                            err.stack)
                        return res.sendStatus(500)
                    } else {
                        //-------REDIS CACHE SAVE START ------//
                        if (!DISABLE_CACHE) {
                            logger.info(urlTag + ' will save cached')
                            REDIS_CONNECTION.set(urlTag, JSON.stringify(data),
                                'EX',
                                EXPIRE_REDIS)
                        }
                        //-------REDIS CACHE SAVE END ------//
                        res.send(data)
                    }
                })
            
        })
    })
    
    ///v1/listbykeycount?key=operator_titleurlize&table=commentaries&operator=g1&value=g1texas-comeca-2016-com-lei-que-permite-porte-aberto-de-armas
    app.get('/v1/listbykeycount', limiter, (req, res) => {
        var params = getParams(req)
        var urlTag = `/v1/listbykeycount?table=${params.table}&index=${params.index}&value=${params.value}&operator=${params.operator}`
        
        if (params.error) {
            console.error('Error: ', urlTag, params.error)
            return res.send('Something broke!')
        }
        
        //-------REDIS CACHE START ------//
        REDIS_CONNECTION.get(urlTag, function (err, js) {
            if (!DISABLE_CACHE) {
                if (err || !js) {
                    if (err) {
                        console.error('Error: ', urlTag, err.stack)
                        return res.sendStatus(500)
                    }
                } else {
                    logger.info(urlTag + ' will return cached result ')
                    res.type('application/json')
                    return res.send(js)
                }
            }
            //-------REDIS CACHE END ------//
            
            getAllByMultipleIndexCount(params, RETHINKDB_CONNECTION,
                function (err, data) {
                    if (err) {
                        console.error('Error: ', urlTag, err.stack)
                        return res.sendStatus(500)
                    } else {
                        //-------REDIS CACHE SAVE START ------//
                        logger.info(urlTag + ' will save cached')
                        if (!DISABLE_CACHE) {
                            REDIS_CONNECTION.set(urlTag,
                                JSON.stringify({count: data}), 'EX',
                                EXPIRE_REDIS)
                        }
                        //-------REDIS CACHE SAVE END ------//
                        res.json({count: data})
                    }
                })
            
        })
        
    })
    
    //bind to action/commentators.js -> loadCommentatorDetail
    app.get('/api_v2/:table/:id', limiter, (req, res) => {
        var id = req.params.id
        var table = req.params.table || 'commentator'
        
        var commentsTable = ''
        if (table === 'commentator_product') {
            commentsTable = 'commentaries_product'
        } else if (table === 'commentator_sentiment_report') {
            commentsTable = 'commentaries_sentiment_report'
        } else {
            commentsTable = 'commentaries'
        }
        
        if (!id) {
            return res.status(404).send('Not found')
        }
        
        var urlTag = `/api/${table}/${id}`
        logger.info(urlTag)
        
        //-------REDIS CACHE START ------//
        REDIS_CONNECTION.get(urlTag, function (err, js) {
            if (!DISABLE_CACHE) {
                if (err || !js) {
                    if (err) {
                        console.error('Error: ', urlTag, err)
                    }
                    //return res.status(500).send('Cache is broken!');
                } else {
                    logger.info(urlTag + ' will return cached result ')
                    res.type('application/json')
                    return res.send(js)
                }
            }
            //-------REDIS CACHE END ------//
            
            getByID(table, req.params.id, RETHINKDB_CONNECTION,
                function (err, data) {
                    if (err) {
                        logger.info('Error: ' + err)
                        //console.error(err.stack);
                        //return res.status(500).send('Something broke!');
                    }
                    
                    if (data) {
                        
                        getCommentariesByCommentariesIds(commentsTable,
                            data.commentariesIds, RETHINKDB_CONNECTION,
                            function (err, commentaries) {
                                if (err) {
                                    logger.info('Error: after getCommentariesByCommentariesIds ->  ' +
                                        err)
                                    //console.error(err.stack);
                                    return res.status(404).send()
                                }
                                data.comments = commentaries
                                
                                //-------REDIS CACHE SAVE START ------//
                                logger.info(urlTag + ' will save cached')
                                var js = JSON.stringify(data)
                                //logger.info(js);
                                if (!DISABLE_CACHE) {
                                    REDIS_CONNECTION.set(urlTag, js, 'EX',
                                        EXPIRE_REDIS)
                                }
                                //-------REDIS CACHE SAVE END ------//
                                res.send(data)
                                
                            })
                    } else {
                        
                        
                        //retry
                        var idAux = ''
                        if (req.params.id.indexOf('-') !== -1) {
                            idAux = req.params.id.split('-')[1]
                        }
                        logger.info(
                            'commentator not found, will retry with nick, ',
                            idAux, 'original: ', req.params.id)
                        
                        if (!idAux) {
                            logger.info('Error: ' + err)
                            console.error('Error: ', urlTag, err.stack)
                            return res.status(404).send()
                        }
                        
                        getCommentatorByNick((idAux ? idAux : req.params.id),
                            RETHINKDB_CONNECTION,
                            function (err, data) {
                                if (err) {
                                    logger.info('Error: after getCommentariesByCommentariesIds ->  ' +
                                        err)
                                    //console.error(err.stack);
                                    return res.status(404).send()
                                }
                                
                                if (data) {
                                    
                                    getCommentariesByCommentariesIds(
                                        commentsTable,
                                        data.commentariesIds,
                                        RETHINKDB_CONNECTION,
                                        function (err, commentaries) {
                                            if (err) {
                                                logger.info('Error: after getCommentariesByCommentariesIds ->  ' +
                                                    err)
                                                //console.error(err.stack);
                                                return res.status(404).send()
                                            }
                                            
                                            data.comments = commentaries
                                            
                                            //-------REDIS CACHE SAVE START ------//
                                            logger.info(urlTag +
                                                ' will save cached')
                                            if (!DISABLE_CACHE) {
                                                REDIS_CONNECTION.set(urlTag,
                                                    JSON.stringify(data), 'EX',
                                                    EXPIRE_REDIS)
                                            }
                                            //-------REDIS CACHE SAVE END ------//
                                            
                                        })
                                    
                                } else {
                                    
                                    logger.info('nothing found ? how did we got here ?  getCommentatorByNick --> ' +
                                        urlTag)
                                }
                                
                                res.send(data)
                            })
                    }
                    
                })
            
        })
    })
    
    /**
     * Get all from a table with a index and its value and optional pos filtering like /genre/politics with skip and limit
     */
    app.get('/fapi/:table/:index/:value/:filter/:filtervalue/:skip/:limit',
        limiter, (req, res) => {
            var table = req.params.table
            var index = req.params.index
            var value = req.params.value
            var filter = req.params.filter
            var filtervalue = req.params.filtervalue
            var skip = parseInt(req.params.skip)
            var limit = parseInt(req.params.limit)
            
            var filt = {}
            if (filter && filtervalue) {
                filt = {filter: filtervalue}
            }
            var sort = req.query.sort
            
            var urlTag = `/fapi/${table}/${index}/${value}/${filter}/${filtervalue}/${skip}/${limit}?sort=${sort}`
            logger.info(urlTag)
            
            //-------REDIS CACHE START ------//
            REDIS_CONNECTION.get(urlTag, function (err, js) {
                if (!DISABLE_CACHE) {
                    if (err || !js) {
                        if (err) {
                            console.error('Error: ', urlTag, err.stack)
                        }
                        //return res.status(500).send('Cache is broken!');
                    } else {
                        logger.info(urlTag + ' will return cached result ')
                        res.type('application/json')
                        return res.send(js)
                    }
                }
                //-------REDIS CACHE END ------//
                
                getAllByIndexOrderBySkipLimit(table, index, value, skip, limit,
                    sort, RETHINKDB_CONNECTION, function (err, data) {
                        if (err) {
                            console.error('Error: ', urlTag, err.stack)
                            return res.status(500).send('Something broke!')
                        }
                        
                        if (data) {
                            //-------REDIS CACHE SAVE START ------//
                            logger.info(urlTag + ' will save cached')
                            if (!DISABLE_CACHE) {
                                REDIS_CONNECTION.set(urlTag,
                                    JSON.stringify(data), 'EX',
                                    EXPIRE_REDIS)
                            }
                            //-------REDIS CACHE SAVE END ------//
                        }
                        res.send(data)
                    })
            })
        })
    
    /**
     * Get all from a table with a index and its value with skip and limit
     * bind to action/articles.js -> loadArticles
     * bind to app/sa.js -> used for listing all news and commentators infinitescroll
     *
     */
    app.get('/gapi_range/:table/:index/:value/:skip/:limit', limiter,
        (req, res) => {
            var table = req.params.table
            var index = req.params.index
            var value = req.params.value
            var skip = parseInt(req.params.skip)
            var limit = parseInt(req.params.limit)
            var start = parseInt(req.params.start)
            var end = parseInt(req.params.end)
            var range = parseInt(req.params.range)
            if (!range) {
                //default 6 months
                range = 12
            }
            var sort = req.query.sort
            var order = req.query.order || 'desc'
            
            var urlTag = `/gapi_range/${table}/${index}/${value}/${skip}/${limit}?sort=${sort}&order=${order}&range=${range}`
            // logger.info(urlTag);
            
            //-------REDIS CACHE START ------//
            REDIS_CONNECTION.get(urlTag, function (err, js) {
                if (!DISABLE_CACHE) {
                    if (err || !js) {
                        if (err) {
                            console.error('Error -> ', urlTag, err.stack)
                        }
                        //return res.status(500).send('Cache is broken!');
                    } else {
                        logger.info(urlTag + ' will return cached result ')
                        res.type('application/json')
                        return res.send(js)
                    }
                }
                //-------REDIS CACHE END ------//
                
                getAllByDateRangeIndexOrderByFilterSkipLimit(table, index,
                    value, skip, limit, sort, order, range,
                    RETHINKDB_CONNECTION,
                    function (err, data) {
                        if (err) {
                            console.error(
                                'getAllByDateRangeIndexOrderByFilterSkipLimit -> ',
                                err.stack)
                            return res.status(500).send('Something broke!')
                        }
                        
                        if (data) {
                            //-------REDIS CACHE SAVE START ------//
                            logger.info(urlTag + ' will save cached')
                            res.type('application/json')
                            if (!DISABLE_CACHE) {
                                REDIS_CONNECTION.set(urlTag,
                                    JSON.stringify(data), 'EX',
                                    EXPIRE_REDIS)
                            }
                            //-------REDIS CACHE SAVE END ------//
                        }
                        res.send(data)
                    })
                
            })
        })
    
    /**
     * Get all from a table with a index and its value with skip and limit
     * bind to action/articles.js -> loadArticles
     * bind to app/sa.js -> used for listing all news and commentators infinitescroll
     *
     */
    app.get('/gapi/:table/:index/:value/:skip/:limit', limiter,
        (req, res) => {
            var table = req.params.table
            var index = req.params.index
            var value = req.params.value
            var skip = parseInt(req.params.skip)
            var limit = parseInt(req.params.limit)
            
            var sort = req.query.sort
            var order = req.query.order || 'desc'
            
            var urlTag = `/gapi/${table}/${index}/${value}/${skip}/${limit}?sort=${sort}&order=${order}`
            // logger.info(urlTag);
            
            //-------REDIS CACHE START ------//
            REDIS_CONNECTION.get(urlTag, function (err, js) {
                if (!DISABLE_CACHE) {
                    if (err || !js) {
                        if (err) {
                            console.error('Error: ', urlTag, err.stack)
                        }
                        //return res.status(500).send('Cache is broken!');
                    } else {
                        logger.info(urlTag + ' will return cached result ')
                        res.type('application/json')
                        return res.send(js)
                    }
                }
                //-------REDIS CACHE END ------//
                
                getAllByIndexOrderByFilterSkipLimit(table, index, value, skip,
                    limit, sort, order, RETHINKDB_CONNECTION,
                    function (err, data) {
                        if (err) {
                            console.error('Error: ', urlTag, err.stack)
                            return res.status(500).send('Something broke!')
                        }
                        
                        if (data) {
                            //-------REDIS CACHE SAVE START ------//
                            logger.info(urlTag + ' will save cached')
                            res.type('application/json')
                            if (!DISABLE_CACHE) {
                                REDIS_CONNECTION.set(urlTag,
                                    JSON.stringify(data), 'EX',
                                    EXPIRE_REDIS)
                            }
                            //-------REDIS CACHE SAVE END ------//
                        }
                        res.send(data)
                    })
                
            })
        })
    
    /**
     * Get all from a table with a index and its value with skip and limit
     * bind to action/articles.js -> loadArticles
     * bind to app/sa.js -> used for listing all news and commentators infinitescroll
     * commentators.js ->  loadSuggestCommentDetail()
     *
     */
    app.get('/commentsapi/:table/:index/:value/:skip/:limit', limiter,
        (req, res) => {
            var table = req.params.table
            var index = req.params.index
            var value = req.params.value
            var skip = parseInt(req.params.skip)
            var limit = parseInt(req.params.limit)
            
            var urlTag = `/commentsapi/${table}/${index}/${value}/${skip}/${limit}`
            //logger.info(urlTag);
            
            //-------REDIS CACHE START ------//
            REDIS_CONNECTION.get(urlTag, function (err, js) {
                if (!DISABLE_CACHE) {
                    if (err || !js) {
                        if (err) {
                            console.error('Error: ', urlTag, err.stack)
                        }
                        //return res.status(500).send('Cache is broken!');
                    } else {
                        logger.debug(urlTag + ' will return cached result')
                        res.type('application/json')
                        return res.send(js)
                    }
                }
                //-------REDIS CACHE END ------//
                
                getAllByIndexOrderBySkipLimit(table, index, value, skip, limit,
                    'date', RETHINKDB_CONNECTION, function (err, data) {
                        if (err) {
                            console.error('Error: ', urlTag, err.stack)
                            return res.status(500).send('Something broke!')
                        }
                        
                        if (data) {
                            //-------REDIS CACHE SAVE START ------//
                            logger.debug(urlTag + ' will save cached')
                            res.type('application/json')
                            if (!DISABLE_CACHE) {
                                REDIS_CONNECTION.set(urlTag,
                                    JSON.stringify(data), 'EX',
                                    EXPIRE_REDIS)
                            }
                            //-------REDIS CACHE SAVE END ------//
                        }
                        res.send(data)
                    })
                
            })
        })
    
    //bind to action/articles.js -> loadArticleDetail
    app.get('/api/news/:id', limiter, (req, res) => {
        var sort = req.query.sort
        
        var urlTag = `/api/news/${req.params.id}`
        //logger.info(urlTag);
        
        //-------REDIS CACHE START ------//
        REDIS_CONNECTION.get(urlTag, function (err, js) {
            if (!DISABLE_CACHE) {
                if (err || !js) {
                    if (err) {
                        console.error('Error: ', urlTag, err.stack)
                    }
                    //return res.status(500).send('Cache is broken!');
                } else {
                    logger.info(urlTag + ' will return cached result ')
                    res.type('application/json')
                    return res.send(js)
                }
            }
            //-------REDIS CACHE END ------//
            
            var uuid = RETHINKDB_CONNECTION.uuid(req.params.id)
            getOneBySecondaryIndex('news', 'titleurlize', req.params.id,
                RETHINKDB_CONNECTION,
                function (err, news) {
                    if (err) {
                        console.error('Error: ', urlTag, err.stack)
                        return res.status(500).send('Something broke!')
                    } else if (!news) {
                        logger.info('News not found --> ' + req.params.id)
                        return res.status(404).
                            send('News not found --> ' + req.params.id)
                    }
                    
                    // "", "", uuid, 0, 50
                    var table = 'commentaries'
                    var index = 'operator_uuid'
                    var value = uuid
                    var operator = news.operator
                    var skip = 0
                    var limit = 50
                    var sort = 'date'
                    var order = req.query.order || 'desc'
                    
                    var params = {
                        table: table,
                        index: index,
                        value: value,
                        operator: operator,
                        skip: skip,
                        limit: limit,
                        sort: sort,
                        order: order,
                    }
                    
                    getAllByMultipleIndexOrderBySkipLimit(params,
                        RETHINKDB_CONNECTION,
                        function (err, comments) {
                            if (err) {
                                console.error('Error: ', urlTag, err.stack)
                                return res.status(500).send('Something broke!')
                            }
                            //logger.info(comments.length)
                            news.comments = comments
                            
                            if (news) {
                                //-------REDIS CACHE SAVE START ------//
                                logger.info(urlTag + ' will save cached')
                                if (!DISABLE_CACHE) {
                                    REDIS_CONNECTION.set(urlTag,
                                        JSON.stringify(news),
                                        'EX', EXPIRE_REDIS)
                                }
                                //-------REDIS CACHE SAVE END ------//
                            }
                            res.send(news)
                        })
                })
            
        })
        
    })
    
    //bind to action/articles.js -> loadArticleDetail
    app.get('/api/product/:id', limiter, (req, res) => {
        var sort = req.query.sort
        
        var urlTag = `/api/product/${req.params.id}`
        //logger.info(urlTag);
        
        //-------REDIS CACHE START ------//
        REDIS_CONNECTION.get(urlTag, function (err, js) {
            if (!DISABLE_CACHE) {
                if (err || !js) {
                    if (err) {
                        console.error('Error: ', urlTag, err.stack)
                    }
                    //return res.status(500).send('Cache is broken!');
                } else {
                    logger.info(urlTag + ' will return cached result ')
                    res.type('application/json')
                    return res.send(js)
                }
            }
            //-------REDIS CACHE END ------//
            
            getOneBySecondaryIndex('product', 'titleurlize', req.params.id,
                RETHINKDB_CONNECTION, function (err, news) {
                    if (err) {
                        console.error('Error: ', urlTag, err.stack)
                        return res.status(500).send('Something broke!')
                    } else if (!news) {
                        logger.info('Product not found --> ' + req.params.id)
                        return res.status(404).
                            send('News not found --> ' + req.params.id)
                    }
                    getAllByIndexOrderBySkipLimit('commentaries_product',
                        'titleurlize', req.params.id, 0, 50, sort,
                        RETHINKDB_CONNECTION,
                        function (err, comments) {
                            if (err) {
                                console.error('Error: ', urlTag, err.stack)
                                return res.status(500).send('Something broke!')
                            }
                            //logger.info(comments.length)
                            news.comments = comments
                            
                            if (news) {
                                //-------REDIS CACHE SAVE START ------//
                                logger.info(urlTag + ' will save cached')
                                if (!DISABLE_CACHE) {
                                    REDIS_CONNECTION.set(urlTag,
                                        JSON.stringify(news),
                                        'EX', EXPIRE_REDIS)
                                }
                                //-------REDIS CACHE SAVE END ------//
                            }
                            res.send(news)
                        })
                })
            
        })
        
    })
    
    app.get('/apihomepage/', limiter, (req, res) => {
        
        var index = req.query.index
        var value = req.query.value
        
        var urlTag = `apihomepage?index=${index}&value=${value}`
        
        //-------REDIS CACHE START ------//
        REDIS_CONNECTION.get(urlTag, function (err, js) {
            if (!DISABLE_CACHE) {
                if (err || !js) {
                    if (err) {
                        logger.debug('Error: apihomepage err ', err)
                    }
                    //return res.status(500).send('Cache is broken!');
                } else {
                    logger.debug('apihomepage will return cached result')
                    res.type('application/json')
                    return res.send(js)
                }
            }
            //-------REDIS CACHE END ------//
            
            if (index === 'product') {
                getLatestProductsWithCommentGroupDay(index, value,
                    RETHINKDB_CONNECTION,
                    function (err, news) {
                        
                        if (err) {
                            logger.debug(
                                'Error: getLatestCommentatorsGroupDay -> ',
                                err)
                            return res.status(500).send({})
                        } else {
                            //get commentators reduced
                            getLatestProductsCommentatorsGroupDay(index, value,
                                RETHINKDB_CONNECTION,
                                function (err, commentators) {
                                    
                                    var result = {
                                        news: news,
                                        commentators: commentators,
                                    }
                                    
                                    if (err) {
                                        logger.debug(
                                            'Error: getLatestNewsGroupDay, getLatestCommentatorsGroupDay -> ',
                                            err)
                                        return res.send(result)
                                    } else {
                                        
                                        if (!DISABLE_CACHE) {
                                            logger.debug(urlTag +
                                                ' will save cached')
                                            REDIS_CONNECTION.set(urlTag,
                                                JSON.stringify(result), 'EX',
                                                EXPIRE_REDIS)
                                        }
                                        return res.send(result)
                                    }
                                })
                        }
                    })
            } else if (index === 'youtube') {
                getLatestYoutubeWithCommentGroupDay(index, value,
                    RETHINKDB_CONNECTION,
                    function (err, news) {
                        
                        if (err) {
                            logger.debug(
                                'Error: getLatestCommentatorsGroupDay -> ',
                                err)
                            return res.status(500).send({})
                        } else {
                            //get commentators reduced
                            getLatestYoutubeCommentatorsGroupDay(index, value,
                                RETHINKDB_CONNECTION,
                                function (err, commentators) {
                                    
                                    var result = {
                                        news: news,
                                        commentators: commentators,
                                    }
                                    
                                    if (err) {
                                        logger.debug(
                                            'Error: getLatestNewsGroupDay, getLatestCommentatorsGroupDay -> ',
                                            err)
                                        return res.send(result)
                                    } else {
                                        
                                        if (!DISABLE_CACHE) {
                                            logger.debug(urlTag +
                                                ' will save cached')
                                            REDIS_CONNECTION.set(urlTag,
                                                JSON.stringify(result), 'EX',
                                                EXPIRE_REDIS)
                                        }
                                        return res.send(result)
                                    }
                                })
                        }
                    })
            } else {
                
                getLatestNewsWithCommentGroupDay(index, value,
                    RETHINKDB_CONNECTION,
                    function (err, news) {
                        
                        if (err) {
                            logger.debug(
                                'Error: getLatestCommentatorsGroupDay -> ',
                                err)
                            return res.status(500).send({})
                        } else {
                            //get commentators reduced
                            getLatestNewsCommentatorsGroupDay(index, value,
                                RETHINKDB_CONNECTION,
                                function (err, commentators) {
                                    
                                    var result = {
                                        news: news,
                                        commentators: commentators,
                                    }
                                    
                                    if (err) {
                                        logger.debug(
                                            'Error: getLatestNewsGroupDay, getLatestCommentatorsGroupDay -> ',
                                            err)
                                        return res.send(result)
                                    } else {
                                        
                                        if (!DISABLE_CACHE) {
                                            logger.debug(urlTag +
                                                ' will save cached')
                                            REDIS_CONNECTION.set(urlTag,
                                                JSON.stringify(result), 'EX',
                                                EXPIRE_REDIS)
                                        }
                                        return res.send(result)
                                    }
                                })
                        }
                    })
            }
        })
        
    })
    
    app.get('/api/getalldistinctybyindex/:table/:index/:value', limiter,
        (req, res) => {
            
            var urlTag = `/api/getalldistinctybyindex/${req.params.table}/${req.params.index}/${req.params.value}`
            //-------REDIS CACHE START ------//
            REDIS_CONNECTION.get(urlTag, function (err, js) {
                if (!DISABLE_CACHE) {
                    if (err || !js) {
                        if (err) {
                            logger.debug('Error: ' + urlTag + ' err ', err)
                        }
                        //return res.status(500).send('Cache is broken!');
                    } else {
                        logger.debug(urlTag + ' will return cached result')
                        res.type('application/json')
                        return res.send(js)
                    }
                }
                //-------REDIS CACHE END ------//
                
                getAllDistinctByIndex(RETHINKDB_CONNECTION, req.params.table,
                    req.params.index,
                    req.params.value).then((result) => {
                    if (!DISABLE_CACHE && result.length > 0) {
                        REDIS_CONNECTION.set(urlTag, JSON.stringify(result),
                            'EX',
                            '2592000')
                    }
                    res.type('application/json')
                    return res.send(result)
                }).catch((err) => {
                    logger.debug('Error: getAllDistinctByIndex -> ', err)
                    return res.status(500).send([])
                })
            })
        })
    
    app.get('/intropage/:table/:index/:value/:skip/:limit', limiter,
        (req, res) => {
            
            var table = req.params.table
            var index = req.params.index
            var value = req.params.value
            var skip = parseInt(req.params.skip)
            var limit = parseInt(req.params.limit)
            
            var urlTag = `/${table}/${index}/${value}/${skip}/${limit}`
            logger.debug(urlTag)
            
            //-------REDIS CACHE START ------//
            REDIS_CONNECTION.get('intropage' + urlTag, function (err, js) {
                if (!DISABLE_CACHE) {
                    if (err || !js) {
                        if (err) {
                            logger.debug('Error: intropage err ', err)
                        }
                        //return res.status(500).send('Cache is broken!');
                    } else {
                        logger.debug('intropage' + urlTag +
                            ' will return cached result')
                        res.type('application/json')
                        return res.send(js)
                    }
                }
                //-------REDIS CACHE END ------//
                
                let {getAlexaRank} = require('./alexa_api')
                
                getAlexaRank(comentarismosite, table, index, value, skip, limit,
                    'date', 50, RETHINKDB_CONNECTION,
                    function (err, alexarank) {
                        if (err) {
                            logger.debug('Error: getAlexaRank, ', urlTag)
                            return res.status(500).send({})
                        } else {
                            if (!DISABLE_CACHE) {
                                REDIS_CONNECTION.set('intropage' + urlTag,
                                    JSON.stringify(alexarank),
                                    'EX', EXPIRE_REDIS)
                            }
                            res.type('application/json')
                            //-------REDIS CACHE SAVE END ------//
                            //get comments
                            return res.send(alexarank)
                        }
                    })
            })
        })
    
    app.get('/random', limiter, (req, res) => {
        RETHINKDB_CONNECTION.table('sentiment_report', {readMode: 'outdated'}).
            sample(1).
            run().
            then(function (results) {
                if (!results) {
                    logger.debug('Got nothing when doing /random --> :| ')
                    return res.redirect(301, '/topvideos/type/YouTubeVideo')
                } else {
                    var theone = results[0]
                    
                    return res.redirect(301, '/sentiment/' +
                        encodeURIComponent(theone.url))
                }
            }).
            catch(function (err) {
                logger.debug('Got an error when doing /random --> ', err)
                return res.redirect(301, '/topvideos/type/YouTubeVideo')
            })
    })

//TODO: cache sitemap with redis
    
}