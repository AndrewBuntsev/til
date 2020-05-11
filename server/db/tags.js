
exports.getTags = async (db, options) => {

    const tags = (await db.collection('tags').find().toArray()).map(r => r.tag);
    return tags;
};

exports.addTag = async (db, options) => {
    const { tag } = options;
    const existentTag = await db.collection('tags').findOne({ tag: tag.toUpperCase() });
    if (!existentTag) {
        await db.collection('tags').insertOne({ tag: tag.toUpperCase() });
    }
};

