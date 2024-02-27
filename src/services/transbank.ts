import { AxiosResquestError } from 'greenpeace';
import { ApiCall } from '../utils/apiCall';

type TransbankSuscribeResponse = {token: string; url_webpay: string};

// const API_URL = 'https://tbktesting.voluntariosgreenpeace.cl';
const API_URL = 'http://localhost:7080';

export const suscribe = async (data: any): Promise<any | AxiosResquestError> => {
  try {
    const response: any = await ApiCall({
      baseURL: `${API_URL}/inscripcion`,
      method: 'POST',
      data,
    });

    if(response) {
      return {
        token: response.token,
        url_webpay: response.url_webpay,
      };
    }
  } catch(error: any) {
    console.log(error);
  }
};
