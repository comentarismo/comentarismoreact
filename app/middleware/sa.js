import superAgent from 'superagent'

export function getAllByIndexFilterSkipLimit(table,index,value,skip,limit,cb){
    console.log("/gapi/"+table+"/"+index+"/"+value+"/"+skip+"/"+limit);
    superAgent
        .get("/gapi/"+table+"/"+index+"/"+value+"/"+skip+"/"+limit).end(function(err, res){
        cb(err,res)
    });
}
