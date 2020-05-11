const Mongo = require('mongodb');

const tags = require('./tags');

exports.getTils = async (db, options) => {
    const { _id, author, date, tag, searchTerm, random } = options;

    const criteria = {};
    if (_id) {
        criteria._id = new Mongo.ObjectID(_id);
    } else if (author) {
        criteria.userId = new Mongo.ObjectID(author);
    } else if (date) {
        criteria.date = date;
    } else if (tag) {
        criteria.tag = tag;
    } else if (searchTerm) {
        criteria.text = { $regex: searchTerm, $options: 'i' };
    }

    const results = random ?
        await db.collection('tils').aggregate([{ $sample: { size: parseInt(random) } }]).toArray()
        : await db.collection('tils').find(criteria).sort({ time: -1 }).toArray();

    return results;
};

exports.addTil = async (db, options) => {
    const { text, tag, userId, userName } = options;

    await db.collection('tils').insertOne({
        text,
        tag: tag.toUpperCase(),
        userId,
        userName,
        time: new Date(),
        date: Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date())
    });

    await tags.addTag(db, { tag });
};

exports.updateTil = async (db, options) => {
    const { text, tag, id } = options;

    await db.collection('tils').updateOne({ _id: id }, {
        $set: { text, tag: tag.toUpperCase() }
    });

    await tags.addTag(db, { tag });
};

exports.deleteTil = async (db, options) => {
    const { id } = options;

    await db.collection('tils').deleteOne({ _id: id });
};

