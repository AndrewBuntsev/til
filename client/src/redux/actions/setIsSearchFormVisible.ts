import { ActionType } from '../ActionType';
import { Action } from '../Action';

export default (isSearchFormVisible): Action => ({
  type: ActionType.SET_IS_SEARCH_FORM_VISIBLE,
  payload: { isSearchFormVisible }
});
