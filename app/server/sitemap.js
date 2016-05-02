var sm = require('sitemap');


import  {getAllPluckDistinct} from './comentarismo_api'

function generateSitemap(conn, cb){
    //r.db('test').table('news').pluck("operator").distinct()
    var sitemap = sm.createSitemap ({
        hostname: 'http://comentarismo.com',
        cacheTime: 600000
    });
    getAllPluckDistinct(conn,"news","operator",function(err,operators){
        if(err || !operators){
            console.log(err);
        }
        for(var i=0;i<operators.length;i++){
            sitemap.add({url: '/news/operator/'+operators[i].operator});
            sitemap.add({url: '/commentators/operator/'+operators[i].operator});
        }
        getAllPluckDistinct(conn,"news","language",function(err,langs) {
            if (err || !operators) {
                console.log(err);
            }
            for (var i = 0; i < langs.length; i++) {
                sitemap.add({url: '/news/languages/' + langs[i].language});
                sitemap.add({url: '/commentators/languages/' + langs[i].language});
            }
            getAllPluckDistinct(conn,"news","genre",function(err,genres) {
                if (err || !operators) {
                    console.log(err);
                }
                for (var i = 0; i < genres.length; i++) {
                    sitemap.add({url: '/news/genre/' + genres[i].genre});
                    sitemap.add({url: '/commentators/genre/' + genres[i].genre});
                }
                getAllPluckDistinct(conn,"news","countries",function(err,countries) {
                    if (err || !operators) {
                        console.log(err);
                    }
                    for (var i = 0; i < countries.length; i++) {
                        sitemap.add({url: '/news/countries/' + countries[i].countries});
                        sitemap.add({url: '/commentators/countries/' + countries[i].countries});
                    }

                    cb(null, sitemap.toString())
                });

            });

        });
    });
}

function generateIndexXml(){

}

module.exports = {
    generateSitemap:generateSitemap,
    generateIndexXml:generateIndexXml
}