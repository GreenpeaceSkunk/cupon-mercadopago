import { AxiosResquestError } from 'greenpeace';
import {ApiCall} from '../utils/apiCall';

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
  // js_version?: string;
}

export const getPaymentMethods = async (params: IPaymentParams): Promise<any | AxiosResquestError> => {
  return ApiCall({
    url: `${process.env.REACT_APP_MERCADOPAGO_API_URL}/payment_methods`,
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
    url: `${process.env.REACT_APP_MERCADOPAGO_API_URL}/payment_methods/search`,
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
    url: `${process.env.REACT_APP_MERCADOPAGO_API_URL}/payment_methods/installments`,
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
    url: `${process.env.REACT_APP_MERCADOPAGO_API_URL}/identification_types`,
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
    // url: `https://dona.greenpeace.org.ar/gp/getPublicKey`,
    method: 'GET',
    params: {},
  });;
};

// TODO
export const doSubscriptionPayment = async (data: any): Promise<any | AxiosResquestError> => ApiCall({
  url: `${process.env.REACT_APP_GREENPEACE_MERCADOPAGO_API_URL}/createStaging`,
  // url: `https://dona.greenpeace.org.ar/gp/createStaging`,
  method: 'POST',
  data,
});


export default {
  getPaymentMethods,
  getPaymentMethodsSearch,
  getPaymentMethodsInstallments,
  getIdentificationTypes,
  doSubscriptionPayment,
}