import { ENDPOINT } from "./const/settings";
import { getGHUserId, getGHAccessToken, getLIUserId, getLIAccessToken } from "./helpers/cookiesHelper";


export const testApi = () => {
    return fetch(`${ENDPOINT}/api/test`).then(res => res.json());
};

export const getTils = (options?: { id?: string, author?: string, likedBy?: string, date?: string, tag?: string, searchTerm?: string, random?: string }) => {
    const id = options && options.id ? options.id : '';
    const author = options && options.author ? options.author : '';
    const likedBy = options && options.likedBy ? options.likedBy : '';
    const date = options && options.date ? options.date : '';
    const tag = options && options.tag ? options.tag : '';
    const searchTerm = options && options.searchTerm ? options.searchTerm : '';
    const random = options && options.random ? options.random : '';

    const query = `${ENDPOINT}/api/getTils?id=${id}&author=${author}&likedBy=${likedBy}&date=${date}&tag=${tag}&searchTerm=${searchTerm}&random=${random}`;

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

export const likeTil = (tilId?: string) => {
    const ghId = getGHUserId();
    const ghAccessToken = getGHAccessToken();
    const liId = getLIUserId();
    const liAccessToken = getLIAccessToken();

    return fetch(`${ENDPOINT}/api/likeTil`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tilId, ghId, ghAccessToken, liId, liAccessToken })
    }).then(res => res.json());
};

export const unlikeTil = (tilId?: string) => {
    const ghId = getGHUserId();
    const ghAccessToken = getGHAccessToken();
    const liId = getLIUserId();
    const liAccessToken = getLIAccessToken();

    return fetch(`${ENDPOINT}/api/unlikeTil`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tilId, ghId, ghAccessToken, liId, liAccessToken })
    }).then(res => res.json());
};


export const getUserData = (id: string) => {
    return fetch(`${ENDPOINT}/api/getUserData?id=${id}`).then(res => res.json());
};


export const updateUser = (twUrl?: string, liUrl?: string, fbUrl?: string, wUrl?: string) => {
    const ghId = getGHUserId();
    const ghAccessToken = getGHAccessToken();
    const liId = getLIUserId();
    const liAccessToken = getLIAccessToken();

    return fetch(`${ENDPOINT}/api/updateUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ghId, ghAccessToken, liId, liAccessToken, twUrl, liUrl, fbUrl, wUrl })
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


export const getStatistics = () => {
    return fetch(`${ENDPOINT}/api/getStatistics`).then(res => res.json());
};