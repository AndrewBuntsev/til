import { APIGatewayEvent, Context } from 'aws-lambda';
import { createErrorResponse, HttpResponse } from '../../utils/api-gateway-response';
import * as dbClient from '../../db/dbClient';

export async function getTags(event: APIGatewayEvent, context: Context) {
    // allow just 'GET' requests
    if (event.httpMethod !== 'GET') {
        return new HttpResponse(405, { message: `Unsupported method "${event.httpMethod}"` })
    };
    
    try {
        const tags = await dbClient.getTags();
        return new HttpResponse(200, { status: 'SUCCESS', message: '', payload: tags });
    } catch (err) {
        console.error('error: ', err);
        return createErrorResponse(500, err.message);
    }
}