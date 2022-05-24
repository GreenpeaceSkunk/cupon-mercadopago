import { ApiCall } from '../utils/apiCall';

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
      method: 'POST',
      data,
    });
    return response;
  } catch(error: any) {
    console.log(error);
  }
}

export const getCoupon = async (appName = '') => {
  console.log('getCoupon', getApiUrl());
  
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

export const postRecord = async (data: any) => {
  try {
    const response = await ApiCall({
      headers: {
        'X-Greenlab-App': `${window.sessionStorage.getItem('greenlab_app_name')}`,
      },
      baseURL: `${getApiUrl()}/forma/form/${data.form_id}/record`,
      method: 'POST',
      data,
    });
    return response;
  } catch(error: any) {
    console.log(error);
  }
}
