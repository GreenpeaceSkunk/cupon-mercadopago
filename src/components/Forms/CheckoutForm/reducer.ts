import { SharedActions, GenericReducerFn, SharedState } from 'greenpeace';

export type FieldErrorType = { [fieldName: string]:boolean } | null;

export type ContextStateType = {
  errors: FieldErrorType;
  isEdited: boolean;
  allowNext: boolean;
  attemps: number,
} & SharedState;

export type ContextActionType = 
| { type: 'UPDATE_FIELD_ERRORS', payload: { fieldName: string; isValid: boolean; } }
| { type: 'RESET_FIELD_ERRORS' }
| { type: 'UPDATE_FORM_STATUS' }
| { type: 'RESET' }
| { type: 'SET_ERROR', error: string | null }
| { type: 'SUBMITTED_WITH_ERRORS', error: string | null }
| SharedActions;

export const initialState: ContextStateType = {
  error: null,
  errors: null,
  submitted: false,
  submitting: false,
  isEdited: false,
  allowNext: false,
  attemps: 0,
}

export const reducer: GenericReducerFn<ContextStateType, ContextActionType> = (state: ContextStateType, action: ContextActionType) => {
  switch (action.type) {
    case 'UPDATE_FIELD_ERRORS':
      let tmpErrors = (state.errors) ? {...state.errors} : {};
      if(action.payload.isValid) {
        delete tmpErrors[`${action.payload.fieldName}`];
      } else {
        tmpErrors[`${action.payload.fieldName}`] = false;
      }
      return {
        ...state,
        errors: tmpErrors,
        allowNext: Object.values(tmpErrors).length ? false : true,
      }
    case 'RESET_FIELD_ERRORS': {
      return {
        ...state,
        errors: null,
        isEdited: false,
      }
    }
    case 'UPDATE_FORM_STATUS': {
      return {
        ...state,
        isEdited: true,
      };
    }
    case 'RESET': {
      return {
        ...state,
        errors: null,
        submitting: false,
        submitted: false,
      };
    }
    case 'SUBMIT': {
      return {
        ...state,
        submitting: true,
        submitted: false,
        isEdited: false,
        error: null,
      };
    }
    case 'SUBMITTED': {
      return {
        ...state,
        submitting: false,
        submitted: true,
        isEdited: false,
      };
    }
    case 'SUBMITTED_WITH_ERRORS': {
      return {
        ...state,
        error: action.error,
        submitting: false,
        submitted: true,
        isEdited: false,
        attemps: state.attemps + 1,
      };
    }
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
