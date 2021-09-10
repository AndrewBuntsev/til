// .env initialize
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

exports.users = require('./entities/users');
exports.tils = require('./entities/tils');
exports.tags = require('./entities/tags');
exports.statistics = require('./entities/statistics');


exports.dbCall = async (func, options) => {
    const callResult = await func(query, options);
    //await end();
    return callResult;
};
