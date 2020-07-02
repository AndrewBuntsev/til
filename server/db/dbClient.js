const dbConnector = require('./connectors/mongoConnector');
const { dbCall, users, tils, tags, statistics } = dbConnector;


//#region users
exports.getUser = async options => await dbCall(users.getUser, options);
exports.getUserData = async options => await dbCall(users.getUserData, options);
exports.addUser = async options => await dbCall(users.addUser, options);
exports.updateUser = async options => await dbCall(users.updateUser, options);
exports.updateUserLikedTils = async options => await dbCall(users.updateUserLikedTils, options);
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


//#region statistics
exports.getStatistics = async options => await dbCall(statistics.getStatistics, options);
//#endregion statistics