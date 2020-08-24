const statusCodes = require('../const/statusCodes');
const dbClient = require('../db/dbClient');
const logger = require('./../logger');
const { authoriseTilUser } = require('./../authoriseTilUser');


const getTags = app => {
    app.get('/api/getTags', async (req, res) => {
        try {
            const tags = await dbClient.getTags(req.query);
            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: '', payload: tags });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            logger.error(err.stack);
            res.json({ status: statusCodes.ERROR, message: err, payload: null })
        }
    });
};

const addTag = app => {
    app.put('/api/addTag', async (req, res) => {
        const { tag, ghId, liId, cogId, ghAccessToken, liAccessToken, cogAccessToken, cogRefreshToken } = req.body;
        try {
            let authResult = await authoriseTilUser({ ghId, liId, cogId, ghAccessToken, liAccessToken, cogAccessToken, cogRefreshToken });
            let tilUser = authResult.payload;
            if (!tilUser) {
                res.status(200);
                res.json(authResult);
                return;
            }

            await dbClient.addTag({ tag });
            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: `The tag ${tag} added successfully`, payload: null });
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
    getTags(app);
    addTag(app);
};