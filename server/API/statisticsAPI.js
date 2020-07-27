const statusCodes = require('../const/statusCodes');
const dbClient = require('../db/dbClient');
const logger = require('./../logger');


const getStatistics = app => {
    app.get('/api/getStatistics', async (req, res) => {
        try {
            const statistics = await dbClient.getStatistics();
            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: null, payload: statistics });
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
    getStatistics(app);
};