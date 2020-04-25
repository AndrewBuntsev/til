import Cookies from 'universal-cookie';
import * as COOKIES from '../const/cookies';

const cookies = new Cookies();

export const getFBUserId = () => cookies.get(COOKIES.FB_USER_ID);
export const setFBUserId = userId => cookies.set(COOKIES.FB_USER_ID, userId);
export const getFBAccessToken = () => cookies.get(COOKIES.FB_ACCESS_TOKEN);
export const setFBAccessToken = accessToken => cookies.set(COOKIES.FB_ACCESS_TOKEN, accessToken);

export const getGHUserId = () => cookies.get(COOKIES.GH_USER_ID);
export const setGHUserId = userId => cookies.set(COOKIES.GH_USER_ID, userId);
export const getGHAccessToken = () => cookies.get(COOKIES.GH_ACCESS_TOKEN);
export const setGHAccessToken = accessToken => cookies.set(COOKIES.GH_ACCESS_TOKEN, accessToken);

export const getLIUserId = () => cookies.get(COOKIES.LI_USER_ID);
export const setLIUserId = userId => cookies.set(COOKIES.LI_USER_ID, userId);
export const getLIAccessToken = () => cookies.get(COOKIES.LI_ACCESS_TOKEN);
export const setLIAccessToken = accessToken => cookies.set(COOKIES.LI_ACCESS_TOKEN, accessToken);


export const clearCookies = () => {
    setFBUserId('');
    setFBAccessToken('');
    setGHUserId('');
    setGHAccessToken('');
    setLIUserId('');
    setLIAccessToken('');
};