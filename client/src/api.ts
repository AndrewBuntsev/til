import { ENDPOINT } from "./const/settings";
import { getGHUserId, getGHAccessToken, getLIUserId, getLIAccessToken } from "./helpers/cookiesHelper";


export const testApi = () => {
    return fetch(`${ENDPOINT}/api/test`).then(res => res.json());
};

export const getTils = (options?: { _id?: string, author?: string, date?: string, tag?: string, searchTerm?: string, random?: string }) => {
    const _id = options && options._id ? options._id : '';
    const author = options && options.author ? options.author : '';
    const date = options && options.date ? options.date : '';
    const tag = options && options.tag ? options.tag : '';
    const searchTerm = options && options.searchTerm ? options.searchTerm : '';
    const random = options && options.random ? options.random : '';

    const query = `${ENDPOINT}/api/getTils?_id=${_id}&author=${author}&date=${date}&tag=${tag}&searchTerm=${searchTerm}&random=${random}`;

    return fetch(query).then(res => res.json());
};

export const saveTil = (text: string, tag: string, tilId?: string) => {
    const ghId = getGHUserId();
    const ghAccessToken = getGHAccessToken();
    const liId = getLIUserId();
    const liAccessToken = getLIAccessToken();

    return fetch(`${ENDPOINT}/api/saveTil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tag, tilId, ghId, ghAccessToken, liId, liAccessToken })
    }).then(res => res.json());
};

export const deleteTil = (tilId?: string) => {
    const ghId = getGHUserId();
    const ghAccessToken = getGHAccessToken();
    const liId = getLIUserId();
    const liAccessToken = getLIAccessToken();

    return fetch(`${ENDPOINT}/api/deleteTil`, {
        method: 'DELETE',
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



export const getTags = () => {
    return fetch(`${ENDPOINT}/api/getTags`).then(res => res.json());
};

export const addTag = (tag: string) => {
    const ghId = getGHUserId();
    const ghAccessToken = getGHAccessToken();
    const liId = getLIUserId();
    const liAccessToken = getLIAccessToken();

    return fetch(`${ENDPOINT}/api/addTag`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag, ghId, ghAccessToken, liId, liAccessToken })
    }).then(res => res.json());
};