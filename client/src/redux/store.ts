import * as Redux from 'redux';

import rootReducer from './rootReducer';
import { AppState } from '../types/AppState';



const defaultState: AppState = {};


// apply redux extension for chrome only
const isChrome = !!window['chrome'] && (!!window['chrome'].webstore || !!window['chrome'].runtime);
const middleware = isChrome ? Redux.compose(window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']()) : undefined;

// initialize the store
const store = Redux.createStore(rootReducer, defaultState, middleware);
export default store;
