import { ActionType } from '../ActionType';
import { Action } from '../Action';

export default (isUserMenuVisible): Action => ({
  type: ActionType.SET_IS_USER_MENU_VISIBLE,
  payload: { isUserMenuVisible }
});
