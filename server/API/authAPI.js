require('dotenv').config();
const util = require('util');
const AWS = require('aws-sdk');
const statusCodes = require('../const/statusCodes');
const dbClient = require('../db/dbClient');
const fetch = require('node-fetch');
const logger = require('./../logger');
const { WEB_URL, COGNITO_CLIENT_ID } = require('../const/settings');
const { getCognitoUser } = require('../authoriseTilUser');


AWS.config.update({ region: 'ap-southeast-2' });


// const fbAuth = app => {
//     app.get('/auth/fbAuth', async (req, res) => {
//         let { code, access_token } = req.query;

//         try {
//             if (code) {
//                 //1. Get access_token from Facebook
//                 const accessData = await fetch(`https://graph.facebook.com/v6.0/oauth/access_token?client_id=329060394744421&redirect_uri=https%3A%2F%2Flocalhost:3000%2FfbAuth&client_secret=process.env.FACEBOOK_CLIENT_SECRET&code=${code}&grant_type=client_credentials`)
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
                const accessData = await fetch(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`, {
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
            logger.error(err.stack);
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
                const accessData = await fetch(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=${WEB_URL}%2FliAuth&client_id=86v6z3n8v3ybvo&client_secret=${process.env.LINKEDIN_CLIENT_SECRET}`, {
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
            logger.error(err.stack);
            res.json({ status: statusCodes.ERROR, message: err, payload: null })
        }
    });
};


const cogAuth = app => {
    app.get('/auth/cogAuth', async (req, res) => {
        let { code, access_token, refresh_token } = req.query;

        try {
            if (code) {
                //1. Get access_token from Cognito
                const accessData = await fetch(`https://today-i-learned.auth.ap-southeast-2.amazoncognito.com/oauth2/token?grant_type=authorization_code&client_id=${COGNITO_CLIENT_ID}&code=${code}&redirect_uri=${WEB_URL}%2FcogAuth&scope=email+openid+profile+aws.cognito.signin.user.admin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${Buffer.from(COGNITO_CLIENT_ID + ':' + process.env.COGNITO_CLIENT_SECRET).toString('base64')}`
                    }
                }).then(response => response.json());

                access_token = accessData.access_token;
                refresh_token = accessData.refresh_token;
                //const id_token = accessData.id_token;
            }

            if (!access_token) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get Cognito access_token`, payload: null });
                return;
            }

            //2. Get a user by access_token
            const cogUser = await getCognitoUser(access_token, refresh_token);

            if (!cogUser || !cogUser.Username || !cogUser.UserAttributes) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get Cognito user for the ${access_token} access_token`, payload: null });
                return;
            }

            const idAttr = cogUser.UserAttributes.find(att => att.Name == 'sub');
            const id = idAttr && idAttr.Value;
            const nameAttr = cogUser.UserAttributes.find(att => att.Name == 'nickname');
            const name = nameAttr && nameAttr.Value;

            //3. Check if cogUser retrieved properly
            if (!id) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get Cognito user for the ${cogUser.access_token} access_token`, payload: null });
                return;
            }
            if (!name) {
                res.status(200);
                res.json({ status: statusCodes.SUCCESS, message: `Cannot get Cognito user name for the ${id} user_id`, payload: null });
                return;
            }

            //4. Get associated user data from DB
            let tilUser = await dbClient.getUser({ cogId: id.toString() });
            if (!tilUser) {
                //5. If the user does not exist in DB create it
                tilUser = await dbClient.addUser({ cogId: id.toString(), name: name });
            }

            //6. Add access_token & refresh_token to the tilUser
            tilUser.access_token = cogUser.access_token;
            tilUser.refresh_token = refresh_token;

            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: '', payload: tilUser });
        }
        catch (err) {
            res.status(500);
            console.error(err);
            logger.error(err.stack);
            res.json({ status: statusCodes.ERROR, message: err, payload: null })
        }
    });
};



module.exports = app => {
    ghAuth(app);
    liAuth(app);
    cogAuth(app);
};