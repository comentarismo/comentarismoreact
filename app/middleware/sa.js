import superAgent from 'superagent'
import config from 'config'
var host = config.API_URL;

export function getAllByIndexFilterSkipLimit(table,index,value,skip,limit,sort,cb){
    console.log("/gapi/"+table+"/"+index+"/"+value+"/"+skip+"/"+limit+"?sort="+sort);
    superAgent
        .get("/gapi/"+table+"/"+index+"/"+value+"/"+skip+"/"+limit+"?sort="+sort).end(function(err, res){
        cb(err,res)
    });
}

export function getAPIAllByIndexFilterSkipLimit(table,index,value,skip,limit,sort,cb){
    var target = `${host}/listallbyindexorderby/${table}/${index}/${value}/${skip}/${limit}/${sort}/`;
    console.log(target);
    superAgent
        .get(target)
        .withCredentials()
        .end(function(err, res){
        cb(err,res)
    });
}

export function loadByID(table,index,cb){
    var target = `${host}/read/${table}/${index}/`;;
    console.log(target);
    superAgent
        .get(target)
        .withCredentials()
        .end(function(err, res){
            cb(err,res)
        });
}


export function doImageResize(url,data,cb){
    console.log("/gapi/"+table+"/"+index+"/"+value+"/"+skip+"/"+limit);
    superAgent
        .post(url).data(data).end(function(err, res){
        cb(err,res)
    });
}

export function saSentimentCommentDetail(url,cb){
    var target = `${config.SNT_URL}/moody?vid=${url}`;
    console.log(target);
    superAgent.get(target).end(function(err, res){
        console.log(res.body)
        cb(err,res)
    });
}