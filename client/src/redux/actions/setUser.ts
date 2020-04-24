import { ActionType } from '../ActionType';
import { User } from '../../types/User';
import { Action } from '../Action';

export default (user?: User | null): Action => ({
  type: ActionType.SET_USER,
  payload: { user }
});
