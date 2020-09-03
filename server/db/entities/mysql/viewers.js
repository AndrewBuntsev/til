
exports.getViewers = async (query, options) => {
    const viewers = await query('SELECT * FROM viewers;');
    return viewers;
};


exports.addViewer = async (query, options) => {
    const { ip } = options;

    await query(`INSERT INTO viewers (ip, timestamp) 
                    VALUES ('${ip}', '${(new Date()).toISOString().slice(0, 19).replace('T', ' ')}');`);
};

