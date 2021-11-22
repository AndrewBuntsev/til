import { APIGatewayEvent, Context } from 'aws-lambda';
import { createErrorResponse, createSuccessResponse } from '../../utils/api-gateway-response';
import * as dbClient from '../../db/dbClient';

export async function getStatistics(event: APIGatewayEvent, context: Context) {
    // allow just 'GET' requests
    if (event.httpMethod !== 'GET') {
        return createErrorResponse(405, `Unsupported method "${event.httpMethod}"`);
    };
    
    try {
        const statistics = await dbClient.getStatistics();
        return createSuccessResponse(statistics);
    } catch (err) {
        console.error('error: ', err);
        return createErrorResponse(500, err.message);
    }
}