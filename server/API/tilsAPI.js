const statusCodes = require('../const/statusCodes');
const dbClient = require('../db/dbClient');
const { authoriseTilUser } = require('./../authoriseTilUser');


const getTils = app => {
    app.get('/api/getTils', async (req, res) => {
        try {
            const tils = await dbClient.getTils(req.query);
            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: '', payload: tils });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null })
        }
    });
};

const saveTil = app => {
    app.post('/api/saveTil', async (req, res) => {
        const { text, tag, tilId, ghId, liId, ghAccessToken, liAccessToken } = req.body;
        try {
            let authResult = await authoriseTilUser({ ghId, liId, ghAccessToken, liAccessToken });
            let tilUser = authResult.payload;
            if (!tilUser) {
                res.status(200);
                res.json(authResult);
                return;
            }

            if (tilId) {
                // try to update the til
                const til = (await dbClient.getTils({ _id: tilId }))[0];
                if (til) {
                    if (tilUser._id.toString() != til.userId.toString()) {
                        res.status(500);
                        console.log(tilUser._id);
                        console.log(til.userId);
                        res.json({ status: statusCodes.ERROR, message: 'Not enough permissions to edit the article', payload: null });
                        return;
                    }

                    await dbClient.updateTil({ text, tag, id: til._id });
                    res.json({ status: statusCodes.SUCCESS, message: 'Article has been updated successfully', payload: null });
                    return;
                }
            }

            await dbClient.addTil({ text, tag, userId: tilUser._id, userName: tilUser.name });
            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: 'Article has been added successfully', payload: null });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null });
        }
    });
};

const deleteTil = app => {
    app.delete('/api/deleteTil', async (req, res) => {
        const { tilId, ghId, liId, ghAccessToken, liAccessToken } = req.body;
        try {
            if (!tilId) {
                res.status(200);
                res.json({ status: statusCodes.ERROR, message: `Article ID not provided`, payload: null });
                return;
            }

            let authResult = await authoriseTilUser({ ghId, liId, ghAccessToken, liAccessToken });
            let tilUser = authResult.payload;
            if (!tilUser) {
                res.status(200);
                res.json(authResult);
                return;
            }

            const til = (await dbClient.getTils({ _id: tilId }))[0];

            if (!til) {
                res.status(200);
                res.json({ status: statusCodes.ERROR, message: `Article with ID ${tilId} not found`, payload: null });
                return;
            }

            if (tilUser._id.toString() != til.userId.toString()) {
                res.status(500);
                res.json({ status: statusCodes.ERROR, message: 'Not enough permissions to delete the article', payload: null });
                return;
            }

            await dbClient.deleteTil({ id: til._id });
            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: 'Article has been deleted successfully', payload: null });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null });
        }
    });
};

const likeTil = app => {
    app.patch('/api/likeTil', async (req, res) => {
        const { tilId, ghId, liId, ghAccessToken, liAccessToken } = req.body;
        try {
            if (!tilId) {
                res.status(200);
                res.json({ status: statusCodes.ERROR, message: `Article ID not provided`, payload: null });
                return;
            }

            let authResult = await authoriseTilUser({ ghId, liId, ghAccessToken, liAccessToken });
            let tilUser = authResult.payload;
            if (!tilUser) {
                res.status(200);
                res.json(authResult);
                return;
            }

            const til = (await dbClient.getTils({ _id: tilId }))[0];

            if (!til) {
                res.status(200);
                res.json({ status: statusCodes.ERROR, message: `Article with ID ${tilId} not found`, payload: null });
                return;
            }

            if (tilUser.likedTils && tilUser.likedTils.includes(`${til._id.toString()},`)) {
                res.status(500);
                res.json({ status: statusCodes.ERROR, message: 'Cannot like already liked article', payload: null });
                return;
            }

            const likes = til.likes ? parseInt(til.likes) : 0;

            await dbClient.updateTil({ id: til._id, text: til.text, tag: til.tag, likes: likes + 1 });
            await dbClient.updateUserLikedTils({ id: tilUser._id, likedTils: `${tilUser.likedTils}${til._id.toString()},` });
            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: 'Article has been liked successfully', payload: null });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null });
        }
    });
};

const unlikeTil = app => {
    app.patch('/api/unlikeTil', async (req, res) => {
        const { tilId, ghId, liId, ghAccessToken, liAccessToken } = req.body;
        try {
            if (!tilId) {
                res.status(200);
                res.json({ status: statusCodes.ERROR, message: `Article ID not provided`, payload: null });
                return;
            }

            let authResult = await authoriseTilUser({ ghId, liId, ghAccessToken, liAccessToken });
            let tilUser = authResult.payload;
            if (!tilUser) {
                res.status(200);
                res.json(authResult);
                return;
            }

            const til = (await dbClient.getTils({ _id: tilId }))[0];

            if (!til) {
                res.status(200);
                res.json({ status: statusCodes.ERROR, message: `Article with ID ${tilId} not found`, payload: null });
                return;
            }

            if (!tilUser.likedTils || !tilUser.likedTils.includes(`${til._id.toString()},`)) {
                res.status(500);
                res.json({ status: statusCodes.ERROR, message: 'Cannot unlike not liked article', payload: null });
                return;
            }

            const likes = til.likes ? parseInt(til.likes) : 0;

            await dbClient.updateTil({ id: til._id, text: til.text, tag: til.tag, likes: likes - 1 });
            await dbClient.updateUser({ id: tilUser._id, likedTils: `${tilUser.likedTils.replace(`${til._id.toString()},`, '')}` });
            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: 'Article has been liked successfully', payload: null });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null });
        }
    });
};



module.exports = app => {
    getTils(app);
    saveTil(app);
    deleteTil(app);
    likeTil(app);
    unlikeTil(app);
};