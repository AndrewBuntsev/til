exports.users = require('./entities/dynamodb/users');
exports.tils = require('./entities/dynamodb/tils');
exports.tags = require('./entities/dynamodb/tags');
exports.statistics = require('./entities/dynamodb/statistics');


exports.dbCall = async (func, options) => {
    const callResult = await func(options);
    return callResult;
};
