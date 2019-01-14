const { Pool, Client } = require('pg');
var fs = require('fs');

let postgres = fs.readFileSync('../../postgres.txt').toString().split('\n');
const connectionString = postgres[0];

const pool = new Pool({
    connectionString: connectionString,
});

/*
pool.query('SELECT * FROM dept', (err, res) => {
    console.log(err, res)
    //pool.end()
});
*/

module.exports = pool;