const dbClient = require('../db/dbClient');
const logger = require('./../logger');


const getViewers = app => {
    app.get('/api/getViewers', async (req, res) => {
        try {
            const viewers = await dbClient.getViewers({});
            res.status(200);
            res.json(viewers);
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