import React, { createContext, useCallback, useContext, useMemo, useReducer, useState } from 'react';
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
  payment: IPaymentData;
  user: IUserData;
  params: ParamsType;
  dispatch: any;
  dispatchFormErrors: React.Dispatch<ContextActionType>;
  onChangeHandler: (evt: OnChangeEvent) => void;
  onUpdateFieldHandler: (fieldName: string, isValid: boolean, value: any) => void;
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
        dispatch,
        dispatchFormErrors,
        onChangeHandler,
        onUpdateFieldHandler,
        onChangeMPSecureFields,
        onReadyMPSecureFields,
      }}>
        {children}
      </Provider>
  ), [
    submitted,
    submitting,
    allowNext,
    error,
    errorDate,
    attemps,
    payment,
    user,
    params,
    dispatch,
    dispatchFormErrors,
    onChangeHandler,
    onUpdateFieldHandler,
    onChangeMPSecureFields,
    onReadyMPSecureFields,
  ]);
};

export {
  ContextProvider as CheckoutFormProvider,
  Consumer as CheckoutFormConsumer,
  Context as CheckoutFormContext,
}
