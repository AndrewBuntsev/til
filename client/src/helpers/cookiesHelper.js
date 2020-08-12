import Cookies from 'universal-cookie';
import * as COOKIES from '../const/cookies';

const cookies = new Cookies();

export const getGHUserId = () => cookies.get(COOKIES.GH_USER_ID);
export const setGHUserId = userId => cookies.set(COOKIES.GH_USER_ID, userId);
export const getGHAccessToken = () => cookies.get(COOKIES.GH_ACCESS_TOKEN);
export const setGHAccessToken = accessToken => cookies.set(COOKIES.GH_ACCESS_TOKEN, accessToken);

export const getLIUserId = () => cookies.get(COOKIES.LI_USER_ID);
export const setLIUserId = userId => cookies.set(COOKIES.LI_USER_ID, userId);
export const getLIAccessToken = () => cookies.get(COOKIES.LI_ACCESS_TOKEN);
export const setLIAccessToken = accessToken => cookies.set(COOKIES.LI_ACCESS_TOKEN, accessToken);

export const getCogUserId = () => cookies.get(COOKIES.COG_USER_ID);
export const setCogUserId = userId => cookies.set(COOKIES.COG_USER_ID, userId);
export const getCogAccessToken = () => cookies.get(COOKIES.COG_ACCESS_TOKEN);
export const setCogAccessToken = accessToken => cookies.set(COOKIES.COG_ACCESS_TOKEN, accessToken);


export const clearCookies = () => {
    setGHUserId('');
    setGHAccessToken('');
    setLIUserId('');
    setLIAccessToken('');
    setCogUserId('');
    setCogAccessToken('');
};