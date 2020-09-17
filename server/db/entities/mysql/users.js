const logger = require('./../../../logger');
const notificationHelper = require('./../../../helpers/notificationHelper');

exports.getUser = async (query, options) => {
    const { ghId, liId, cogId } = options;

    let user = null;
    if (ghId) {
        user = await query(`SELECT * FROM users where ghId = '${ghId}'`);
    } else if (liId) {
        user = await query(`SELECT * FROM users where liId = '${liId}'`);
    } else if (cogId) {
        user = await query(`SELECT * FROM users where cogId = '${cogId}'`);
    }

    return user && Array.isArray(user) && user.length > 0 ? user[0] : null;
};

exports.getUserData = async (query, options) => {
    const { id } = options;
    const user = await query(`SELECT * FROM users where id = ${id}`);
    return user && Array.isArray(user) && user.length > 0 ? user[0] : null;
};


exports.addUser = async (query, options) => {
    const { ghId, liId, cogId, name } = options;
    const dbGhId = ghId ? `'${ghId}'` : 'NULL';
    const dbLiId = liId ? `'${liId}'` : 'NULL';
    const dbCogId = cogId ? `'${cogId}'` : 'NULL';

    const insertDataPacket = await query(`INSERT INTO users (name, fbId, ghId, liId, cogId, fbUrl, liUrl, twUrl, wUrl, likedTils) 
        VALUES ('${name}', NULL, ${dbGhId}, ${dbLiId}, ${dbCogId}, NULL, NULL, NULL, NULL, '')`);
    const userId = insertDataPacket.insertId;
    logger.important('Created new user with ID: ' + userId);

    const user = await query(`SELECT * FROM users where id = ${userId}`);
    if (!user) {
        logger.error(`Error while creating new user. User ID: ${userId}`);
    } else {
        notificationHelper.sendNotification(
            'Today I Learned User Created',
            `Created new user:
            Name: ${name}
            Id: ${userId}`,
            'arn:aws:sns:ap-southeast-2:845915544577:til-account-created-notification-topic');
    }

    return user && Array.isArray(user) && user.length > 0 ? user[0] : null;
};


exports.updateUser = async (query, options) => {
    const { id, twUrl, liUrl, fbUrl, wUrl } = options;

    await query(`UPDATE users SET twUrl = '${twUrl}', liUrl = '${liUrl}', fbUrl = '${fbUrl}', wUrl = '${wUrl}' where id = ${id}`);
};

