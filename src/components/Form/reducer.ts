import { SharedState, SharedActions, GenericReducerFn, IData, IUserData, IPaymentData, } from 'greenpeace';

export type ContextStateType = SharedState;

type PayloadType = { [x: string]: string | number }; 

export type ContextActionType = 
| { type: 'UPDATE_USER_DATA', payload: PayloadType }
| { type: 'UPDATE_PAYMENT_DATA', payload: PayloadType }
| { type: 'SET_ERROR', error: string | null }
| SharedActions;

export const initialState: ContextStateType = {
  data: {
    user: {
      birthDate: '20/03/1985',
      email: 'doe.deer+20@email.com',
      genre: 'male',
    } as IUserData,
    payment: {
      cardNumber: '4509953566233704',//'4704550004928854', 
      cardholderName: 'Dan Tovbein',
      securityCode: '123',
      cardExpirationMonth: '11',
      cardExpirationYear: '2025',
      docNumber: '31533422',
      docType: 'DNI',
      amount: '200',
      newAmount: '',
    } as IPaymentData,
    // user: {
    //   birthDate: '',
    //   email: '',
    //   genre: '',
    // } as IUserData,
    // payment: {
    //   cardNumber: '4509953566233704',
    //   cardholderName: '',
    //   securityCode: '123',
    //   cardExpirationMonth: '11',
    //   cardExpirationYear: '25',
    //   issuerInput: '',
    //   transactionAmount: '',
    //   paymentMethodId: '',
    //   docNumber: '12345678',
    //   docType: 'DNI',
    // },
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
              ...action.payload['monto']
              ? {
                  amount: action.payload['monto'],
                  newAmount: '',
                }
              : (
                (action.payload['otherAmount'])
                ? {
                  amount: '',
                }
                : action.payload
              ),
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