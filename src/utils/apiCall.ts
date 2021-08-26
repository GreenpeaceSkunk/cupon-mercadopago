import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AxiosResquestError } from 'greenpeace';

const isRequestError = (object: any): object is AxiosResquestError => {
  return (!object) ? true : object.error;
}

const ApiCall = async <A>(config: AxiosRequestConfig) => {
  console.log(config.headers)

  try {
    const response: AxiosResponse = await Axios.request({
      method: config.method,
      baseURL: config.baseURL ? config.baseURL : `${process.env.REACT_APP_API_URL}`,
      url: config.url,
      headers: config.headers ? config.headers : {},
      data: config.data,
      params: config.params,
    });
    return response.data as A;
  } catch(e) {
    const { message, response } = e as AxiosError;
    return {
      error: true,
      status: response?.status,
      message,
      errorMessage: response?.data.errorMessage || '',
    } as AxiosResquestError;
  }
}

export { isRequestError, ApiCall };
