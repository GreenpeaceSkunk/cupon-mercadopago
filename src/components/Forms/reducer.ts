import { SharedState, SharedActions, GenericReducerFn, IData, IUserData, IPaymentData } from 'greenpeace';

export type FieldErrorType = { [fieldName: string]:boolean } | null;
export type ErrorsType = { [index: string]: FieldErrorType } | null;

type FieldType = { [x: string]: string | number };

const autofill = process.env.REACT_APP_AUTOFILL_VALUES ? (process.env.REACT_APP_AUTOFILL_VALUES === 'true') ? true : false : false;

export type ContextStateType = {
  data: {
    user: IUserData;
    payment: IPaymentData;
  };
  errors: FieldErrorType;
  isEdited: boolean;
  allowNext: boolean;
  submitted: boolean;
  submitting: boolean;
} & SharedState;

export type ContextActionType = 
| { type: 'UPDATE_FIELD', payload: FieldType }
| { type: 'UPDATE_FIELD_ERRORS', payload: { fieldName: string; isValid: boolean; } }
| { type: 'UPDATE_USER_DATA', payload: FieldType }
| { type: 'UPDATE_PAYMENT_DATA', payload: FieldType }
| { type: 'UPDATE_FORM_STATUS' }
| { type: 'SET_ERROR', error: string | null }
| { type: 'RESET' }
| SharedActions;

export const initialState: ContextStateType = {
  data: {
    user: {
      firstName: '',
      lastName: '',
      birthDate: '',
      email: '',
      genre: '',
      phoneNumber: '',
      areaCode: '',
      docNumber: '',
      docType: '',
      citizenId: '',
      constituentId: '',
      referredAreaCode: '',
      referredDocNumber: '',
      referredDocType: '',
      referredEmail: '',
      referredFirstName: '',
      referredLastName: '',
      referredPhoneNumber: '',
      ...(autofill ? {
        firstName: 'Doe',
        lastName: 'Deer',
        birthDate: '20/03/1985',
        email: 'doe.deer@email.com',
        genre: '',
        phoneNumber: '44440000',
        areaCode: '11',
        docNumber: '12345678',
        docType: 'DNI',
        citizenId: '',
        constituentId: '',
        referredAreaCode: '351',
        referredDocNumber: '19283475',
        referredDocType: 'LC',
        referredEmail: 'jhon.doe@email.com',
        referredFirstName: 'Jhon',
        referredLastName: 'Doe',
        referredPhoneNumber: '98765432',
      // } : {}),
    } as IUserData,
    payment: {
      cardNumber: '', 
      cardholderName: '',
      securityCode: '',
      cardExpirationMonth: '12',
      cardExpirationYear: '25',
      docNumber: '',
      docType: 'DNI',
      newAmount: '',
      ...(autofill ? {
        cardType: 'mastercard',
        // cardNumber: '4509953566233704', // Visa
        // cardNumber: '5031755734530604', // Mastercard
        // cardNumber: '371180303257522', // AMEX
        securityCode: '',
        // securityCode: '1234',
        cardholderName: 'APRO',
        // cardExpirationMonth: '11',
        // cardExpirationYear: '2025',
        docNumber: '10234567',
        // docType: 'DNI',
      } : {})
    } as IPaymentData,
  } as IData,
  submitting: false,
  submitted: false,
  isEdited: false,
  allowNext: false,
  error: null,
  errors: null,
}

export const reducer: GenericReducerFn<ContextStateType, ContextActionType> = (state: ContextStateType, action: ContextActionType) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            ...action.payload,
          },
        },
      }
    case 'UPDATE_USER_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          user: {
            ...state.data.user,
            ...action.payload,
          },
        },
      }
    case 'UPDATE_PAYMENT_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          payment: {
            ...state.data.payment,
            ...action.payload['amount']
              ? {
                  amount: action.payload['amount'],
                  newAmount: (action.payload['amount'] === 'otherAmount') ? action.payload['newAmount'] : '',
                }
              : action.payload,
          },
        },
      }
    case 'UPDATE_FIELD_ERRORS':
      let tmpErrors = (state.errors) ? {...state.errors} : {};
      
      if(action.payload.isValid) {
        delete tmpErrors[`${action.payload.fieldName}`];
      } else {
        tmpErrors[`${action.payload.fieldName}`] = false;
      }
      
      // Remove the newAMount field only if the amount is valid
      if(action.payload.fieldName === 'amount' && action.payload.isValid && !tmpErrors['newAmount']) {
        delete tmpErrors['newAmount'];
      }
      
      return {
        ...state,
        errors: tmpErrors,
        allowNext: Object.values(tmpErrors).length ? false : true,
      }
    case 'SET_ERROR': {
      return {
        ...state,
        submitting: false,
        submitted: false,
        error: action.error,
      }
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
