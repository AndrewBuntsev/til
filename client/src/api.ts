import { ENDPOINT } from "./const/settings";
import { Til } from "./types/Til";

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

