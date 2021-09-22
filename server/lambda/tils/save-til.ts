import { APIGatewayEvent, Context } from 'aws-lambda';
import { createErrorResponse, createSuccessResponse, } from '../../utils/api-gateway-response';
import * as dbClient from '../../db/dbClient';
import { authoriseTilUser } from '../../utils/authoriseTilUser';

export async function saveTil(event: APIGatewayEvent, context: Context) {
    // allow just 'PUT' requests
    if (event.httpMethod !== 'POST') {
        return createErrorResponse(405, `Unsupported method "${event.httpMethod}"`);
    };
   
    try {
        const { text, tag, tilId, ghId, liId, cogId, ghAccessToken, liAccessToken, cogAccessToken, cogRefreshToken } = JSON.parse(event.body);

        let authResult = await authoriseTilUser({ ghId, liId, cogId, ghAccessToken, liAccessToken, cogAccessToken, cogRefreshToken });
        let tilUser = authResult.payload;
        if (!tilUser) {
            return createErrorResponse(500, authResult);
        }

        if (tilId) {
            // try to update the til
            const til = (await dbClient.getTils({ id: tilId }))[0];
            if (til) {
                if (tilUser.id.toString() != til.userId.toString()) {
                    console.log(tilUser.id);
                    console.log(til.userId);
                    return createErrorResponse(500, 'Not enough permissions to edit the article');
                }

                await dbClient.updateTil({ text, tag, id: til.id });
                return createSuccessResponse(null);
            }
        }

        await dbClient.addTil({ text, tag, userId: tilUser.id, userName: tilUser.name });
        
        return createSuccessResponse(null);
    } catch (err) {
        console.error('error: ', err);
        return createErrorResponse(500, err.message);
    }
}

