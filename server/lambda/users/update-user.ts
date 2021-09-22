import { APIGatewayEvent, Context } from 'aws-lambda';
import { createErrorResponse, createSuccessResponse, } from '../../utils/api-gateway-response';
import * as dbClient from '../../db/dbClient';
import { authoriseTilUser } from '../../utils/authoriseTilUser';

export async function updateUser(event: APIGatewayEvent, context: Context) {
    // allow just 'PUT' requests
    if (event.httpMethod !== 'PUT') {
        return createErrorResponse(405, `Unsupported method "${event.httpMethod}"`);
    };

   
    try {
        const { ghId, liId, cogId, ghAccessToken, liAccessToken, cogAccessToken, cogRefreshToken, twUrl, liUrl, fbUrl, wUrl } = JSON.parse(event.body);

        let authResult = await authoriseTilUser({ ghId, liId, cogId, ghAccessToken, liAccessToken, cogAccessToken, cogRefreshToken });
        let tilUser = authResult.payload;
        if (!tilUser) {
            return createErrorResponse(500, authResult);
        }

        await dbClient.updateUser({ id: tilUser.id, twUrl, liUrl, fbUrl, wUrl });
                    
        return createSuccessResponse(null);
    } catch (err) {
        console.error('error: ', err);
        return createErrorResponse(500, err.message);
    }
}

