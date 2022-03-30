import { AxiosResquestError } from 'greenpeace';
import { ApiCall } from '../utils/apiCall';

// coupon-transactions-test
// Información sobre transcacciones aprobadas ó rechazadas 

export type TransactionType = {
  amount: number;
  areaCode: number;
  card: string;
  card_type: string;
  campaignId: string;
  citizenId: string;
  email: string;
  firstName: string;
  fromUrl: string;
  lastName: string;
  phoneNumber: string;
  mpDeviceId: string;
  mpPayMethodId: string;
  mpPayOptId: string;
  transactionDate: Date,
  recurrenceDay: number,
  userAgent: string,
  utm: string;
};

export const postTransaction = async (payload: TransactionType): Promise<any | AxiosResquestError> => {
  return ApiCall({
    url: `https://backoffice.greenpeace.org.ar/api/forms/save`,
    method: 'POST',
    data: {
      form_id: `${process.env.REACT_APP_TRANSACTIONS_FORM_ID}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      citizenId: payload.citizenId,
      email: payload.email,
    },
  });
};

// {
//   "form_id": 56,
//   "amount": "",
//   "areaCode": "",
//   "campaignId": "",
//   "citizenId": "",
//   "email": "",
//   "firstName": "",
//   "fromUrl": "",
//   "lastName": "",
//   "phoneNumber": "",
//   "mpDeviceId": "",
//   "mpPayMethodId": "",
//   "mpPayOptId": "",
//   "transactionDate": "",
//   "recurrenceDay": "",
//   "userAgent": "",
//   "utm": ""
// }
