const Mongo = require('mongodb');

exports.getUser = async (db, options) => {
    const { ghId, liId } = options;

    let user = null;
    if (ghId) {
        user = await db.collection('users').findOne({ ghId });
    } else if (liId) {
        user = await db.collection('users').findOne({ liId });
    }

    return user;
};

exports.addUser = async (db, options) => {
    const { ghId, liId, name } = options;

    await db.collection('users').insertOne({ ghId, liId, name });
    let user = await db.collection('users').findOne({ ghId, liId });

    return user;
};

exports.updateUser = async (db, options) => {
    const { id, likedTils } = options;

    await db.collection('users').updateOne({ _id: id },
        {
            $set: { likedTils }
        });
};

