import { ActionType } from '../ActionType';
import { Action } from '../Action';

export default (actions: Array<Action>): Action => ({
  type: ActionType.COMBINED_ACTION,
  payload: { actions }
});
