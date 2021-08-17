import { EventType as GoogleTagManagerEventType } from 'google-tag-manager';

declare global {
  interface Window {
    dataLayer: [{
      event: EventType,
    }];
    
    dcS: {
      synchro: any;
    };

    dc: {
      track: {
        event: (portalId: string, eventId: string, userEmail: string) => void;
      }
    };

    Mercadopago: {
      setPublishableKey: (a: string) => void;
      createToken: (a: any, b: any) => string;
      getInstallments: (a: any, b: any) => any;
      key: string;
      tokenId: string;
    };
  }
}

export interface GenericReducerFn<S, A> { 
  (state: S, action: A): S;
}

export type StylesType = {
  [el: string]: React.CSSProperties,
};
  
export type AxiosResquestError = {
  error: boolean,
  status: number,
  message: string,
};

export type ServiceParams = {
  public_key?: string;
}

export interface IUserData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  areaCode: string;
  phoneNumber: string;
  birthDate: string;
  genre: '' | 'female' | 'male' | 'non-binary';
}

export interface IPaymentData {
  cardNumber: string;
  cardholderName: string;
  securityCode: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  issuerInput: string;
  transactionAmount: string;
  paymentMethodId: string;
  docNumber: string;
  docType: string;
  amount: string;
  newAmount: string;
}

export interface IData {
  user: IUserData;
  payment: IPaymentData;
}

export type SharedState = {
  // data: {
  //   user: IUserData;
  //   payment: IPaymentData;
  // };
  submitting?: boolean,
  submitted?: boolean,
  error: string | null,
};

export type SharedActions = 
  | { type: 'SUBMIT' }
  | { type: 'SUBMITTED' }
  | { type: 'CANCEL' }
  | { type: 'FAILURE', error: any }
  
export type FormFields = 
  'birthDate'
  | 'email'
  | 'genre'
  | 'cardExpirationMonth'
  | 'cardExpirationYear'
  | 'cardholderName'
  | 'cardNumber'
  | 'issuerInput'
  | 'paymentMethodId'
  | 'securityCode'
  | 'transactionAmount'
  | 'docType'
  | 'docNumber';

export type FormFieldsType = {
  [Key in FormFields]?: boolean;
}

export type OnChangeEvent = MouseEvent<HTMLButtonElement> | ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>;
export type OnClickEvent = MouseEvent<HTMLButtonElement>;
export type FeedbackType = 'positive' | 'negative';

export type {
  GoogleTagManagerEventType,
};
