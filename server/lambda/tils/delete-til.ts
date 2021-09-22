import { APIGatewayEvent, Context } from 'aws-lambda';
import { createErrorResponse, createSuccessResponse, } from '../../utils/api-gateway-response';
import * as dbClient from '../../db/dbClient';
import { authoriseTilUser } from '../../utils/authoriseTilUser';

export async function deleteTil(event: APIGatewayEvent, context: Context) {
    // allow just 'PUT' requests
    if (event.httpMethod !== 'DELETE') {
        return createErrorResponse(405, `Unsupported method "${event.httpMethod}"`);
    };
   
    try {
        const { tilId, ghId, liId, cogId, ghAccessToken, liAccessToken, cogAccessToken, cogRefreshToken } = JSON.parse(event.body);

        if (!tilId) {
            return createErrorResponse(500, `Article ID not provided`);
        }

        let authResult = await authoriseTilUser({ ghId, liId, cogId, ghAccessToken, liAccessToken, cogAccessToken, cogRefreshToken });
        let tilUser = authResult.payload;
        if (!tilUser) {
            return createErrorResponse(500, authResult);
        }

        const til = (await dbClient.getTils({ id: tilId }))[0];

        if (!til) {
            return createErrorResponse(500, `Article with ID ${tilId} not found`);
        }

        if (tilUser.id.toString() != til.userId.toString()) {
            return createErrorResponse(500, 'Not enough permissions to delete the article');
        }

        await dbClient.deleteTil({ id: til.id });
                
        return createSuccessResponse(null);
    } catch (err) {
        console.error('error: ', err);
        return createErrorResponse(500, err.message);
    }
}

