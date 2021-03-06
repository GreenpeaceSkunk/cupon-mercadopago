import { CustomHTMLScriptElement } from 'greenpeace';

export type CardType = {
  id: number;
  value: string;
  description: string;
  enable: boolean;
};

export const cardTypes: CardType[] = [
  { id: 2, value: 'visa', description: 'Visa', enable: true },
  { id: 4, value: 'debvisa', description: 'Visa débito', enable: true },
  { id: 3, value: 'mastercard', description: 'Mastercard', enable: true },
  { id: 5, value: 'amex', description: 'Amex', enable: true },
  { id: 6, value: 'cabal', description: 'Cabal', enable: true },
  { id: 6, value: 'debcabal', description: 'Cabal débito', enable: false },
  { id: 7, value: 'cmr', description: 'CMR', enable: false },
  { id: 7, value: 'cencosud', description: 'Cencosud', enable: false },
  { id: 8, value: 'naranja', description: 'Naranja', enable: true },
  { id: 10, value: 'diners', description: 'Diners', enable: false },
];

// https://www.mercadopago.com.ar/developers/es/guides/online-payments/checkout-api/handling-responses
export const ERROR_CODES: {[key: string]: string} = {
  'E301': 'Ingresa un número de tarjeta válido.',
  'E302': 'Revisa el código de seguridad.',
  '323': 'Revisa tu documento.',
  '324': 'El documento es inválido.',
  '325': 'El mes es inválido.',
  '326': 'El año es inválido.',
  'default': 'Revisa los datos.',
};

export const initialize = () => {
  (async () => {
    await initializeSdk();
    await initializeSecurityPayment();
  })();
}

export const initializeSdk = async () => {
  return await (async () => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//secure.mlstatic.com/sdk/javascript/v1/mercadopago.js`;
    document.body.appendChild(script);
  })();
}

export const initializeSecurityPayment = async () => {
  return await (async () => {
    let script: CustomHTMLScriptElement = document.createElement('script');
    script.src = `//www.mercadopago.com/v2/security.js`;
    script.view = 'home';
    document.body.appendChild(script);
  })();
}

export const setPublishableKey = (publicKey: string) => {
  window.Mercadopago.setPublishableKey(publicKey);
}

export const createToken = async (form: HTMLFormElement):Promise<{ isValid: boolean; message: string; }> => {
  return new Promise((resolve, reject) => {
    const result = async (status: any, response: any) => {
      if (status === 200 || status === 201) {
        if(form) {
          let card = document.createElement('input');
          card.setAttribute('name', 'token');
          card.setAttribute('type', 'hidden');
          card.setAttribute('value', response.id);
          form.appendChild(card);
          resolve({ isValid: true, message: '' });
        }
      } else {
        const errorCode = (response.cause.length) ? response.cause[0].code as string : 'default';
        resolve({ isValid: false, message: ERROR_CODES[errorCode] });
      }
    }
    window.Mercadopago.tokenId = '';
    window.Mercadopago.createToken(form, result);
  });
}

export const getInstallments = async (params: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    window.Mercadopago.getInstallments(params, (status: number, installments: any[]) => {
      if(installments.length) {
        const paymentMethods = installments.map((paymentMethod: any) => (
          paymentMethod.processing_mode === 'gateway' ? paymentMethod : null
        )).filter((paymentMethod: any) => paymentMethod !== null);
        resolve(paymentMethods.length ? paymentMethods[0] : null);
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * 
 * @param paymentMethodId amex, mastercard, amex
 * @param payment_type_id Could be credit_card or debit_card
 * @returns 
 */
export const getCardType = (paymentMethodId = ''): number => {
  switch(paymentMethodId) {
    case 'visa':
      return 2;
    case 'mastercard':
      return 3;
    case 'debvisa':
      return 4;
    case 'amex':
      return 5;
    case 'cabal':
    case 'debcabal':
      return 6;
    case 'cmr':
    case 'cencosud':
      return 7;
    case 'naranja':
      return 8;
    case 'diners':
      return 10;
    default:
      return 1;
  };
} 
