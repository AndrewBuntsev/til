var AWS = require('aws-sdk');
const { deleteCommas } = require("../../../helpers/textHelper");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.getTags = async (options) => {
    const params = {
        TableName: 'tags',
    };
    const dbResponse =  await dynamoDb.scan(params).promise();
    return dbResponse.Items.map(r => r.tag);
};

exports.addTag = async (options) => {
    const tag = deleteCommas(options.tag);
    // search existent tag
    const params = {
        TableName: 'tags',
        Key: { tag }
    };
    
    const dbResponse =  await dynamoDb.get(params).promise();
    if (dbResponse && !dbResponse.Item) {
        // add new tag
        const putParams = {
            TableName: 'tags',
            Item: { tag: tag.toUpperCase() }
        }
        await dynamoDb.put(putParams).promise();
        console.log('Added tag: ', tag);
    }
};

