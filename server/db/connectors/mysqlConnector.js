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

exports.users = require('../entities/mysql/users');
exports.tils = require('../entities/mysql/tils');
exports.tags = require('../entities/mysql/tags');
exports.statistics = require('../entities/mysql/statistics');


exports.dbCall = async (func, options) => {
    const callResult = await func(query, options);
    //await end();
    return callResult;
};
