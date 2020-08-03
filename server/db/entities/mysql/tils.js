const tags = require('./tags');
const { escapeCommas, deleteCommas } = require('../../../helpers/textHelper');

exports.getTils = async (query, options) => {
    const { id, author, likedBy, date, tag, searchTerm, random } = options;

    let whereClause = '';
    if (id) {
        whereClause += `where t.id = ${id}`;
    } else if (author) {
        whereClause += `where t.userId = ${author}`;
    } else if (likedBy) {
        whereClause += `where exists(select 1 from users u1 where u1.id = ${likedBy} and u1.likedTils like concat('%,', t.id, ',%'))`;
    } else if (date) {
        whereClause += `where date_format(timestamp, '%M %d, %Y') = '${date}'`;
    } else if (tag) {
        whereClause += `where tag = '${tag}'`;
    } else if (searchTerm) {
        whereClause += `where text like '%${searchTerm}%'`;
    }

    const results = random ?
        await query(`SELECT t.*, date_format(t.timestamp, '%M %d, %Y') as date, u.name as userName 
            FROM tils t
            inner join users u on u.id = t.userId and t.isDeleted = 0
            ORDER BY RAND() LIMIT 1`)
        : await query(`SELECT t.*, date_format(t.timestamp, '%M %d, %Y') as date, u.name as userName 
            FROM tils t
            inner join users u on u.id = t.userId and t.isDeleted = 0
            ${whereClause} 
            order by timestamp desc`);

    return results;
};

exports.addTil = async (query, options) => {
    const { text, tag, userId } = options;
    const upperTag = deleteCommas(tag).toUpperCase();

    await query(`INSERT INTO tils (text, tag, userId, timestamp, likes) 
                    VALUES ('${escapeCommas(text)}', '${upperTag}', ${userId}, '${(new Date()).toISOString().slice(0, 19).replace('T', ' ')}', 0);`);
    await tags.addTag(query, { tag });
};

exports.updateTil = async (query, options) => {
    let { text, tag, id } = options;

    await query(`UPDATE tils SET text = '${escapeCommas(text)}', tag = '${deleteCommas(tag).toUpperCase()}' where id = ${id}`);
    await tags.addTag(query, { tag });
};

exports.likeTil = async (query, options) => {
    let { tilId, userId } = options;

    await query(`UPDATE tils SET likes = likes + 1 where id = ${tilId};`);
    await query(`UPDATE users SET likedTils = CONCAT(likedTils, ',${tilId.toString()},') where id = ${userId};`);
};

exports.unlikeTil = async (query, options) => {
    let { tilId, userId } = options;

    await query(`UPDATE tils SET likes = likes - 1 where id = ${tilId};`);
    await query(`UPDATE users SET likedTils = REPLACE(likedTils, ',${tilId.toString()},', '') where id = ${userId};`);
};

exports.deleteTil = async (query, options) => {
    const { id } = options;

    await query(`UPDATE tils SET isDeleted = 1 where id = ${id}`);
};

