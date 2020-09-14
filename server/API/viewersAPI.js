const dbClient = require('../db/dbClient');
const logger = require('./../logger');


const getViewers = app => {
    app.get('/api/getViewers', async (req, res) => {
        try {
            const viewers = await dbClient.getViewers({});
            const uniqueViewers = viewers.reduce((acc, el) => {
                if (acc.every(x => x.ip != el.ip)) {
                    acc.push({ ip: el.ip, timestamp: new Date(el.timestamp).getTime() });
                }
                return acc;
            }, []);

            const now = (new Date()).getTime();
            const dayAgo = now - 24 * 60 * 60 * 1000;
            const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
            const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

            res.status(200);
            res.json({
                lastDay: uniqueViewers.filter(v => v.timestamp >= dayAgo).length,
                lastWeek: uniqueViewers.filter(v => v.timestamp >= weekAgo).length,
                lastMonth: uniqueViewers.filter(v => v.timestamp >= monthAgo).length
            });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            logger.error(err.stack);
            res.json({ status: statusCodes.ERROR, message: err, payload: null });
        }
    });
};


module.exports = app => {
    getViewers(app);
};