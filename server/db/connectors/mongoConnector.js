const MONGO_DB_NAME = 'TIL';
//const MONGO_URI = 'mongodb://username:password@server.andreibuntsev.com:27017/TIL';
const MONGO_URI = `mongodb://localhost:27017/${MONGO_DB_NAME}`;
const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const MONGO_CLIENT_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };

exports.users = require('./../entities/mongo/users');
exports.tils = require('./../entities/mongo/tils');
exports.tags = require('./../entities/mongo/tags');
exports.statistics = require('./../entities/mongo/statistics');


exports.dbCall = async (func, options) => {
    const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
    const db = mongoClient.db(MONGO_DB_NAME);

    const callResult = await func(db, options);

    mongoClient.close();
    return callResult;
};
