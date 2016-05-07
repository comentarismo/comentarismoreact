var sm = require('sitemap');


import  {getAllPluckDistinct,getAllByIndexPluckDistinct} from './comentarismo_api'

function generateSitemap(conn, cb) {
    //r.db('test').table('news').pluck("operator").distinct()
    var sitemap = sm.createSitemap({
        hostname: 'http://comentarismo.com',
        //hostname: 'http://localhost:3002',
        cacheTime: 600000
    });
    getAllPluckDistinct(conn, "news", "operator", function (err, operators) {
        if (err || !operators) {
            console.log(err);
        }
        for (var i = 0; i < operators.length; i++) {
            sitemap.add({url: '/news/operator/' + operators[i].operator});
            sitemap.add({url: '/commentators/operator/' + operators[i].operator});
            sitemap.add({url: '/news/operator/' + operators[i].operator + '/index.xml'});
            sitemap.add({url: '/commentators/operator/' + operators[i].operator + '/index.xml'});
        }

        getAllPluckDistinct(conn, "news", "languages", function (err, langs) {
            if (err || !operators) {
                console.log(err);
            }
            for (var i = 0; i < langs.length; i++) {
                sitemap.add({url: '/news/languages/' + langs[i].languages});
                sitemap.add({url: '/commentators/languages/' + langs[i].languages});
                sitemap.add({url: '/news/languages/' + langs[i].languages + '/index.xml'});
                sitemap.add({url: '/commentators/languages/' + langs[i].languages + '/index.xml'});
            }

            getAllPluckDistinct(conn, "news", "genre", function (err, genres) {
                if (err || !operators) {
                    console.log(err);
                }
                for (var i = 0; i < genres.length; i++) {
                    sitemap.add({url: '/news/genre/' + genres[i].genre});
                    //sitemap.add({url: '/commentators/genre/' + genres[i].genre});
                    sitemap.add({url: '/news/genre/' + genres[i].genre + '/index.xml'});
                    //sitemap.add({url: '/commentators/genre/' + genres[i].genre + '/index.xml'});
                }

                getAllPluckDistinct(conn, "news", "countries", function (err, countries) {
                    if (err || !operators) {
                        console.log(err);
                    }
                    for (var i = 0; i < countries.length; i++) {
                        sitemap.add({url: '/news/countries/' + countries[i].countries});
                        sitemap.add({url: '/commentators/countries/' + countries[i].countries});
                        sitemap.add({url: '/news/countries/' + countries[i].countries + '/index.xml'});
                        sitemap.add({url: '/commentators/countries/' + countries[i].countries + '/index.xml'});
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
    var pluck = (table == "news" ? "titleurlize" : "slug");

    if(!table || !index || !value){
        return ("search query is not correct.")
    }

    getAllByIndexPluckDistinct(table, index, value, pluck, conn,  function (err, values) {
        if (err || !values) {
            console.log(values)
            console.log(err);
            return cb(err || "503 - not valid query");
        }
        if (table == "news") {
            for (var i = 0; i < values.length; i++) {
                sitemap.add({url: '/news/' + values[i].titleurlize});
            }
            return cb(null, sitemap.toString());
        } else if (table == "commentator") {
            for (var i = 0; i < values.length; i++) {
                sitemap.add({url: '/commentators/' + value +"-" + values[i].slug});
            }
            return cb(null, sitemap.toString());
        } else {
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