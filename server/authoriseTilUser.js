const util = require('util');
const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const statusCodes = require('./const/statusCodes');
const dbClient = require('./db/dbClient');
const logger = require('./logger');
const { COGNITO_CLIENT_ID } = require('./const/settings');


exports.authoriseTilUser = async function (options) {
    const { ghId, liId, cogId, ghAccessToken, liAccessToken, cogAccessToken, cogRefreshToken } = options;

    let tilUser = null;

    if (ghId && ghAccessToken) {
        // authorize against GitHub
        const ghUser = await fetch('https://api.github.com/user', {
            headers: { Authorization: `token ${ghAccessToken}` }
        }).then(response => response.json());

        if (!ghUser) {
            return { status: statusCodes.SUCCESS, message: `Cannot get GitHub user for the ${ghAccessToken} access_token`, payload: null };
        }

        const { id } = ghUser;
        if (!id) {
            return { status: statusCodes.SUCCESS, message: `Cannot get GitHub user for the ${ghAccessToken} access_token`, payload: null };
        }

        if (id != ghId) {
            return { status: statusCodes.SUCCESS, message: `GitHub ${ghAccessToken} access_token is expired`, payload: null };
        }

        tilUser = await dbClient.getUser({ ghId: ghId });
        if (!tilUser) {
            return { status: statusCodes.SUCCESS, message: `Cannot find a user with ghId: ${ghId}`, payload: null };
        }
    } else if (liId && liAccessToken) {
        // authorize against LinkedIn
        const liUser = await fetch(`https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`, {
            headers: { 'Authorization': `Bearer ${liAccessToken}` }
        }).then(response => response.json());

        if (!liUser) {
            return { status: statusCodes.SUCCESS, message: `Cannot get LinkedIn user for the ${liAccessToken} access_token`, payload: null };
        }

        if (liUser.id != liId) {
            res.status(200);
            return { status: statusCodes.SUCCESS, message: `LinkedIn ${liAccessToken} access_token is expired`, payload: null };
        }

        tilUser = await dbClient.getUser({ liId: liId });
        if (!tilUser) {
            return { status: statusCodes.SUCCESS, message: `Cannot find a user with liId: ${liId}`, payload: null };
        }
    } else if (cogId && cogAccessToken && cogRefreshToken) {
        const cogUser = await getCognitoUser(cogAccessToken, cogRefreshToken);

        if (!cogUser || !cogUser.Username || !cogUser.UserAttributes) {
            res.status(200);
            res.json({ status: statusCodes.SUCCESS, message: `Cannot get Cognito user for the ${cogAccessToken} access_token`, payload: null });
            return;
        }

        const idAttr = cogUser.UserAttributes.find(att => att.Name == 'sub');
        const id = idAttr && idAttr.Value;

        if (id != cogId) {
            res.status(200);
            return { status: statusCodes.SUCCESS, message: `Cognito ${cogAccessToken} access_token is expired`, payload: null };
        }

        tilUser = await dbClient.getUser({ cogId: cogId });
        if (!tilUser) {
            return { status: statusCodes.SUCCESS, message: `Cannot find a user with cogId: ${cogId}`, payload: null };
        }
    }

    if (!tilUser) {
        return { status: statusCodes.SUCCESS, message: `Cannot find a user. Parameters are incorrect`, payload: null };
    }

    return { status: statusCodes.SUCCESS, message: '', payload: tilUser };
};


async function getCognitoUser(cogAccessToken, cogRefreshToken) {
    // authorize against Cognito
    const cognitoService = new AWS.CognitoIdentityServiceProvider();
    const getUser = util.promisify(cognitoService.getUser).bind(cognitoService);
    let cogUser;
    try {
        cogUser = await getUser({ AccessToken: cogAccessToken });
        cogUser.access_token = cogAccessToken;
    } catch (err) {
        // access_token is expired, refresh it
        const access_token = await refreshCognitoAccessToken(cogRefreshToken);
        try {
            cogUser = await getUser({ AccessToken: access_token });
            cogUser.access_token = access_token;
        } catch (err) {
            logger.error('Cannot get Cognito User after the Access Token has been refreshed');
            throw err;
        }
    }

    return cogUser;
};

exports.getCognitoUser = getCognitoUser;


async function refreshCognitoAccessToken(refresh_token) {
    logger.info('A user Access Token is about to refresh');
    console.log('A user Access Token is about to refresh');

    // access_token is expired, refresh it
    const refreshedAccessData = await fetch("https://cognito-idp.ap-southeast-2.amazonaws.com/", {
        headers: {
            "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
            "Content-Type": "application/x-amz-json-1.1",
        },
        mode: 'cors',
        cache: 'no-cache',
        method: 'POST',
        body: JSON.stringify({
            ClientId: COGNITO_CLIENT_ID,
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            AuthParameters: {
                REFRESH_TOKEN: refresh_token,
                SECRET_HASH: process.env.COGNITO_CLIENT_SECRET,
            }
        }),
    }).then(res => res.json());

    logger.info('Access Token has been refreshed');
    console.log('Access Token has been refreshed');
    return refreshedAccessData.AuthenticationResult.AccessToken;
};
