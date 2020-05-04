import { ENDPOINT } from "./const/settings";
import { getGHUserId, getGHAccessToken, getLIUserId, getLIAccessToken } from "./helpers/cookiesHelper";


export const testApi = () => {
    return fetch(`${ENDPOINT}/api/test`).then(res => res.json());
};

export const getTils = (options?: { _id?: string, author?: string, post?: string, date?: string }) => {
    const _id = options && options._id ? options._id : '';
    const author = options && options.author ? options.author : '';
    const post = options && options.post ? options.post : '';
    const date = options && options.date ? options.date : '';

    return fetch(`${ENDPOINT}/api/getTils?_id=${_id}&author=${author}&post=${post}&date=${date}`).then(res => res.json());
};

export const saveTil = (text: string, tilId?: string) => {
    const ghId = getGHUserId();
    const ghAccessToken = getGHAccessToken();
    const liId = getLIUserId();
    const liAccessToken = getLIAccessToken();

    return fetch(`${ENDPOINT}/api/saveTil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tilId, ghId, ghAccessToken, liId, liAccessToken })
    }).then(res => res.json());
};

export const deleteTil = (tilId?: string) => {
    const ghId = getGHUserId();
    const ghAccessToken = getGHAccessToken();
    const liId = getLIUserId();
    const liAccessToken = getLIAccessToken();

    return fetch(`${ENDPOINT}/api/deleteTil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tilId, ghId, ghAccessToken, liId, liAccessToken })
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
