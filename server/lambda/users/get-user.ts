import { APIGatewayEvent, Context } from 'aws-lambda';
import { createErrorResponse, createSuccessResponse, HttpResponse } from '../../utils/api-gateway-response';
import * as dbClient from '../../db/dbClient';

export async function getUser(event: APIGatewayEvent, context: Context) {
    // allow just 'GET' requests
    if (event.httpMethod !== 'GET') {
        return createErrorResponse(405, `Unsupported method "${event.httpMethod}"`);
    };
    
    try {
        const { id } = event.queryStringParameters;
        const user = await dbClient.getUserData({ id });
        return createSuccessResponse(user);
    } catch (err) {
        console.error('error: ', err);
        return createErrorResponse(500, err.message);
    }
}