// Import and require Pool (node-postgres)
// We'll be creating a Connection Pool. Read up on the benefits here: https://node-postgres.com/features/pooling
const { Pool } = require('pg');
// Using dotenv to configure our sensitive variables
require('dotenv').config();

// Connection properties
const pool = new Pool(
    {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: 'localhost',
        database: process.env.DB_NAME
    },
    console.log(`Connected to the employees_db database.`)
)

// Function to connect to the database and display ASCII art
function connect() {
    // Connect to database
    pool.connect();

    // Replicated the display from the mock-up
    console.log(',----------------------------------------------------.\n' +
                '|                                                    |\n' +
                '|    _____                 _                         |\n' +
                '|   | ____|_ __ ___  _ __ | | ___  _   _  ___  ___   |\n' +
                '|   |  _| | \'_ ` _ \\| \'_ \\| |/ _ \\| | | |/ _ \\/ _ \\  |\n' +
                '|   | |___| | | | | | |_) | | (_) | |_| |  __/  __/  |\n' +
                '|   |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|  |\n' +
                '|                   |_|            |___/             |\n' +
                '|    __  __                                          |\n' +
                '|   |  \\/  | __ _ _ __   __ _  __ _  ___ _ __        |\n' +
                '|   | |\\/| |/ _` | \'_ \\ / _` |/ _` |/ _ \\ \'__|       |\n' +
                '|   | |  | | (_| | | | | (_| | (_| |  __/ |          |\n' +
                '|   |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|          |\n' +
                '|                             |___/                  |\n' +
                '|                                                    |\n' +
                '`----------------------------------------------------\'');
}

// Export our properties and function
module.exports = { pool, connect };
