import { ResponseStatus } from "../enums/ResponseStatus";

export type Response = {
    status: ResponseStatus;
    message: string;
    payload: object;
};