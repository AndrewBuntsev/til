const requestIp = require('request-ip');
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


const getViewers = app => {
    app.get('/api/getViewers', async (req, res) => {
        try {
            //const statistics = await dbClient.getStatistics();
            console.log(req.ips);
            res.status(200);
            res.json({
                status: statusCodes.SUCCESS, message: null, payload: {
                    ip1: req.headers['x-real-ip'],
                    ip2: req.connection.remoteAddress,
                    ip3: req.headers['x-forwarded-for'],
                    ip4: req.ip,
                    ip5: req.ips,
                    ip6: requestIp.getClientIp(req)
                }
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
    getStatistics(app);
    getViewers(app);
};