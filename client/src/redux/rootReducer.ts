import { AppState } from '../types/AppState';
import { Action } from './Action';
import { ActionType } from './ActionType';



export default (state: AppState, action: Action): AppState => {
    if (action.type == ActionType.COMBINED_ACTION) {
        return action.payload['actions'].reduce((state: AppState, action: Action) => ({ ...state, ...handleAction(state, action) }), state);
    }

    return handleAction(state, action);
};



function handleAction(state: AppState, action: Action): AppState {
    switch (action.type) {
        case ActionType.SET_USER:
            const user = action.payload['user'];
            return { ...state, user };

        case ActionType.SET_IS_SEARCH_FORM_VISIBLE:
            const isSearchFormVisible = action.payload['isSearchFormVisible'];
            return { ...state, isSearchFormVisible };

        case ActionType.SET_IS_ABOUT_POPUP_VISIBLE:
            const isAboutPopupVisible = action.payload['isAboutPopupVisible'];
            return { ...state, isAboutPopupVisible };

        case ActionType.SET_IS_USER_MENU_VISIBLE:
            const isUserMenuVisible = action.payload['isUserMenuVisible'];
            return { ...state, isUserMenuVisible };

        default:
            return state;
    }
}
