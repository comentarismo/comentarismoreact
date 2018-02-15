var r = require('rethinkdbdash');


module.exports.createRethinkDBClient = function(RETHINKDB_HOST, RETHINKDB_PORT, RETHINKDB_PASSWORD, RETHINKDB_TABLE, RETHINKDB_TIMEOUT, RETHINKDB_DISCOVERY) {
    
    var conn = r({
        discovery: RETHINKDB_DISCOVERY,
        db: RETHINKDB_TABLE,
        timeout: RETHINKDB_TIMEOUT,
        servers: [
            {
                host: RETHINKDB_HOST,
                port: RETHINKDB_PORT,
                password: RETHINKDB_PASSWORD
            }
        ]
    });
    return conn;
    
}
