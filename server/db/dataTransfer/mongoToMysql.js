// .env initialize
require('dotenv').config();

const mysql = require('mysql');
const util = require('util');
const dbClient = require('./../dbClient');

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
    try {

        // //1. Copy tags
        // const tags = await dbClient.getTags({});
        // for (tag of tags) {
        //     await query(`INSERT INTO tags (tag) VALUES ('${tag}');`);
        // }

        // //2. Copy users
        // const users = await dbClient.getUsersData({});

        // for (user of users) {
        //     const ghId = user.ghId ? `'${user.ghId}'` : 'NULL';
        //     const liId = user.liId ? `'${user.liId}'` : 'NULL';
        //     const fbUrl = user.fbUrl ? `'${user.fbUrl}'` : 'NULL';
        //     const liUrl = user.liUrl ? `'${user.liUrl}'` : 'NULL';
        //     const twUrl = user.twUrl ? `'${user.twbUrl}'` : 'NULL';
        //     const wUrl = user.wUrl ? `'${user.wUrl}'` : 'NULL';
        //     await query(`INSERT INTO users (name, fbId, ghId, liId, fbUrl, liUrl, twUrl, wUrl, likedTils) 
        //     VALUES ('${user.name}', NULL, ${ghId}, ${liId}, ${fbUrl}, ${liUrl}, ${twUrl}, ${wUrl}, NULL);`);
        // }

        // //3. Copy TILs
        // const tils = (await dbClient.getTils({}));

        // for (til of tils) {
        //     await query(`INSERT INTO tils (text, tag, userId, timestamp, likes) 
        //        VALUES ('${til.text}', '${til.tag}', 1, '${(new Date(til.time)).toISOString().slice(0, 19).replace('T', ' ')}', 0);`);
        // }


        await end();
    } catch (err) {
        console.log(err);
    }
})();

