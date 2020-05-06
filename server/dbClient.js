const MONGO_DB_NAME = 'TIL';
//const MONGO_URI = 'mongodb://username:password@server.andreibuntsev.com:27017/TIL';
const MONGO_URI = `mongodb://localhost:27017/${MONGO_DB_NAME}`;
const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const MONGO_CLIENT_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };




exports.getUser = async options => {
    const { ghId, liId } = options;

    const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
    const db = mongoClient.db(MONGO_DB_NAME);
    let user = null;
    if (ghId) {
        user = await db.collection('users').findOne({ ghId });
    } else if (liId) {
        user = await db.collection('users').findOne({ liId });
    }

    mongoClient.close();
    return user;
};

exports.addUser = async options => {
    const { ghId, liId, name } = options;

    const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
    const db = mongoClient.db(MONGO_DB_NAME);

    await db.collection('users').insertOne({ ghId, liId, name });
    let user = await db.collection('users').findOne({ ghId, liId });
    mongoClient.close();

    return user;
};

exports.getTils = async options => {
    const { _id, author, date, searchTerm, random } = options;
    const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
    const db = mongoClient.db(MONGO_DB_NAME);


    const criteria = {};
    if (_id) {
        criteria._id = new Mongo.ObjectID(_id);
    } else if (author) {
        criteria.userId = new Mongo.ObjectID(author);
    } else if (date) {
        criteria.date = date;
    } else if (searchTerm) {
        criteria.text = { $regex: searchTerm, $options: 'i' };
    }

    const results = random ?
        await db.collection('tils').aggregate([{ $sample: { size: parseInt(random) } }]).toArray()
        : await db.collection('tils').find(criteria).sort({ time: -1 }).toArray();

    mongoClient.close();
    return results;
};

exports.addTil = async options => {
    const { text, userId, userName } = options;

    const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
    const db = mongoClient.db(MONGO_DB_NAME);

    await db.collection('tils').insertOne({
        text,
        userId,
        userName,
        time: new Date(),
        date: Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date())
    });
    mongoClient.close();
};

exports.updateTil = async options => {
    const { text, id } = options;

    const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
    const db = mongoClient.db(MONGO_DB_NAME);

    await db.collection('tils').updateOne({ _id: id }, {
        $set: { text }
    });
    mongoClient.close();
};

exports.deleteTil = async options => {
    const { id } = options;

    const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
    const db = mongoClient.db(MONGO_DB_NAME);

    await db.collection('tils').deleteOne({ _id: id });
    mongoClient.close();
};

