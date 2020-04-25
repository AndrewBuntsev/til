const statusCodes = require('./const/statusCodes');
const dbClient = require('./dbClient');
const fetch = require('node-fetch');
const https = require('https');




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


const ghAuth = app => {
    app.get('/auth/ghAuth', async (req, res) => {
        let { code, access_token } = req.query;

        try {
            if (code) {
                //1. Get access_token from GitHub
                const accessData = await fetch(`https://github.com/login/oauth/access_token?client_id=5c2258cb88831cea80c2&client_secret=b83c19e87b8e9a5f3212715b4f1b4011cdd94ad9&code=${code}`, {
                    method: 'POST',
                    headers: { 'accept': 'application/json' },
                    body: JSON.stringify({})
                }).then(response => response.json());

                access_token = accessData.access_token;
            }

            if (!access_token) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get GitHub access_token`, payload: null });
                return;
            }

            //2. Get a user by access_token
            const ghUser = await fetch('https://api.github.com/user', {
                headers: { Authorization: `token ${access_token}` }
            }).then(response => response.json());

            if (!ghUser) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get GitHub user for the ${access_token} access_token`, payload: null });
                return;
            }

            //3. Check if ghUser retrieved properly
            const { id, name, avatar_url } = ghUser;
            if (!id || !name) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get GitHub user for the ${access_token} access_token`, payload: null });
                return;
            }

            //4. Get associated user data from DB
            let tilUser = await dbClient.getUser({ ghId: id.toString() });
            if (!tilUser) {
                //5. If the user does not exist in DB create it
                tilUser = await dbClient.addUser({ ghId: id.toString() });
            }

            //6. Add ghUser fields to the tilUser and send it back to the client
            tilUser.name = name;
            tilUser.pictureUrl = avatar_url;
            tilUser.access_token = access_token;

            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: '', payload: tilUser });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null })
        }
    });
};


const liAuth = app => {
    app.get('/auth/liAuth', async (req, res) => {
        let { code, access_token } = req.query;

        try {
            if (code) {
                //1. Get access_token from LinkedIn
                const accessData = await fetch(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=https%3A%2F%2Flocalhost:3000%2FliAuth&client_id=86v6z3n8v3ybvo&client_secret=CnRJxkYpJWlCalKz`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(response => response.json());

                access_token = accessData.access_token;
            }

            if (!access_token) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get LinkedIn access_token`, payload: null });
                return;
            }

            //2. Get a user by access_token
            const liUser = await fetch(`https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`, {
                headers: { 'Authorization': `Bearer ${access_token}` }
            }).then(response => response.json());

            if (!liUser) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get LinkedIn user for the ${access_token} access_token`, payload: null });
                return;
            }

            const id = liUser.id;
            const name = liUser.firstName.localized.en_US + ' ' + liUser.lastName.localized.en_US;
            const avatar_url = liUser.profilePicture['displayImage~'].elements[0].identifiers[0].identifier;

            //3. Check if liUser retrieved properly
            if (!id) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get LinkedIn user for the ${access_token} access_token`, payload: null });
                return;
            }
            if (!name) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get LinkedIn user name for the ${id} user_id`, payload: null });
                return;
            }

            //4. Get associated user data from DB
            let tilUser = await dbClient.getUser({ liId: id.toString() });
            if (!tilUser) {
                //5. If the user does not exist in DB create it
                tilUser = await dbClient.addUser({ liId: id.toString() });
            }

            //6. Add liUser fields to the tilUser and send it back to the client
            tilUser.name = name;
            tilUser.pictureUrl = avatar_url;
            tilUser.access_token = access_token;

            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: '', payload: tilUser });
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

    getFBUser(app);


    liAuth(app);
};