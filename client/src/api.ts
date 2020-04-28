import { ENDPOINT } from "./const/settings";
import { getGHUserId, getGHAccessToken, getLIUserId, getLIAccessToken } from "./helpers/cookiesHelper";


export const testApi = () => {
    return fetch(`${ENDPOINT}/api/test`).then(res => res.json());
};

export const getTils = () => {
    return fetch(`${ENDPOINT}/api/getTils`).then(res => res.json());
};

export const addTil = (text: string) => {
    const ghId = getGHUserId();
    const ghAccessToken = getGHAccessToken();
    const liId = getLIUserId();
    const liAccessToken = getLIAccessToken();

    return fetch(`${ENDPOINT}/api/addTil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, ghId, ghAccessToken, liId, liAccessToken })
    }).then(res => res.json());
};



export const ghAuth = (options: { code?: string, access_token?: string }) => {
    const code = options.code ? options.code : '';
    const access_token = options.access_token ? options.access_token : '';
    return fetch(`${ENDPOINT}/auth/ghAuth?code=${code}&access_token=${access_token}`).then(res => res.json());
};

export const liAuth = (options: { code?: string, access_token?: string }) => {
    const code = options.code ? options.code : '';
    const access_token = options.access_token ? options.access_token : '';
    return fetch(`${ENDPOINT}/auth/liAuth?code=${code}&access_token=${access_token}`).then(res => res.json());
};
