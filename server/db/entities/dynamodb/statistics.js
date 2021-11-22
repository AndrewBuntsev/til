var AWS = require('aws-sdk');
const users = require('./users');
const { groupBy } = require("../../../helpers/arrayHelper");
const dynamoDb = new AWS.DynamoDB.DocumentClient();


exports.getStatistics = async () => {
    // retrieve all tils
    const params = {
        TableName: 'tils',
        FilterExpression: 'isDeleted = :isDeleted',
        ExpressionAttributeValues: { ':isDeleted': 0 }
    };
    const dbResponse =  await dynamoDb.scan(params).promise();
    if (!dbResponse) {
        console.log('Cannot retrieve tils');
        return {};
    }
    const tils = dbResponse.Items;

    //retrieve all users
    allUsers = await users.getAllUsers();

    const topTils = await getTopTils(tils);
    const tags = await getTagStatistics(tils);
    const authors = await getAuthorStatistics(tils, allUsers);
    const dates = await getDateStatistics(tils);

    return { topTils, tags, authors, dates };
};


const getTopTils = async (tils) => {
    // sort by likes descending
    tils.sort((til1, til2) => til2.likes - til1.likes);
    const topTils = tils.slice(0, 10);
    const shortenTopTils = topTils.map(til => {
        const foundTitleMatch = til.text.match(/(?<=<h2>)(.|\n)*?(?=<\/h2>)/i);
        const title = (foundTitleMatch && foundTitleMatch[0] ? foundTitleMatch[0] : 'Untitled')
            .replace(/&amp;/g, 'and')
            .replace(/&nbsp;/g, ' ');
        return { id: til.id, title, tag: til.tag, likes: til.likes }
    });

    return shortenTopTils;
};


const getTagStatistics = async (tils) => {
    // group by tag
    const grouppedByTag = groupBy(tils, 'tag').map(group => ({ tag: group.field, tilsCount: group.groupList.length }));
    return grouppedByTag.sort((tag1, tag2) => tag2.tilsCount - tag1.tilsCount);
};


const getAuthorStatistics = async (tils) => {
    // group by author
    const grouppedByAuthor = groupBy(tils, 'userId').map(group => ({ 
        userId: group.groupList[0].userId, 
        userName: allUsers.find(u => u.id == group.groupList[0].userId).name,
        tilsCount: group.groupList.length 
    }));
    
    return grouppedByAuthor.sort((a1, a2) => a2.tilsCount - a1.tilsCount);
};


const getDateStatistics = async (tils) => {
    // add date field
    tils.forEach(til => til.date = til.timestamp.slice(0, 10));

    // group by date
    const grouppedByDate = groupBy(tils, 'date').map(group => ({ 
        date: new Date(group.field).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }), 
        epoctime: group.groupList[0].epoctime,
        tilsCount: group.groupList.length 
    }));
    const dates = grouppedByDate.sort((d1, d2) => d2.epoctime - d1.epoctime);

    // compose the result
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    datesResult = [];

    for (let days = 29; days >= 0; days--) {
        const dateString = Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }).format(startDate);
        const date = dates.find(d => d.date == dateString);
        datesResult.push(date ? date : { date: dateString, tilsCount: 0 });

        startDate.setDate(startDate.getDate() + 1);
    }

    return datesResult;
};