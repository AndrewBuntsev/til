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
            //1. Get access_token from LinkedIn
            const accessData = await fetch(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=${process.env.WEB_URL}%2FliAuth&client_id=${process.env.LINKEDIN_CLIENT_ID}&client_secret=${process.env.LINKEDIN_CLIENT_SECRET}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(response => response.json());

            access_token = accessData.access_token;
        }

        if (!access_token) {
            return createErrorResponse(500, 'Cannot get LinkedIn access_token');
        }

        //2. Get a user by access_token
        const liUser = await fetch(`https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        }).then(response => response.json());

        if (!liUser) {
            return createErrorResponse(500, `Cannot get LinkedIn user for the ${access_token} access_token`);
        }

        const id = liUser.id;
        const name = liUser.firstName.localized.en_US + ' ' + liUser.lastName.localized.en_US;
        const avatar_url = liUser.profilePicture['displayImage~'].elements[0].identifiers[0].identifier;

        //3. Check if liUser retrieved properly
        if (!id) {
            return createErrorResponse(500, `Cannot get LinkedIn user for the ${access_token} access_token`);
        }
        if (!name) {
            return createErrorResponse(500, `Cannot get LinkedIn user name for the ${id} user_id`);
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

        return createSuccessResponse(tilUser);
    } catch (err) {
        console.error('error: ', err);
        return createErrorResponse(500, err.message);
    }
}