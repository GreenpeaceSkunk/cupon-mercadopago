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

/**
 * Update Hubspot contact
 * @param email
 * @param data
 * @returns
 */
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

export const postRecord = async (data: any, formId?: number) => {
  try {
    const response = await ApiCall({
      headers: {
        'X-Greenlab-App': `${window.sessionStorage.getItem('greenlab_app_name')}`,
      },
      baseURL: `${getApiUrl()}/forma/form/${data.formId || formId!}/record`,
      method: 'POST',
      data,
    });
    return response;
  } catch(error: any) {
    console.log(error);
  }
}

export const saveLocal = (formId: number, couponName: string, country: string, data: any) => {
  const dbLocalName = `__coupon_${couponName}_${country}`.toLowerCase();
  let dbLocal = window.localStorage.getItem(dbLocalName) || [];

  if(typeof dbLocal === 'string') {
    dbLocal = JSON.parse(dbLocal);
  }

  const txnDate = new Date(data.txnDate);

  (dbLocal as any).push({
    formId,
    id: txnDate.getTime(),
    date: `${txnDate.getDate()}/${txnDate.getMonth()+1}/${txnDate.getFullYear()} ${txnDate.getHours()}:${txnDate.getMinutes()}:${txnDate.getSeconds()}`,
    synced: false,
    data,
  });

  window.localStorage.setItem(dbLocalName, JSON.stringify(dbLocal));
}

/**
 *
 * @param couponName
 * @param country
 * @returns
 */
export const getLocal = (couponName: string, country: string): Array<any> => {
  const dbLocalName = `__coupon_${couponName}_${country}`.toLowerCase();
  let dbLocal = window.localStorage.getItem(dbLocalName) || [];

  if(typeof dbLocal === 'string') {
    return JSON.parse(dbLocal);
  }

  return dbLocal as Array<any>;
}

/**
 * This function syncs all non-synced records from local.
 * @param formId ForMa ID
 * @param couponName Coupon Name
 * @param country Country
 * @returns
 */
export const syncLocal = async (couponName: string, country: string):Promise<any> => {
  let dbLocal = getLocal(couponName, country);
  const filteredDbLocal = dbLocal.map(data => !data.synced ? data : null);

  return await Promise.all(
    filteredDbLocal.map(data => data ? postRecord(data.data, data.formId) : "")
  ).then(response => {
    response.map((item: any, idx: number) => {
      let filteredItem = filteredDbLocal[idx];

      if(item.error === true) {
        console.log(`${filteredItem.id} cannot be synced`);
      } else {
        if(filteredItem) {
          console.log(`${filteredItem.id} synced correctly.`);
          filteredItem.synced = true;
          dbLocal = dbLocal.map((item: any) => item.id === filteredItem.id ? filteredItem : item)
        }
      }

      const dbLocalName = `__coupon_${couponName}_${country}`.toLowerCase();
      window.localStorage.setItem(dbLocalName, JSON.stringify(dbLocal));
    });
    return dbLocal;
  });
}
