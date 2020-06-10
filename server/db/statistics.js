exports.getStatistics = async (db) => {
    const topTils = await getTopTils(db);
    const tags = await getTagStatistics(db);
    const authors = await getAuthorStatistics(db);
    const dates = await getDateStatistics(db);

    return { topTils, tags, authors, dates };
};


const getTopTils = async (db) => {
    const topTils = await db.collection('tils').find().sort({ likes: -1 }).limit(10).toArray();
    const shortenTopTils = topTils.map(til => {
        const foundTitleMatch = til.text.match(/(?<=<h2>)(.|\n)*?(?=<\/h2>)/i);
        const title = foundTitleMatch && foundTitleMatch[0] ? foundTitleMatch[0] : 'Untitled'
        return { _id: til._id, title, tag: til.tag, likes: til.likes }
    });

    return shortenTopTils;
};


const getTagStatistics = async (db) => {
    const tags = await db.collection('tils').aggregate([
        {
            $group: {
                _id: { tag: "$tag" },
                tilsCount: { $sum: 1 }
            }
        },
        {
            $sort: { tilsCount: -1 }
        }
    ]).toArray();

    return tags;
};


const getAuthorStatistics = async (db) => {
    const authors = await db.collection('tils').aggregate([
        {
            $group: {
                _id: { userId: "$userId", userName: "$userName" },
                tilsCount: { $sum: 1 }
            }
        },
        {
            $sort: { tilsCount: -1 }
        }
    ]).toArray();

    return authors;
};


const getDateStatistics = async (db) => {
    const dates = await db.collection('tils').aggregate([
        {
            $group: {
                _id: { date: "$date" },
                tilsCount: { $sum: 1 }
            }
        },
        {
            $sort: { _id: -1 }
        },
        {
            $limit: 31
        }
    ]).toArray();

    // compose the result
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    datesResult = [];

    for (let days = 29; days >= 0; days--) {
        const dateString = Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }).format(startDate);
        const date = dates.find(d => d._id.date == dateString);
        datesResult.push(date ? date : { _id: { date: dateString }, tilsCount: 0 });

        startDate.setDate(startDate.getDate() + 1);
    }

    return datesResult;
};