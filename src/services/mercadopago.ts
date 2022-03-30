import { AxiosResquestError } from 'greenpeace';
import { ApiCall } from '../utils/apiCall';

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
  });;
};

export const doSubscriptionPayment = async (data: any): Promise<any | AxiosResquestError> => ApiCall({
  url: `${process.env.REACT_APP_GREENPEACE_MERCADOPAGO_API_URL}/createStaging`,
  method: 'POST',
  data,
  // headers: {
  //   'X-meli-session-id': window.MP_DEVICE_SESSION_ID,
  // },
});

const _ = {
  getPaymentMethods,
  getPaymentMethodsSearch,
  getPaymentMethodsInstallments,
  getIdentificationTypes,
  doSubscriptionPayment,
};

export default _;
