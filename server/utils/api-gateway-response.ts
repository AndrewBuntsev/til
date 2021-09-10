export class HttpResponse {
    public body: any;
    public headers: {[header: string]: string} = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    constructor (public statusCode: number, body: any) {
        
        this.body = body
            ? JSON.stringify(body)
            : null;
    }
}

export function createErrorResponse(code: number, message: string): HttpResponse {
    return new HttpResponse(code, {
        code,
        message
    });
}