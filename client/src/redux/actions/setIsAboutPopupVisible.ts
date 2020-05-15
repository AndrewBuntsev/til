import { ActionType } from '../ActionType';
import { Action } from '../Action';

export default (isAboutPopupVisible): Action => ({
  type: ActionType.SET_IS_ABOUT_POPUP_VISIBLE,
  payload: { isAboutPopupVisible }
});
