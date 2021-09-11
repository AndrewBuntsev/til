import { APIGatewayEvent, Context } from 'aws-lambda';
import fetch from 'node-fetch'; 
import { createErrorResponse, createSuccessResponse } from '../../utils/api-gateway-response';
import * as dbClient from '../../db/dbClient';
import { getCognitoUser } from '../../utils/authoriseTilUser';

export async function getUser(event: APIGatewayEvent, context: Context) {
    // allow just 'GET' requests
    if (event.httpMethod !== 'GET') {
        return createErrorResponse(405, `Unsupported method "${event.httpMethod}"`);
    };
    
    let { code, access_token, refresh_token } = event.queryStringParameters;

    try {
        if (code) {
            //1. Get access_token from Cognito
            const accessData = await fetch(`https://today-i-learned.auth.ap-southeast-2.amazoncognito.com/oauth2/token?grant_type=authorization_code&client_id=${process.env.COGNITO_CLIENT_ID}&code=${code}&redirect_uri=${process.env.WEB_URL}%2FcogAuth&scope=email+openid+profile+aws.cognito.signin.user.admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(process.env.COGNITO_CLIENT_ID + ':' + process.env.COGNITO_CLIENT_SECRET).toString('base64')}`
                }
            }).then(response => response.json());
            console.log('accessData = ', accessData)

            access_token = accessData.access_token;
            refresh_token = accessData.refresh_token;
        }

        if (!access_token) {
            return createErrorResponse(500, 'Cannot get Cognito access_token');
        }

        //2. Get a user by access_token
        const cogUser = await getCognitoUser(access_token, refresh_token);

        if (!cogUser || !cogUser.Username || !cogUser.UserAttributes) {
            return createErrorResponse(500, `Cannot get Cognito user for the ${access_token} access_token`);
        }

        const idAttr = cogUser.UserAttributes.find(att => att.Name == 'sub');
        const id = idAttr && idAttr.Value;
        const nameAttr = cogUser.UserAttributes.find(att => att.Name == 'nickname');
        const name = nameAttr && nameAttr.Value;

        //3. Check if cogUser retrieved properly
        if (!id) {
            return createErrorResponse(500, `Cannot get Cognito user for the ${cogUser.access_token} access_token`);
        }
        if (!name) {
            return createErrorResponse(500, `Cannot get Cognito user name for the ${id} user_id`);
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

        return createSuccessResponse(tilUser);
    } catch (err) {
        console.error('error: ', err);
        return createErrorResponse(500, err.message);
    }
}