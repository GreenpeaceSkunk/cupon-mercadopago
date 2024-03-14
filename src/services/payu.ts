import { AxiosResquestError } from 'greenpeace';
import { ApiCall } from '../utils/apiCall';

type PayUSuscribeResponse = {token: string; url_webpay: string};

export const suscribe = async (data: any): Promise<any | AxiosResquestError> => {
  const response: any = await ApiCall({
    baseURL: `${process.env.REACT_APP_GREENPEACE_PAYU_API_URL}/inscripcion`,
    method: 'POST',
    data,
  });

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
  } as PayUSuscribeResponse;
};
