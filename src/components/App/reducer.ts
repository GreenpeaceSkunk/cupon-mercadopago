import { SharedActions, GenericReducerFn, SharedState } from 'greenpeace';

export type ContextStateType = {
  appData: any;
} & SharedState;

export type ContextActionType = 
| { type: 'SET_APP_DATA', payload: any }
| SharedActions;

export const initialState: ContextStateType = {
  appData: null,
  error: null,
}

export const reducer: GenericReducerFn<ContextStateType, ContextActionType> = (state: ContextStateType, action: ContextActionType) => {
  switch (action.type) {
    case 'SET_APP_DATA':
      return {
        ...state,
        appData: action.payload,
      };
    default: {
      throw new Error('Context Error');
    }
  }
}

const _ = {
  initialState,
  reducer,
};

export default _;
