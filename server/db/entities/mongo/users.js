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

exports.getUserData = async (db, options) => {
    const { id } = options;
    console.log(options)
    const user = await db.collection('users').findOne({ _id: id });
    return user;
};

exports.addUser = async (db, options) => {
    const { ghId, liId, name } = options;

    await db.collection('users').insertOne({ ghId, liId, name });
    const user = await db.collection('users').findOne({ ghId, liId });

    return user;
};

exports.updateUserLikedTils = async (db, options) => {
    const { id, likedTils } = options;

    await db.collection('users').updateOne({ _id: id },
        {
            $set: { likedTils }
        });
};

exports.updateUser = async (db, options) => {
    const { id, twUrl, liUrl, fbUrl, wUrl } = options;

    await db.collection('users').updateOne({ _id: id },
        {
            $set: { twUrl, liUrl, fbUrl, wUrl }
        });
};

