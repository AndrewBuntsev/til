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

export const getGHUserByRequestCode = (code: string) => {
    return fetch(`${ENDPOINT}/api/ghAuth?code=${code}`).then(res => res.json());
};

export const getGHUserByAccessToken = (access_token: string) => {
    return fetch(`${ENDPOINT}/api/getGHUser?access_token=${access_token}`).then(res => res.json());
};