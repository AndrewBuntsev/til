const MONGO_DB_NAME = 'TIL';
//const MONGO_URI = 'mongodb://username:password@server.andreibuntsev.com:27017/TIL';
const MONGO_URI = `mongodb://localhost:27017/${MONGO_DB_NAME}`;
const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const MONGO_CLIENT_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };

const users = require('./users');
const tils = require('./tils');
const tags = require('./tags');


dbCall = async (func, options) => {
    const mongoClient = await MongoClient.connect(MONGO_URI, MONGO_CLIENT_OPTIONS);
    const db = mongoClient.db(MONGO_DB_NAME);

    const callResult = await func(db, options);

    mongoClient.close();
    return callResult;
};

//#region users
exports.getUser = async options => await dbCall(users.getUser, options);
exports.addUser = async options => await dbCall(users.addUser, options);
//#endregion users


//#region tils
exports.getTils = async options => await dbCall(tils.getTils, options);
exports.addTil = async options => await dbCall(tils.addTil, options);
exports.updateTil = async options => await dbCall(tils.updateTil, options);
exports.deleteTil = async options => await dbCall(tils.deleteTil, options);
//#endregion tils


//#region tags
exports.getTags = async options => await dbCall(tags.getTags, options);
exports.addTag = async options => await dbCall(tags.addTag, options);
//#endregion tags