const pg = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });


const client = new pg.Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,   
    port: process.env.DATABASE_PORT,
})

module.exports = client