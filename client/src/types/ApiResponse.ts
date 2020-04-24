import { ResponseStatus } from "../enums/ResponseStatus";

export type ApiResponse = {
    status: ResponseStatus;
    message: string;
    payload: object;
};