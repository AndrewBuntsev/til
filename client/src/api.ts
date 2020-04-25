import { ENDPOINT } from "./const/settings";
import { Til } from "./types/Til";
import { User } from "./types/User";

export const testApi = () => {
    return fetch(`${ENDPOINT}/api/test`).then(res => res.json());
};

export const getTils = () => {
    return fetch(`${ENDPOINT}/api/getTils`).then(res => res.json());
};

export const addTil = (til: Til) => {
    return fetch(`${ENDPOINT}/api/addTil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(til)
    }).then(res => res.json());
};

export const getUser = options => {
    const fbId = options.fbId ? options.fbId : '';
    const ghId = options.ghId ? options.ghId : '';
    return fetch(`${ENDPOINT}/api/getUser?fbId=${fbId}&ghId=${ghId}`).then(res => res.json());
};

export const addUser = (user: User) => {
    return fetch(`${ENDPOINT}/api/addUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    }).then(res => res.json());
};




export const getFBUser = (user_id: string, access_token: string) => {
    return fetch(`${ENDPOINT}/api/getFBUser?user_id=${user_id}&access_token=${access_token}`).then(res => res.json());
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