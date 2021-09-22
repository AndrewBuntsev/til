import { ResponseStatus } from "../const/statusCodes";

export class HttpResponse {
    public body: any;
    public headers: any = {
        'Access-Control-Allow-Headers' : 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,PUT,PATCH,DELETE,GET',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    constructor (public statusCode: number, message: string, body: any, status: ResponseStatus) {
        this.body = JSON.stringify({ status, message, payload: body });
    }
}

export function createSuccessResponse(payload: any): HttpResponse {
    return new HttpResponse(200, '', payload, ResponseStatus.SUCCESS);
}

export function createErrorResponse(code: number, message: string): HttpResponse {
    console.error(message);
    return new HttpResponse(code, message, null, ResponseStatus.ERROR);
}