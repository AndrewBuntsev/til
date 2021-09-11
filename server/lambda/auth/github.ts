import { APIGatewayEvent, Context } from 'aws-lambda';
import fetch from 'node-fetch'; 
import { createErrorResponse, createSuccessResponse } from '../../utils/api-gateway-response';
import * as dbClient from '../../db/dbClient';

export async function getUser(event: APIGatewayEvent, context: Context) {
    // allow just 'GET' requests
    if (event.httpMethod !== 'GET') {
        return createErrorResponse(405, `Unsupported method "${event.httpMethod}"`);
    };
    
    let { code, access_token } = event.queryStringParameters;

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
            return createErrorResponse(500, 'Cannot get GitHub access_token');
        }

        //2. Get a user by access_token
        const ghUser = await fetch('https://api.github.com/user', {
            headers: { Authorization: `token ${access_token}` }
        }).then(response => response.json());

        if (!ghUser) {
            return createErrorResponse(500, `Cannot get GitHub user for the ${access_token} access_token`);
        }

        //3. Check if ghUser retrieved properly
        let { id, name, login, avatar_url } = ghUser;
        if (!name) name = login;
        if (!id || !name) {
            return createErrorResponse(500, `Cannot get correct GitHub user for the ${access_token} access_token`);
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

        return createSuccessResponse(tilUser);
    } catch (err) {
        console.error('error: ', err);
        return createErrorResponse(500, err.message);
    }
}