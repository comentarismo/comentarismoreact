var sm = require('sitemap');

/** LOGGER **/
var log = require("./logger");
var logger = log.getLogger();
/** LOGGER **/

import  {getAllPluckDistinct, getAllByIndexPluckDistinct} from './comentarismo_api'

function generateSitemap(conn, cb) {
    //r.db('test').table('news').pluck("operator").distinct()
    var sitemap = sm.createSitemap({
        hostname: 'http://comentarismo.com',
        //hostname: 'http://localhost:3002',
        cacheTime: 600000
    });
    getAllPluckDistinct(conn, "news", "operator", function (err, operators) {
        if (err || !operators) {
            logger.error(err);
        }

        sitemap.add({url: '/commentators_product/operator/amazon/index.xml', changefreq: 'daily'});

        for (var i = 0; i < operators.length; i++) {
            sitemap.add({url: '/news/operator/' + operators[i], changefreq: 'daily'});
            sitemap.add({url: '/commentators/operator/' + operators[i], changefreq: 'daily'});
            sitemap.add({url: '/news/operator/' + operators[i] + '/index.xml', changefreq: 'daily'});
            sitemap.add({url: '/commentators/operator/' + operators[i] + '/index.xml', changefreq: 'daily'});
        }

        getAllPluckDistinct(conn, "news", "languages", function (err, langs) {
            if (err || !operators) {
                logger.error(err);
            }
            for (var i = 0; i < langs.length; i++) {
                sitemap.add({url: '/news/languages/' + langs[i], changefreq: 'daily'});
                sitemap.add({url: '/commentators/languages/' + langs[i]+ '/index.xml', changefreq: 'daily'});
                sitemap.add({url: '/news/languages/' + langs[i] + '/index.xml', changefreq: 'daily'});
                sitemap.add({url: '/commentators/languages/' + langs[i] + '/index.xml', changefreq: 'daily'});
            }

            getAllPluckDistinct(conn, "news", "genre", function (err, genres) {
                if (err || !operators) {
                    logger.error(err);
                }
                for (var i = 0; i < genres.length; i++) {
                    sitemap.add({url: '/news/genre/' + genres[i], changefreq: 'daily'});
                    //sitemap.add({url: '/commentators/genre/' + genres[i].genre});
                    sitemap.add({url: '/news/genre/' + genres[i] + '/index.xml', changefreq: 'daily'});
                    //sitemap.add({url: '/commentators/genre/' + genres[i].genre + '/index.xml'});
                }

                getAllPluckDistinct(conn, "news", "countries", function (err, countries) {
                    if (err || !operators) {
                        logger.error(err);
                    }
                    for (var i = 0; i < countries.length; i++) {
                        sitemap.add({url: '/news/countries/' + countries[i], changefreq: 'daily'});
                        sitemap.add({url: '/commentators/countries/' + countries[i], changefreq: 'daily'});
                        sitemap.add({url: '/news/countries/' + countries[i] + '/index.xml', changefreq: 'daily'});
                        sitemap.add({
                            url: '/commentators/countries/' + countries[i] + '/index.xml',
                            changefreq: 'daily'
                        });
                    }

                    cb(null, sitemap.toString())
                });

            });

        });
    });
}

function generateIndexXml(table, index, value, conn, cb) {
    var sitemap = sm.createSitemap({
        hostname: 'http://comentarismo.com',
        //hostname: 'http://localhost:3002',
        cacheTime: 600000
    });
    table = (table == "commentators" ? "commentator" : table);
    var pluck = (table == "news" || table === "product" ? "titleurlize" : "slug");

    if (table == "sentiment_report") {
        pluck = "url";
    } else if (table == "commentator") {
        pluck = "id"
    } else if (table == "commentators_product") {
        pluck = "id"
        table = "commentator_product"
    }

    if (!table || !index || !value) {
        console.log("Error: generateIndexXml, search query is not correct ", table, index, value);
        return ("search query is not correct.")
    }

    getAllByIndexPluckDistinct(table, index, value, pluck, conn, function (err, values) {
        if (err || !values) {
            logger.error("Error: getAllByIndexPluckDistinct -> ", err, values);
            return cb(err || "503 - not valid query");
        }
        //console.log(values)
        if (table == "news") {
            for (var i = 0; i < values.length; i++) {
                sitemap.add({
                    url: '/news/' + values[i].titleurlize, news: {
                        publication: {
                            name: values[i].title,
                            language: values[i].languages
                        },
                        title: values[i].title,
                        publication_date: new Date(values[i].date).toISOString(),
                        keywords: ""
                    }, changefreq: 'daily'
                });
            }
            return cb(null, sitemap.toString());
        } else if (table == "commentator") {
            for (var i = 0; i < values.length; i++) {
                sitemap.add({url: '/commentators/' + values[i].id, changefreq: 'daily'});
            }
            return cb(null, sitemap.toString());
        } else if (table == "sentiment_report") {
            for (var i = 0; i < values.length; i++) {
                sitemap.add({url: '/sentiment/' + encodeURIComponent(values[i].url), changefreq: 'daily'});
            }
            return cb(null, sitemap.toString());
        } else if (table == "product") {
            for (var i = 0; i < values.length; i++) {
                sitemap.add({url: '/product/' + encodeURIComponent(values[i].titleurlize), changefreq: 'daily'});
            }
            return cb(null, sitemap.toString());
        } else if (table == "commentator_product") {
            for (var i = 0; i < values.length; i++) {
                sitemap.add({url: '/commentators_product/' + encodeURIComponent(values[i].id), changefreq: 'daily'});
            }
            return cb(null, sitemap.toString());
        }

        else {
            return cb("not valid table");
        }
    });
}

var getIndexFromPath = function getIndexFromPath(index) {
    var path = window.location.pathname.split('/');
    return path[index];
};

module.exports = {
    generateSitemap: generateSitemap,
    generateIndexXml: generateIndexXml
}