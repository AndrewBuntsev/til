const Mongo = require('mongodb');
const statusCodes = require('../const/statusCodes');
const dbClient = require('../db/dbClient');
const logger = require('./../logger');
const { authoriseTilUser } = require('./../authoriseTilUser');


const getUserData = app => {
    app.get('/api/getUserData', async (req, res) => {
        const { id } = req.query;
        try {
            const user = await dbClient.getUserData({ id });
            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: null, payload: user });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            logger.error(err.stack);
            res.json({ status: statusCodes.ERROR, message: err, payload: null });
        }
    });
};


const updateUser = app => {
    app.post('/api/updateUser', async (req, res) => {
        const { ghId, liId, cogId, ghAccessToken, liAccessToken, cogAccessToken, twUrl, liUrl, fbUrl, wUrl } = req.body;
        try {
            let authResult = await authoriseTilUser({ ghId, liId, cogId, ghAccessToken, liAccessToken, cogAccessToken });
            let tilUser = authResult.payload;
            if (!tilUser) {
                res.status(200);
                res.json(authResult);
                return;
            }

            await dbClient.updateUser({ id: tilUser.id, twUrl, liUrl, fbUrl, wUrl });
            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: 'User data has been updated successfully', payload: null });
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
    getUserData(app);
    updateUser(app);
};