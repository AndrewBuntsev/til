//const dbConnector = require('./connectors/mongoConnector');
const dbConnector = require('./connectors/mysqlConnector');
const { dbCall, users, tils, tags, statistics, viewers } = dbConnector;


//#region users
exports.getUser = async options => await dbCall(users.getUser, options);
exports.getUserData = async options => await dbCall(users.getUserData, options);
exports.getUsersData = async options => await dbCall(users.getUsersData, options);
exports.addUser = async options => await dbCall(users.addUser, options);
exports.updateUser = async options => await dbCall(users.updateUser, options);
exports.updateUserLikedTils = async options => await dbCall(users.updateUserLikedTils, options);
//#endregion users


//#region tils
exports.getTils = async options => await dbCall(tils.getTils, options);
exports.addTil = async options => await dbCall(tils.addTil, options);
exports.updateTil = async options => await dbCall(tils.updateTil, options);
exports.likeTil = async options => await dbCall(tils.likeTil, options);
exports.unlikeTil = async options => await dbCall(tils.unlikeTil, options);
exports.deleteTil = async options => await dbCall(tils.deleteTil, options);
//#endregion tils


//#region tags
exports.getTags = async options => await dbCall(tags.getTags, options);
exports.addTag = async options => await dbCall(tags.addTag, options);
//#endregion tags


//#region statistics
exports.getStatistics = async options => await dbCall(statistics.getStatistics, options);
//#endregion statistics


//#region viewers
exports.addViewer = async options => await dbCall(viewers.addViewer, options);
exports.getViewers = async options => await dbCall(viewers.getViewers, options);
//#endregion viewers