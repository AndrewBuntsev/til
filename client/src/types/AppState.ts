import { User } from "./User";


export type AppState = {
    user: User;
    isSearchFormVisible: boolean;
    isAboutPopupVisible: boolean;
    isUserMenuVisible: boolean;
};