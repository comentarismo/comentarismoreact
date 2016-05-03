import superAgent from 'superagent'

export function getAllByIndexFilterSkipLimit(table,index,value,skip,limit,sort,cb){
    console.log("/gapi/"+table+"/"+index+"/"+value+"/"+skip+"/"+limit+"?sort="+sort);
    superAgent
        .get("/gapi/"+table+"/"+index+"/"+value+"/"+skip+"/"+limit+"?sort="+sort).end(function(err, res){
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