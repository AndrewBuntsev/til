import { APIGatewayEvent, Context } from 'aws-lambda';
import { createErrorResponse, createSuccessResponse, } from '../../utils/api-gateway-response';
import * as dbClient from '../../db/dbClient';
import { authoriseTilUser } from '../../utils/authoriseTilUser';

export async function likeTil(event: APIGatewayEvent, context: Context) {
    // allow just 'PUT' requests
    if (event.httpMethod !== 'PUT') {
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

        console.log('tilUser = ', tilUser)

        if (tilUser.likedTils && tilUser.likedTils.includes(`,${tilId},`)) {
            return createErrorResponse(500, 'Cannot like already liked article');
        }

        await dbClient.likeTil({ tilId, userId: tilUser.id });

        return createSuccessResponse(null);
    } catch (err) {
        console.error('error: ', err);
        return createErrorResponse(500, err.message);
    }
}

