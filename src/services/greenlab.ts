import { ApiCall } from '../utils/apiCall';

export const createContact = async (data: any) => {
  try {
    const response = await ApiCall({
      headers: {
        'X-Greenlab-App': window.sessionStorage.getItem('greenlab_app'),
      },
      baseURL: `${process.env.REACT_APP_GREENLAB_API_URL}/hubspot/contact`,
      method: 'POST',
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
        'X-Greenlab-App': window.sessionStorage.getItem('greenlab_app'),
      },
      baseURL: `${process.env.REACT_APP_GREENLAB_API_URL}/application/coupon/${appName}?env=${process.env.REACT_APP_ENVIRONMENT}`,
      method: 'GET',
    });
    return response;
  } catch(error: any) {
    console.log(error);
  }
}
