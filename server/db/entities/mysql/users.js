exports.getUser = async (query, options) => {
    const { ghId, liId } = options;

    let user = null;
    if (ghId) {
        user = await query(`SELECT * FROM users where ghId = '${ghId}'`);
    } else if (liId) {
        user = await query(`SELECT * FROM users where liId = '${liId}'`);
    }

    return user && Array.isArray(user) && user.length > 0 ? user[0] : null;
};

exports.getUserData = async (query, options) => {
    const { id } = options;
    const user = await query(`SELECT * FROM users where id = ${id}`);
    return user && Array.isArray(user) && user.length > 0 ? user[0] : null;
};


exports.addUser = async (query, options) => {
    const { ghId, liId, name } = options;
    const dbGhId = ghId ? `'${ghId}'` : 'NULL';
    const dbLiId = liId ? `'${liId}'` : 'NULL';

    const userId = await query(`INSERT INTO users (name, fbId, ghId, liId, fbUrl, liUrl, twUrl, wUrl, likedTils) 
        VALUES ('${name}', NULL, ${dbGhId}, ${dbLiId}, NULL, NULL, NULL, NULL, '');
        SELECT LAST_INSERT_ID();`);

    const user = await query(`SELECT * FROM users where id = ${userId}`);

    return user && Array.isArray(user) && user.length > 0 ? user[0] : null;
};


exports.updateUser = async (db, options) => {
    const { id, twUrl, liUrl, fbUrl, wUrl } = options;

    await query(`UPDATE users SET twUrl = '${twUrl}', liUrl = '${liUrl}', fbUrl = '${fbUrl}', wUrl = '${wUrl}' where id = ${id}`);
};

