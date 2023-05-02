const mysql = require('mysql2');

function connectionDB(database)
{
    const pool = mysql.createPool({
        user: "root",
        host: "localhost",
        password: "root",
        database: database
    });

    pool.getConnection(function(err){
        if(err)
        {
            console.log(err);
        }
    });

    return pool;
}

module.exports = { connectionDB };
