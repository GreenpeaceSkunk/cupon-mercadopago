import { SharedState, SharedActions, GenericReducerFn, IData, IUserData, IPaymentData, } from 'greenpeace';

export type ContextStateType = {
  data: {
    user: IUserData;
    payment: IPaymentData;
  };
} & SharedState;

type PayloadType = { [x: string]: string | number }; 

export type ContextActionType = 
| { type: 'UPDATE_USER_DATA', payload: PayloadType }
| { type: 'UPDATE_PAYMENT_DATA', payload: PayloadType }
| { type: 'SET_ERROR', error: string | null }
| SharedActions;

export const initialState: ContextStateType = {
  // data: {
  //   user: {
  //     firstName: '',
  //     lastName: '',
  //     birthDate: '',
  //     email: '',
  //     genre: '',
  //     phoneNumber: '',
  //     areaCode: '',
  //   } as IUserData,
  //   payment: {
  //     cardNumber: '', 
  //     cardholderName: '',
  //     securityCode: '',
  //     cardExpirationMonth: '',
  //     cardExpirationYear: '',
  //     docNumber: '',
  //     docType: '',
  //     amount: '',
  //     newAmount: '',
  //   } as IPaymentData,
  // } as IData,
  data: {
    user: {
      firstName: 'Doe',
      lastName: 'Deer',
      birthDate: '20/03/1985',
      email: 'doe.deer@email.com',
      genre: '',
      phoneNumber: '44440000',
      areaCode: '11',
    } as IUserData,
    payment: {
      cardNumber: '4509953566233704', 
      cardholderName: 'APRO',
      securityCode: '223',
      cardExpirationMonth: '11',
      cardExpirationYear: '2025',
      docNumber: '31533422',
      docType: 'DNI',
      amount: '700',
      newAmount: '',
    } as IPaymentData,
  } as IData,
  submitting: false,
  submitted: false,
  error: null,
}

export const reducer: GenericReducerFn<ContextStateType, ContextActionType> = (state: ContextStateType, action: ContextActionType) => {
  switch (action.type) {
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
                    newAmount: '',
                  }
                : action.payload,
            },
          },
        }
    case 'SUBMIT':
      return {
        ...state,
        submitting: true,
        submitted: false,
      };
    case 'SUBMITTED':
      return {
        ...state,
        submitting: false,
        submitted: true,
      };
    case 'SET_ERROR':
      return {
        ...state,
        submitting: false,
        submitted: false,
        error: action.error,
      };
    default: {
      throw new Error('Context Error');
    }
  }
}