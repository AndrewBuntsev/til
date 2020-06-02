exports.getStatistics = async (db) => {
    const topTils = await getTopTils(db);
    const tags = await getTagStatistics(db);
    const authors = await getAuthorStatistics(db);

    return { topTils, tags, authors };
};


const getTopTils = async (db) => {
    const topTils = await db.collection('tils').find().sort({ likes: -1 }).limit(10).toArray();
    const shortenTopTils = topTils.map(til => {
        const foundTitleMatch = til.text.match(/(?<=<h2>)(.|\n)*?(?=<\/h2>)/i);
        const title = foundTitleMatch && foundTitleMatch[0] ? foundTitleMatch[0] : 'Untitled'
        return { title, tag: til.tag, likes: til.likes }
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