import { ENDPOINT } from "./const/settings";
import { getGHUserId, getGHAccessToken, getLIUserId, getLIAccessToken, getCogUserId, getCogAccessToken, getCogRefreshToken } from "./helpers/cookiesHelper";


export const getTils = (options?: { id?: string, author?: string, likedBy?: string, date?: string, tag?: string, page?: string, searchTerm?: string, random?: string }) => {
    const id = options && options.id ? options.id : '';
    const author = options && options.author ? options.author : '';
    const likedBy = options && options.likedBy ? options.likedBy : '';
    const date = options && options.date ? options.date : '';
    const tag = options && options.tag ? options.tag : '';
    const page = options && options.page ? options.page : '';
    const searchTerm = options && options.searchTerm ? options.searchTerm : '';
    const random = options && options.random ? options.random : '';

    const query = `${ENDPOINT}/tils?id=${id}&author=${author}&likedBy=${likedBy}&date=${date}&tag=${tag}&page=${page}&searchTerm=${searchTerm}&random=${random}`;

    return fetch(query).then(res => res.json());
};


export const saveTil = (text: string, tag: string, tilId?: string) => {
    const authObject = composeAuthObject();
    return fetch(`${ENDPOINT}/saveTil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tag, tilId, ...authObject })
    }).then(res => res.json());
};

export const deleteTil = (tilId?: string) => {
    const authObject = composeAuthObject();
    return fetch(`${ENDPOINT}/deleteTil`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tilId, ...authObject })
    }).then(res => res.json());
};

export const likeTil = (tilId?: string) => {
    const authObject = composeAuthObject();
    const bodyObject = { tilId, ...authObject };

    return fetch(`${ENDPOINT}/likeTil`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyObject),
    }).then(res => res.json());
};

export const unlikeTil = (tilId?: string) => {
    const authObject = composeAuthObject();
    return fetch(`${ENDPOINT}/unlikeTil`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tilId, ...authObject })
    }).then(res => res.json());
};


export const getUserData = (id: string) => {
    return fetch(`${ENDPOINT}/getUserData?id=${id}`).then(res => res.json());
};

export const updateUser = (twUrl?: string, liUrl?: string, fbUrl?: string, wUrl?: string) => {
    const authObject = composeAuthObject();
    return fetch(`${ENDPOINT}/updateUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...authObject, twUrl, liUrl, fbUrl, wUrl })
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

export const cogAuth = (options: { code?: string, access_token?: string, refresh_token?: string }) => {
    const code = options.code ? options.code : '';
    const access_token = options.access_token ? options.access_token : '';
    const refresh_token = options.refresh_token ? options.refresh_token : '';
    return fetch(`${ENDPOINT}/auth/cogAuth?code=${code}&access_token=${access_token}&refresh_token=${refresh_token}`).then(res => res.json());
};



export const getTags = () => {
    return fetch(`${ENDPOINT}/tags`).then(res => res.json());
};

// export const addTag = (tag: string) => {
//     const authObject = composeAuthObject();
//     return fetch(`${ENDPOINT}/addTag`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ tag, ...authObject })
//     }).then(res => res.json());
// };


export const getStatistics = () => {
    return fetch(`${ENDPOINT}/statistics`).then(res => res.json());
};



const composeAuthObject = () => {
    const ghId = getGHUserId();
    const ghAccessToken = getGHAccessToken();
    const liId = getLIUserId();
    const liAccessToken = getLIAccessToken();
    const cogId = getCogUserId();
    const cogAccessToken = getCogAccessToken();
    const cogRefreshToken = getCogRefreshToken();

    return { ghId, ghAccessToken, liId, liAccessToken, cogId, cogAccessToken, cogRefreshToken };
};