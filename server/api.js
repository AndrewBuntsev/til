const statusCodes = require('./const/statusCodes');
const dbClient = require('./dbClient');
const fetch = require('node-fetch');




const testApi = app => {
    app.get('/api/test', (req, res) => {
        console.log('Accepted request');
        res.status(200);
        res.json({ status: statusCodes.SUCCESS, message: '', payload: { hey: 'hello' } });
    });
};


const getUser = app => {
    app.get('/api/getUser', async (req, res) => {
        const { fbId, ghId } = req.query;
        try {
            const user = await dbClient.getUser({ fbId, ghId });
            if (user) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: '', payload: user });
            } else {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `User with fbId ${fbId} and ghId ${ghId} not found`, payload: null });
            }
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null })
        }
    });
};

const addUser = app => {
    app.post('/api/addUser', async (req, res) => {
        const { fbId, ghId } = req.body;
        try {
            const user = await dbClient.addUser({ fbId, ghId });
            res.json({ status: statusCodes.SUCCESS, message: 'User has been created successfully', payload: user });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null });
        }
    });
};

const getTils = app => {
    app.get('/api/getTils', async (req, res) => {
        try {
            const tils = await dbClient.getTils({});
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

const addTil = app => {
    app.post('/api/addTil', async (req, res) => {
        const { header, text, user } = req.body;
        try {
            await dbClient.addTil({ header, text, user });
            res.json({ status: statusCodes.SUCCESS, message: 'TIL has been added successfully', payload: null });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null });
        }
    });
};






const ghAuth = app => {
    app.get('/api/ghAuth', async (req, res) => {
        const { code } = req.query;

        try {
            //1. Get access_code from GitHub
            const accessData = await fetch(`https://github.com/login/oauth/access_token?client_id=5c2258cb88831cea80c2&client_secret=b83c19e87b8e9a5f3212715b4f1b4011cdd94ad9&code=${code}`, {
                method: 'POST',
                headers: { 'accept': 'application/json' },
                body: JSON.stringify({})
            }).then(response => response.json());
            const access_token = accessData.access_token;
            if (!access_token) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get GitHub access_token for the ${code} request code`, payload: null });
                return;
            }

            //2. Get a user by access_token
            const user = await fetch('https://api.github.com/user', {
                headers: { Authorization: `token ${access_token}` }
            }).then(response => response.json());

            //3. Send the user data back to the client
            if (user) {
                const { id, avatar_url, url, name } = user;
                const payload = { id, avatar_url, url, name, access_token };
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: '', payload: payload });
            } else {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get GitHub user for the ${code} request code`, payload: null });
            }
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null })
        }
    });
};

const getGHUser = app => {
    app.get('/api/getGHUser', async (req, res) => {
        const { access_token } = req.query;
        try {
            const user = await fetch('https://api.github.com/user', {
                headers: { Authorization: `token ${access_token}` }
            }).then(response => response.json());

            if (user) {
                const { id, avatar_url, url, name } = user;
                const payload = { id, avatar_url, url, name, access_token };
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: '', payload: payload });
            } else {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get GitHub user for the ${access_token} access_token`, payload: null });
            }
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null })
        }
    });
};


const getFBUser = app => {
    app.get('/api/getFBUser', async (req, res) => {
        const { user_id, access_token } = req.query;
        console.log(JSON.stringify(req.cookies));

        try {
            const user = await fetch(`https://graph.facebook.com/${user_id}?fields=name,picture&access_token=${access_token}`)
                .then(response => response.json());

            if (user) {
                const { name, picture } = user;
                const avatar_url = picture && picture.data ? picture.data.url : '';
                const payload = { name, avatar_url };
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: '', payload: payload });
            } else {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get Facebook user for the ${user_id} user_id & ${access_token} access_token`, payload: null });
            }
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null })
        }
    });
};


module.exports = app => {
    testApi(app);
    getUser(app);
    addUser(app);
    getTils(app);
    addTil(app);
    ghAuth(app);
    getGHUser(app);
    getFBUser(app);
};