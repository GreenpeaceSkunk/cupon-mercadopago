import { ApiCall } from '../utils/apiCall';
import { getCouponUrl } from '../utils';

export const getApiUrl = (): string => {
  return (`${process.env.REACT_APP_ENVIRONMENT}` === 'development')
    ? `${process.env.REACT_APP_GREENLAB_API_URL}`
    : `${window.location.origin}${process.env.REACT_APP_GREENLAB_API_URL}`;
}

export const getApiImagesUrl = (): string => {
  return (`${process.env.REACT_APP_ENVIRONMENT}` === 'development')
    ? `${process.env.REACT_APP_GREENLAB_API_IMAGES}`
    : `${window.location.origin}${process.env.REACT_APP_GREENLAB_API_IMAGES}`;
}
 
export const createContact = async (data: any) => {
  try {
    const response = await ApiCall({
      headers: {
        'X-Greenlab-App': `${window.sessionStorage.getItem('greenlab_app_name')}`,
      },
      baseURL: `${getApiUrl()}/hubspot/contact`,
      method: 'POST',
      data: {
        ...data,
        origin: document.location.href,
        couponUrl: getCouponUrl(),
      },
    });
    return response;
  } catch(error: any) {
    console.log(error);
  }
}

export const updateContact = async (email: string, data: any) => {
  try {
    const response = await ApiCall({
      headers: {
        'X-Greenlab-App': `${window.sessionStorage.getItem('greenlab_app_name')}`,
      },
      baseURL: `${getApiUrl()}/hubspot/contact/email/${email}`,
      method: 'PUT',
      data,
    });
    return response;
  } catch(error: any) {
    console.log(error);
  }
}

export const getCoupon = async (appName = '') => {
  try {
    const response = await ApiCall({
      headers: {
        'X-Greenlab-App': `${window.sessionStorage.getItem('greenlab_app_name')}`,
      },
      baseURL: `${getApiUrl()}/application/coupon/${appName}?env=${process.env.REACT_APP_ENVIRONMENT}`,
      method: 'GET',
    });
    return response;
  } catch(error: any) {
    console.log(error);
  }
}

export const getUserByEmail = async (email: string) => {
  try {
    const response = await ApiCall({
      headers: {
        'X-Greenlab-App': `${window.sessionStorage.getItem('greenlab_app_name')}`,
      },
      baseURL: `${getApiUrl()}/hubspot/contact/email/${email}`,
      method: 'GET',
    });
    return response;
  } catch(error: any) {
    console.log(error);
  }
}

export const postRecord = async (data: any, form_id?: number) => {
  try {
    const response = await ApiCall({
      headers: {
        'X-Greenlab-App': `${window.sessionStorage.getItem('greenlab_app_name')}`,
      },
      baseURL: `${getApiUrl()}/forma/form/${data.form_id || form_id!}/record`,
      method: 'POST',
      data,
    });
    return response;
  } catch(error: any) {
    console.log(error);
  }
}
