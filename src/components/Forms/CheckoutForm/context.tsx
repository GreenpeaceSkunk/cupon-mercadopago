import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { setPublishableKey } from '../../../utils/mercadopago';
import { getPublicKey } from '../../../services/mercadopago';
import { FormContext } from '../context';
import { reducer, initialState, ContextActionType } from './reducer';
import { IPaymentData, IUserData, OnChangeEvent, ParamsType } from 'greenpeace';

export interface IContext {
  submitting?: boolean;
  submitted?: boolean;
  allowNext: boolean;
  attemps: number;
  error: string | null;
  errorDate: Date | null;
  mercadoPago: any;
  payment: IPaymentData;
  user: IUserData;
  params: ParamsType;
  dispatch: any;
  dispatchFormErrors: React.Dispatch<ContextActionType>;
  onChangeHandler: (evt: OnChangeEvent) => void;
  onUpdateFieldHandler: (fieldName: string, isValid: boolean, value: any) => void;
  onBinChange: ({ bin, field }: { bin: string | null, field: string })  => void;
  onChangeMPSecureFields: ({ field, errorMessages }: { field: string, errorMessages: [{ message: string, cause: string }]}) => void;
  onReadyMPSecureFields: ({ field }: { field: string}) => void;
}

interface IProps {
  children: React.ReactNode | HTMLAllCollection;
}

const Context = createContext({} as IContext);
Context.displayName = 'CheckoutFormContext';
const { Provider, Consumer } = Context;

const ContextProvider: React.FunctionComponent<IProps> = ({ children }) => {
  const [ mercadoPago, setMercadoPago ] = useState<{ fields: any, getIdentificationTypes: any } | null>(null);
  const { data: { payment, user }, params, dispatch } = useContext(FormContext);
  const [{ submitting, submitted, allowNext, error, errorDate, attemps }, dispatchFormErrors ] = useReducer(reducer, initialState);

  const onChangeHandler = useCallback((evt: OnChangeEvent) => {
    evt.preventDefault();
    dispatch({
      type: 'UPDATE_PAYMENT_DATA',
      payload: { [ evt.currentTarget.name ]: evt.currentTarget.value }
    });
  }, [
    dispatch,
  ]);

  const onUpdateFieldHandler = useCallback((fieldName: string, isValid: boolean, value: any) => {
    dispatchFormErrors({
      type: 'UPDATE_FIELD_ERRORS',
      payload: {
        fieldName,
        isValid,
      }
    });
  }, []);

  /**
   * Mercadopago fields validation (on change)
   * https://github.com/mercadopago/sdk-js/blob/main/API/fields.md
   */
  const onChangeMPSecureFields = useCallback(
    ({ field, errorMessages }: { field: string, errorMessages: [{ message: string, cause: string }]
  }) => {
    dispatchFormErrors({
      type: 'UPDATE_FIELD_ERRORS',
      payload: {
        fieldName: field,
        isValid: errorMessages.length ? false : true,
      }
    });
  }, []);

  /**
   * On bin change. Method based on secure fields.
   * Ref: https://github.com/mercadopago/sdk-js/blob/main/API/fields.md#field-instanceonevent-callback
   */
  const onBinChange = useCallback(
    ({ bin, field }: { bin: string | null, field: string }) => {
      if(bin) {
        dispatch({
          type: 'UPDATE_PAYMENT_DATA',
          payload: { [`${field}`]: bin },
        });
      }
  }, []);

  /**
   * Mercadopago fields validation (on ready)
   * https://github.com/mercadopago/sdk-js/blob/main/API/fields.md
   */
  const onReadyMPSecureFields = useCallback(({ field }: { field: string}) => {
    dispatchFormErrors({
      type: 'UPDATE_FIELD_ERRORS',
      payload: {
        fieldName: field,
        isValid: false,
      }
    });
  }, []);

  /**
   * Mercadopago fields validation (createSelectOptions)
   * https://github.com/mercadopago/sdk-js/blob/main/API/fields.md
   */
  const createSelectOptions = useCallback(
    (
      elem: any,
      options: Array<{ id: string; name: string; typer: string }>,
      labelsAndKeys = { label: "name", value: "id" }
    ) => {
      const { label, value } = labelsAndKeys;

      elem.options.length = 0;

      const tempOptions = document.createDocumentFragment();
      
      options.forEach((option: any) => {
        const optValue = option[value];
        const optLabel = option[label];

        const opt = document.createElement('option');
        opt.value = optValue;
        opt.textContent = optLabel;

        tempOptions.appendChild(opt);
      });

      elem.appendChild(tempOptions);
  }, []);

  useEffect(() => {
    (async () => {
      if(mercadoPago && mercadoPago.fields) {
        
        mercadoPago.fields
          .create('cardNumber', {
            placeholder: 'Ej. 5031 7557 3453 0604'
          })
          .on('ready',onReadyMPSecureFields)
          .on('binChange', onBinChange)
          .mount('form-checkout__cardNumber')
          
          /* This issue has been reported here https://github.com/mercadopago/sdk-js/discussions/146 */
          // .update({
          //   placeholder: '4078 2625 1269 9821',
          //   settings: {
          //     length: 16,
          //   }
          // });

        mercadoPago.fields.create('securityCode', {
          placeholder: 'Ej. 123',
        })
        .on('validityChange', onChangeMPSecureFields)
        .on('ready',onReadyMPSecureFields)
        .mount('form-checkout__securityCode');
        
        mercadoPago.fields.create('expirationDate', {
          placeholder: "MM/YY",
        })
          .on('validityChange', onChangeMPSecureFields)
          .on('ready',onReadyMPSecureFields)
          .mount('form-checkout__expirationDate');

        try {
          const identificationTypes = await mercadoPago.getIdentificationTypes();
          // createSelectOptions(refDocType.current, identificationTypes);
          createSelectOptions(document.getElementById('form-checkout__identificationType'), identificationTypes);
        } catch (e) {
          return console.error('Error getting identificationTypes: ', e);
        }
      }
    })();
  }, [ mercadoPago ]);

  useEffect(() => {
    (async () => {
      setMercadoPago(setPublishableKey(await getPublicKey()));
    })();
  }, []);

  return useMemo(() => (
    <Provider
      value={{
        submitted,
        submitting,
        allowNext,
        error,
        errorDate,
        attemps,
        payment,
        user,
        params,
        mercadoPago,
        dispatch,
        dispatchFormErrors,
        onChangeHandler,
        onUpdateFieldHandler,
        onBinChange,
        onChangeMPSecureFields,
        onReadyMPSecureFields,
      }}>
        {children}
      </Provider>
  ), [
    payment,
    user,
    params,
    mercadoPago,
    allowNext,
    error,
    dispatch,
    dispatchFormErrors,
    onChangeHandler,
    onUpdateFieldHandler,
    onBinChange,
    onChangeMPSecureFields,
    onReadyMPSecureFields,
  ]);
};

export {
  ContextProvider as CheckoutFormProvider,
  Consumer as CheckoutFormConsumer,
  Context as CheckoutFormContext,
}
