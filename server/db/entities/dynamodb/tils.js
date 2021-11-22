var AWS = require('aws-sdk');
const notificationHelper = require('./../../../helpers/notificationHelper');
const users = require('./users');
const tags = require('./tags');
const { escapeCommas, deleteCommas } = require('../../../helpers/textHelper');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const PAGE_SIZE = 30;

let allUsers = null;

exports.getTils = async (options) => {
    const { id, author, likedBy, date, tag, page, searchTerm, random } = options ? options :{};

    if (!allUsers) {
        allUsers = await users.getAllUsers();
    }

    console.log('allUsers = ', allUsers)

    const params = {
        TableName: 'tils',
        FilterExpression: 'isDeleted = :isDeleted',
        ExpressionAttributeValues: { ':isDeleted': 0 }
    };
    
    let tilsResult = [];

    if (id) {
        // search by ID
        params.Key = { id: parseInt(id) };
        const dbResponse =  await dynamoDb.get(params).promise();
        if (dbResponse && dbResponse.Item && !dbResponse.Item.isDeleted) {
            tilsResult = [dbResponse.Item];
        }
    } else if (author) {
        // search by author
        params.FilterExpression = params.FilterExpression + ' and userId = :userId';
        params.ExpressionAttributeValues[':userId'] = parseInt(author);
        const dbResponse =  await dynamoDb.scan(params).promise();
        if (dbResponse) {
            tilsResult = dbResponse.Items;
        }
    } else if (likedBy) {
        // search by likedBy
        const likedByParsed = parseInt(likedBy);
        const likedByUser = allUsers.find(u => u.id == likedByParsed);
        if (likedByUser) {
            likedTils = likedByUser.likedTils.split(',').filter(tilId => tilId).map(tilId => ({ id: parseInt(tilId) }));
            const dbResponse =  await dynamoDb.batchGet({
                RequestItems: {
                    "tils": { Keys: likedTils }
                } 
            }).promise();
            if (dbResponse) {
                tilsResult = dbResponse.Responses.tils;
            }
        }
    } else if (date) {
        // search by date
        const dateParsed = new Date(date);
        const epoctimeStartOfDay = Math.floor(new Date(dateParsed.getFullYear(), dateParsed.getMonth(), dateParsed.getDate()).getTime() / 1000);
        const epoctimeEndOfDay = epoctimeStartOfDay + (24 * 60 * 60 - 1);
        params.FilterExpression = params.FilterExpression + ' and epoctime between :startTime and :endTime';
        params.ExpressionAttributeValues[':startTime'] = epoctimeStartOfDay;
        params.ExpressionAttributeValues[':endTime'] = epoctimeEndOfDay;
        const dbResponse =  await dynamoDb.scan(params).promise();
        if (dbResponse) {
            tilsResult = dbResponse.Items;
        }
    } else if (tag) {
        // search by tag
        params.FilterExpression = params.FilterExpression + ' and tag = :tag';
        params.ExpressionAttributeValues[':tag'] = tag;
        const dbResponse =  await dynamoDb.scan(params).promise();
        if (dbResponse) {
            tilsResult = dbResponse.Items;
        }
    } else if (searchTerm) {
        // search by searchTerm
        params.FilterExpression = params.FilterExpression + ' and contains(#text, :searchTerm)';
        params.ExpressionAttributeNames = {
            "#text": "text"
        };
        params.ExpressionAttributeValues[':searchTerm'] = searchTerm;
        const dbResponse =  await dynamoDb.scan(params).promise();
        if (dbResponse) {
            tilsResult = dbResponse.Items;
        }
    } else {
        // get all tils
        const dbResponse =  await dynamoDb.scan(params).promise();
        if (dbResponse) {
            tilsResult = dbResponse.Items;
            console.log('dbResponse = ', dbResponse)
        }

        // sort by date descending
        tilsResult.sort((til1, til2) => til2.epoctime - til1.epoctime);

        // take a page of tils
        let pageNumber = parseInt(page);
        if (isNaN(pageNumber) || pageNumber < 1) {
            pageNumber = 1;
        }
        tilsResult = tilsResult.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE);
    }

    // sort by date descending
    // todo: refactor it as it is used twice when retrieve all tils
    tilsResult.sort((til1, til2) => til2.epoctime - til1.epoctime);

    // pick a random til
    if (random) {
        tilsResult = [tilsResult[Math.floor(Math.random() * tilsResult.length)]];
    }

    
    // additional properties
    tilsResult.forEach(til => {
        til.userName = allUsers.find(u => u.id == til.userId).name;
        til.date = new Date(til.epoctime * 1000).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    });

    return tilsResult;
};

exports.addTil = async (options) => {
    const { text, tag, userId } = options;
    const upperTag = deleteCommas(tag).toUpperCase();
    const epoctime = new Date().getTime();

    // add new til
    const params = {
        TableName: 'tils',
        Item: {
            id: epoctime,
            epoctime: Math.floor(epoctime / 1000),
            isDeleted: 0,
            likes: 0,
            tag: upperTag,
            text: escapeCommas(text),
            timestamp: (new Date()).toISOString().slice(0, 19).replace('T', ' '),
            userId
        }
    }
    await dynamoDb.put(params).promise();

    // add new tag if necessary
    await tags.addTag({ tag });

    // notify subscribers
    notificationHelper.sendNotification(
        'Today I Learned Article Added',
        `Added new article by the user (ID): ${userId}`,
        'arn:aws:sns:ap-southeast-2:845915544577:til-article-added-notification-topic');
};

exports.updateTil = async (options) => {
    let { text, tag, id } = options;
    const [ existentTil ] = await exports.getTils({ id });
    console.log('TIL before update: ', existentTil);

    // update til
    const params = {
        TableName: 'tils',
        Item: {
            id,
            epoctime: existentTil.epoctime,
            isDeleted: 0,
            likes: existentTil.likes,
            tag: deleteCommas(tag).toUpperCase(),
            text: escapeCommas(text),
            timestamp: existentTil.timestamp,
            userId: existentTil.userId
        }
    }
    console.log('Update params: ', params);
    await dynamoDb.put(params).promise();

    // add new tag if necessary
    await tags.addTag({ tag });
};

exports.likeTil = async (options) => {
    let { tilId, userId } = options;

    // update til
    const [ existentTil ] = await exports.getTils({ id: tilId });
    const params = {
        TableName: 'tils',
        Item: { ...existentTil, likes: existentTil.likes + 1 }
    }
    console.log('params = ', params);
    await dynamoDb.put(params).promise();

    // update user
    const existentUser = await users.getUserData({ id: userId });
    const userParams = {
        TableName: 'users',
        Item: { ...existentUser, likedTils: `${existentUser.likedTils ? existentUser.likedTils : ''},${tilId.toString()},` }
    }
    console.log('userParams = ', userParams);
    await dynamoDb.put(userParams).promise();
};

exports.unlikeTil = async (options) => {
    let { tilId, userId } = options;

    // update til
    const [ existentTil ] = await exports.getTils({ id: tilId });
    const params = {
        TableName: 'tils',
        Item: { ...existentTil, likes: existentTil.likes - 1 }
    }
    console.log('params = ', params);
    await dynamoDb.put(params).promise();

    // update user
    const existentUser = await users.getUserData({ id: userId });
    const userParams = {
        TableName: 'users',
        Item: { ...existentUser, likedTils: existentUser.likedTils.replace(`,${tilId.toString()},`, '') }
    }
    console.log('userParams = ', userParams);
    await dynamoDb.put(userParams).promise();
};

exports.deleteTil = async (options) => {
    let { id } = options;
    const [ existentTil ] = await exports.getTils({ id });

    // delete til
    const params = {
        TableName: 'tils',
        Item: {
            id,
            epoctime: existentTil.epoctime,
            isDeleted: 1,
            likes: existentTil.likes,
            tag: existentTil.tag,
            text: existentTil.text,
            timestamp: existentTil.timestamp,
            userId: existentTil.userId
        }
    }
    await dynamoDb.put(params).promise();
};

