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
        const { text, tilId, ghId, liId, ghAccessToken, liAccessToken } = req.body;
        try {
            let tilUser = null;

            if (ghId && ghAccessToken) {
                // authorize against GitHub
                const ghUser = await fetch('https://api.github.com/user', {
                    headers: { Authorization: `token ${ghAccessToken}` }
                }).then(response => response.json());

                if (!ghUser) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `Cannot get GitHub user for the ${ghAccessToken} access_token`, payload: null });
                    return;
                }

                const { id } = ghUser;
                if (!id) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `Cannot get GitHub user for the ${ghAccessToken} access_token`, payload: null });
                    return;
                }

                if (id != ghId) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `GitHub ${ghAccessToken} access_token is expired`, payload: null });
                    return;
                }

                tilUser = await dbClient.getUser({ ghId: ghId });
                if (!tilUser) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `Cannot find a user with ghId: ${ghId}`, payload: null });
                    return;
                }
            } else if (liId && liAccessToken) {
                // authorize against LinkedIn
                const liUser = await fetch(`https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`, {
                    headers: { 'Authorization': `Bearer ${liAccessToken}` }
                }).then(response => response.json());

                if (!liUser) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `Cannot get LinkedIn user for the ${liAccessToken} access_token`, payload: null });
                    return;
                }

                if (liUser.id != liId) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `GitHub ${liAccessToken} access_token is expired`, payload: null });
                    return;
                }

                tilUser = await dbClient.getUser({ liId: liId });
                if (!tilUser) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `Cannot find a user with liId: ${liId}`, payload: null });
                    return;
                }
            }

            if (!tilUser) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot find a user. Parameters are incorrect`, payload: null });
                return;
            }

            if (tilId) {
                // try to update the til
                const til = await dbClient.getTil(tilId);
                if (til) {
                    if (tilUser._id.toString() != til.userId.toString()) {
                        res.status(500);
                        console.log(tilUser._id);
                        console.log(til.userId);
                        res.json({ status: statusCodes.ERROR, message: 'Not enough permissions to edit the article', payload: null });
                        return;
                    }

                    await dbClient.updateTil({ text, id: til._id });
                    res.json({ status: statusCodes.SUCCESS, message: 'Article has been updated successfully', payload: null });
                    return;
                }
            }

            await dbClient.addTil({ text, userId: tilUser._id, userName: tilUser.name });
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
    app.post('/api/deleteTil', async (req, res) => {
        const { tilId, ghId, liId, ghAccessToken, liAccessToken } = req.body;
        try {
            if (!tilId) {
                res.status(200);
                res.json({ status: statusCodes.ERROR, message: `Article ID not provided`, payload: null });
                return;
            }

            let tilUser = null;

            if (ghId && ghAccessToken) {
                // authorize against GitHub
                const ghUser = await fetch('https://api.github.com/user', {
                    headers: { Authorization: `token ${ghAccessToken}` }
                }).then(response => response.json());

                if (!ghUser) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `Cannot get GitHub user for the ${ghAccessToken} access_token`, payload: null });
                    return;
                }

                const { id } = ghUser;
                if (!id) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `Cannot get GitHub user for the ${ghAccessToken} access_token`, payload: null });
                    return;
                }

                if (id != ghId) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `GitHub ${ghAccessToken} access_token is expired`, payload: null });
                    return;
                }

                tilUser = await dbClient.getUser({ ghId: ghId });
                if (!tilUser) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `Cannot find a user with ghId: ${ghId}`, payload: null });
                    return;
                }
            } else if (liId && liAccessToken) {
                // authorize against LinkedIn
                const liUser = await fetch(`https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`, {
                    headers: { 'Authorization': `Bearer ${liAccessToken}` }
                }).then(response => response.json());

                if (!liUser) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `Cannot get LinkedIn user for the ${liAccessToken} access_token`, payload: null });
                    return;
                }

                if (liUser.id != liId) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `GitHub ${liAccessToken} access_token is expired`, payload: null });
                    return;
                }

                tilUser = await dbClient.getUser({ liId: liId });
                if (!tilUser) {
                    res.status(200);
                    res.json({ status: statusCodes.SUCCESS, message: `Cannot find a user with liId: ${liId}`, payload: null });
                    return;
                }
            }

            if (!tilUser) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot find a user. Parameters are incorrect`, payload: null });
                return;
            }

            const til = await dbClient.getTil(tilId);
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
            res.json({ status: statusCodes.SUCCESS, message: 'Article has been deleted successfully', payload: null });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            res.json({ status: statusCodes.ERROR, message: err, payload: null });
        }
    });
};

// const fbAuth = app => {
//     app.get('/auth/fbAuth', async (req, res) => {
//         let { code, access_token } = req.query;

//         try {
//             if (code) {
//                 //1. Get access_token from Facebook
//                 const accessData = await fetch(`https://graph.facebook.com/v6.0/oauth/access_token?client_id=329060394744421&redirect_uri=https%3A%2F%2Flocalhost:3000%2FfbAuth&client_secret=ec9f44ad02f336f12a8fcb4df4d61f6b&code=${code}&grant_type=client_credentials`)
//                     .then(response => response.json());

//                 console.log(accessData);
//                 access_token = accessData.access_token;
//             }

//             if (!access_token) {
//                 res.status(200);
//                 res.json({ status: statusCodes.SUCCESS, message: `Cannot get Facebook access_token`, payload: null });
//                 return;
//             }

//             //2. Get a user by access_token
//             const fbUser = await fetch(`https://graph.facebook.com/v6.0/me?fields=name&access_token=${access_token}`, {
//                 headers: { 'Authorization': `Bearer ${access_token}` }
//             }).then(response => response.json());

//             console.log(fbUser);
//             // if (!liUser) {
//             //     res.status(200);
//             //     res.json({ status: statusCodes.SUCCESS, message: `Cannot get LinkedIn user for the ${access_token} access_token`, payload: null });
//             //     return;
//             // }

//             // const id = liUser.id;
//             // const name = liUser.firstName.localized.en_US + ' ' + liUser.lastName.localized.en_US;
//             // const avatar_url = liUser.profilePicture['displayImage~'].elements[0].identifiers[0].identifier;

//             // //3. Check if liUser retrieved properly
//             // if (!id) {
//             //     res.status(200);
//             //     res.json({ status: statusCodes.SUCCESS, message: `Cannot get LinkedIn user for the ${access_token} access_token`, payload: null });
//             //     return;
//             // }
//             // if (!name) {
//             //     res.status(200);
//             //     res.json({ status: statusCodes.SUCCESS, message: `Cannot get LinkedIn user name for the ${id} user_id`, payload: null });
//             //     return;
//             // }

//             // //4. Get associated user data from DB
//             // let tilUser = await dbClient.getUser({ liId: id.toString() });
//             // if (!tilUser) {
//             //     //5. If the user does not exist in DB create it
//             //     tilUser = await dbClient.addUser({ liId: id.toString() });
//             // }

//             // //6. Add liUser fields to the tilUser and send it back to the client
//             // tilUser.name = name;
//             // tilUser.pictureUrl = avatar_url;
//             // tilUser.access_token = access_token;

//             // res.status(200);
//             // res.json({ status: statusCodes.SUCCESS, message: '', payload: tilUser });
//         }
//         catch (err) {
//             res.status(500);
//             console.error(err);
//             res.json({ status: statusCodes.ERROR, message: err, payload: null })
//         }
//     });
// };

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
            let { id, name, login, avatar_url } = ghUser;
            if (!name) name = login;
            if (!id || !name) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get correct GitHub user for the ${access_token} access_token`, payload: null });
                return;
            }

            //4. Get associated user data from DB
            let tilUser = await dbClient.getUser({ ghId: id.toString() });
            if (!tilUser) {
                //5. If the user does not exist in DB create it
                tilUser = await dbClient.addUser({ ghId: id.toString(), name: name });
            }

            //6. Add ghUser fields to the tilUser and send it back to the client
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
                tilUser = await dbClient.addUser({ liId: id.toString(), name: name });
            }

            //6. Add liUser fields to the tilUser and send it back to the client
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

    getTils(app);
    saveTil(app);
    deleteTil(app);

    ghAuth(app);
    liAuth(app);
};