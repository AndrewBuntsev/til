import { ActionType } from './ActionType';

export type Action = {
  type: ActionType;
  payload: any;
};
