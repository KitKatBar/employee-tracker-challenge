const { Pool } = require('pg');

const pool = new Pool(
    {
        user: '',
        password: '',
        host: 'localhost',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
)

function connect() {
    pool.connect();
}

module.exports = { connect };
