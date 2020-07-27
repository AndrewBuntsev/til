exports.getStatistics = async (query) => {
    const topTils = await getTopTils(query);
    const tags = await getTagStatistics(query);
    const authors = await getAuthorStatistics(query);
    const dates = await getDateStatistics(query);

    return { topTils, tags, authors, dates };
};


const getTopTils = async (query) => {
    const topTils = await query('SELECT * FROM tils where isDeleted = 0 order by likes desc limit 10');
    const shortenTopTils = topTils.map(til => {
        const foundTitleMatch = til.text.match(/(?<=<h2>)(.|\n)*?(?=<\/h2>)/i);
        const title = foundTitleMatch && foundTitleMatch[0] ? foundTitleMatch[0] : 'Untitled'
        return { id: til.id, title, tag: til.tag, likes: til.likes }
    });

    return shortenTopTils;
};


const getTagStatistics = async (query) => {
    const tags = await query('select tag, count(tag) as tilsCount from tils where isDeleted = 0 group by tag order by tilsCount desc');

    return tags;
};


const getAuthorStatistics = async (query) => {
    const authors = await query(`select t.userId, u.name as userName, count(t.userId) as tilsCount 
        from tils t 
        inner join users u on u.id = t.userId
        where t.isDeleted = 0
        group by userId order by tilsCount desc`);

    return authors;
};


const getDateStatistics = async (query) => {
    const dates = await query(`select date_format(timestamp, '%M %d, %Y') as date, count(date_format(timestamp, '%M %d, %Y')) as tilsCount 
        from tils
        where isDeleted = 0
        group by date_format(timestamp, '%M %d, %Y') order by timestamp desc limit 31`);

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