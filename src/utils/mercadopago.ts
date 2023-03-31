import { CustomHTMLScriptElement, IData } from 'greenpeace';

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
    script.src = `//sdk.mercadopago.com/js/v2`; 
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

export const setPublishableKey = (publicKey: string): any => {
  if(window.MercadoPago) {
    const MercadoPago = new window.MercadoPago(publicKey);
    return MercadoPago;
  }

  return null;
}

/** To Review */
export const getIdentificationTypes = async (): Promise<any> => {
  return null;
}

export const createToken = async (form: HTMLFormElement, MercadoPago?: any, data?: IData):Promise<{ isValid: boolean; message: string; tokenId: string | null }> => {
  return await MercadoPago.createCardToken({
    cardholderName: data?.payment.cardholderName,
    identificationType: data?.payment.docType,
    identificationNumber: data?.payment.docNumber,
  })
  .then((result: any) => {
    if(form) {
      let card = document.createElement('input');
      card.setAttribute('name', 'token');
      card.setAttribute('type', 'hidden');
      card.setAttribute('value', result.id);
      form.appendChild(card);

      return Promise.resolve({ isValid: true, message: '', tokenId: result.id  });
    }
  }).catch((error: any) => {
    return Promise.resolve({ isValid: false, message: error.message || 'Ocurrió un error inesperado, pruebe con otra tarjeta.', tokenId: null });
  });
}

export const getInstallments = async (params: any, MercadoPago?: any): Promise<any> => {
  const installments = await MercadoPago.getInstallments({
    amount: params.amount,
    bin: params.bin,
    paymentTypeId: 'credit_card',
  });

  return installments[0];
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
