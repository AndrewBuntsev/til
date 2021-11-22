var AWS = require('aws-sdk');
const notificationHelper = require('./../../../helpers/notificationHelper');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.getAllUsers = async (options) => {
    const params = {
        TableName: 'users',
    };
    const dbResponse =  await dynamoDb.scan(params).promise();
    return dbResponse.Items;
};

exports.getUser = async (options) => {
    const { ghId, liId, cogId } = options;

    const params = {
        TableName: 'users'
    };

    if (ghId) {
        params.FilterExpression = 'ghId = :ghId';
        params.ExpressionAttributeValues = { ':ghId': ghId };
    } else if (liId) {
        params.FilterExpression = 'liId = :liId';
        params.ExpressionAttributeValues = { ':liId': liId };
    } else if (cogId) {
        params.FilterExpression = 'cogId = :cogId';
        params.ExpressionAttributeValues = { ':cogId': cogId };
    }

    console.log('Getting a til user with params: ', params);
    const dbResponse =  await dynamoDb.scan(params).promise();
    return dbResponse && dbResponse.Items && dbResponse.Items.length > 0 ? dbResponse.Items[0] : null;
};

exports.getUserData = async (options) => {
    const params = {
        TableName: 'users',
        Key: { id: parseInt(options.id) }
    };
    const dbResponse =  await dynamoDb.get(params).promise();
    return dbResponse ? dbResponse.Item : null;
};


exports.addUser = async (options) => {
    const { ghId, liId, cogId, name } = options;
    const newUser = { id: new Date().getTime(), cogId, ghId, liId, name };

    // add new user
    const params = {
        TableName: 'users',
        Item: newUser
    };
    await dynamoDb.put(params).promise();

    notificationHelper.sendNotification(
        'Today I Learned User Created',
        `Created new user:
        Name: ${name}
        Id: ${newUser.id}`,
        'arn:aws:sns:ap-southeast-2:845915544577:til-account-created-notification-topic');

    return newUser;
};


exports.updateUser = async (options) => {
    const { id, twUrl, liUrl, fbUrl, wUrl } = options;

    const existentUser = await exports.getUserData({ id });

    const params = {
        TableName: 'users',
        Item: {
            ...existentUser,
            twUrl,
            liUrl,
            fbUrl,
            wUrl
        }
    };
    console.log('params = ', params)
    await dynamoDb.put(params).promise();
};

