// .env initialize
require('dotenv').config();

const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool(
    {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }
);

const query = util.promisify(pool.query).bind(pool);
const end = util.promisify(pool.end).bind(pool);


(async () => {
    await query(`ALTER TABLE tils
    ADD COLUMN isDeleted TINYINT(1) NOT NULL DEFAULT 0 AFTER likes`);
    await end();
})();
