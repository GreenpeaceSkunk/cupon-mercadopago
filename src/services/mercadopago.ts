import { AxiosResquestError, CouponType } from 'greenpeace';
import { URLSearchParams } from 'url';
import { IData, IPaymentData, IUserData } from '../types';
import { ApiCall } from '../utils/apiCall';
import { createToken, getCardType, getInstallments, setPublishableKey } from '../utils/mercadopago';
import { postRecord, updateContact } from './greenlab';

const API_URL = 'https://api.mercadopago.com/v1';

interface IPaymentParams {
  active?: boolean;
  payment_method_id?: string;
  issuer_id?: string;
  merchant_account_id?: string;
  payment_method_option_id?: string;
  token?: string;
  public_key?: string;
  bin?: string;
  amount?: number;
  referer?: string;
  type?: string,
  marketplace?: 'NONE';
  status?: 'active';
}

export const getPaymentMethods = async (params: IPaymentParams): Promise<any | AxiosResquestError> => {
  return ApiCall({
    url: `${API_URL}/payment_methods`,
    method: 'GET',
    params: {
      ...params,
      ...{
        locale: 'es',
      },
    },
  });
};

export const getPaymentMethodsSearch = async (params: IPaymentParams): Promise<any | AxiosResquestError> => {
  return ApiCall({
    url: `${API_URL}/payment_methods/search`,
    method: 'GET',
    params: {
      ...params,
      ...{
        locale: 'es',
      },
    },
  });
};

export const getPaymentMethodsInstallments = async (params: IPaymentParams): Promise<any | AxiosResquestError> => {
  return ApiCall({
    url: `${API_URL}/payment_methods/installments`,
    method: 'GET',
    params: {
      ...params,
      locale: 'es',
      status: 'active',
      marketplace: 'NONE',
    },
  });
};

export const getIdentificationTypes = async (params: IPaymentParams): Promise<any | AxiosResquestError> => {
  return ApiCall({
    url: `${API_URL}/identification_types`,
    method: 'GET',
    params: {
      ...params,
      ...{
        locale: 'es',
      },
    },
  });
};

export const getPublicKey = async (): Promise<any | AxiosResquestError> => {
  return ApiCall({
    url: `${process.env.REACT_APP_GREENPEACE_MERCADOPAGO_API_URL}/getPublicKey`,
    method: 'GET',
    params: {},
  });
};

export const createStaging = async (data: any): Promise<any | AxiosResquestError> => ApiCall({
  url: `${process.env.REACT_APP_GREENPEACE_MERCADOPAGO_API_URL}/createStaging`,
  method: 'POST',
  data,
  // headers: {
  //   'X-meli-session-id': window.MP_DEVICE_SESSION_ID,
  // },
});



/**
 * Post the payment to the API
 * 
 * @param form 
 * @param data 
 * @param couponType 
 * @param campaignId 
 * @param params 
 * @param formId 
 * @returns 
 */
export const doSubscriptionPayment = async (
  form: HTMLFormElement,
  data: IData,
  couponType: CouponType,
  params: URLSearchParams,
  campaignId: string,
  formId?: string,
  MercadoPago?: any,
): Promise<{
  error: boolean;
  message?: string;
}> => {
  const { user, payment } = data;

  const token = await createToken(form, MercadoPago, data);
  const amount = payment.amount === 'otherAmount' ? payment.newAmount : payment.amount;
  
  if(token.isValid) {
      const paymentMethod = await getInstallments(
        {
          amount,
          bin: payment.cardNumber,
          paymentTypeId: 'credit_card'
        },
        MercadoPago
      );
      
    if(paymentMethod) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
    
      let payload = {
        device_id: window.MP_DEVICE_SESSION_ID,
        payment_method_id: paymentMethod.payment_method_id,
        payment_type_id: 'credit_card',
        issuer_id: paymentMethod.issuer.id,
        token: `${token.tokenId}`,
        type: couponType,
        amount,
        nombre: user.firstName,
        apellido: user.lastName,
        cod_area: user.areaCode,
        telefono: user.phoneNumber,
        email: user.email,
        genero: '',
        pais: '',
        direccion: '',
        localidad: '',
        provincia: '',
        codigo_provincia: '',
        codigo_postal: '',
        ocupacion: '',
        tipodocumento: payment.docType,
        mes_vencimiento: payment.cardExpirationMonth,
        ano_vencimiento: payment.cardExpirationYear,
        documento: payment.docNumber,
        firstDigits: payment.cardNumber.slice(0, 6),
        lastDigits: payment.cardNumber.slice(payment.cardNumber.length - 4),
        date: today,
        utms: [
          { campo: 'gpi__utm_campaign__c', valor: params.get('utm_campaign') },
          { campo: 'gpi__utm_medium__c', valor: params.get('utm_medium') },
          { campo: 'gpi__utm_source__c', valor: params.get('utm_source') },
          { campo: 'gpi__utm_content__c', valor: params.get('utm_content') },
          { campo: 'gpi__utm_term__c', valor: params.get('utm_term') },
        ],
        campaign_id: `${campaignId}`,
      };

      const result = await createStaging(payload);

      let donationStatus = 'pending';
      let errorCode, errorMessage;
      
      if(result['error']) {
        errorCode = result.errorCode;
        errorMessage = result.message.replace(/,/g, '').replace(/;/g, '');
        
        await updateContact(payload.email, { donationStatus });
      } else {
        window.userAmount = amount;
        donationStatus = 'done';

        await updateContact(payload.email, { donationStatus });
      }

      /* Backup to Forma. */
      if(formId) {
        await postRecord({
          amount,
          areaCode: user.areaCode,
          campaignId: `${campaignId}`,
          /* This is a workaround to send always at least 16 digits of card number */
          card: payment.cardNumber.length === 8 ? `${payment.cardNumber}00000000` : payment.cardNumber,
          card_type: getCardType(paymentMethod.payment_method_id),
          cardLastDigits: payload.lastDigits,
          cardExpMonth: payload.mes_vencimiento,
          cardExpYear: payload.ano_vencimiento,
          citizenId: payment.docNumber,
          citizenIdType: payment.docType,
          mpDeviceId: window.MP_DEVICE_SESSION_ID,
          donationStatus,
          email: user.email,
          errorCode: errorCode || '',
          errorMessage: errorMessage || '',
          firstName: user.firstName,
          form_id: formId,
          fromUrl: document.location.href,
          lastName: user.lastName,
          mpPayMethodId: paymentMethod.issuer.name,
          mpPayOptId: paymentMethod.payment_method_id,
          phoneNumber: user.phoneNumber,
          recurrenceDay: tomorrow.getDate(),
          transactionDate: today,
          userAgent: window.navigator.userAgent.replace(/;/g, '').replace(/,/g, ''),
          utm: `utm_campaign=${ params.get('utm_campaign')}&utm_medium=${ params.get('utm_medium')}&utm_source=${ params.get('utm_source')}&utm_content=${ params.get('utm_content')}&utm_term=${ params.get('utm_term')}`,
        });
      }
    }

  } else {
    return {
      error: true,
      message: token.message,
    }
  }
  
  return {
    error: false,
  };
} 

const _ = {
  getPaymentMethods,
  getPaymentMethodsSearch,
  getPaymentMethodsInstallments,
  getIdentificationTypes,
  createStaging,
  doSubscriptionPayment,
};

export default _;
