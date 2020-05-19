const statusCodes = require('./const/statusCodes');
const dbClient = require('./db/dbClient');
const fetch = require('node-fetch');

exports.authoriseTilUser = async function (options) {
    const { ghId, liId, ghAccessToken, liAccessToken } = options;

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
            return { status: statusCodes.SUCCESS, message: `GitHub ${liAccessToken} access_token is expired`, payload: null };
        }

        tilUser = await dbClient.getUser({ liId: liId });
        if (!tilUser) {
            return { status: statusCodes.SUCCESS, message: `Cannot find a user with liId: ${liId}`, payload: null };
        }
    }

    if (!tilUser) {
        return { status: statusCodes.SUCCESS, message: `Cannot find a user. Parameters are incorrect`, payload: null };
    }

    return { status: statusCodes.SUCCESS, message: '', payload: tilUser };
}
