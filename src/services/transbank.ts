import { AxiosResquestError } from 'greenpeace';
import { ApiCall } from '../utils/apiCall';

type TransbankSuscribeResponse = {token: string; url_webpay: string};

export const suscribe = async (data: any): Promise<any | AxiosResquestError> => {
  const response: any = await ApiCall({
    baseURL: `${process.env.REACT_APP_GREENPEACE_TRANSBANK_API_URL}/inscripcion`,
    method: 'POST',
    data,
  });
  console.log(response)

  if(response.error) {
    return {
      message: response.data.messages[0],
      data: response.data.validationErrors,
      status: response.status,
    } as AxiosResquestError;
  }

  return {
    token: response.token,
    url_webpay: response.url_webpay,
  } as TransbankSuscribeResponse;
};

export const confirm = async (data: {token: string, transactionId: string}): Promise<any | AxiosResquestError> => {
  const response: any = await ApiCall({
    baseURL: `${process.env.REACT_APP_GREENPEACE_TRANSBANK_API_URL}/inscripcion/confirmar`,
    method: 'POST',
    data: {
      token: data.token,
      transaccionId: data.transactionId,
    },
  });

  if(response.error) {
    return {
      message: response.data,
      status: response.status,
      error: response.error,
    } as AxiosResquestError;
  }

  return {
    status: 200,
    OK: true,
  };
};
