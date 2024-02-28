import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { FormContext } from '../context';
import { reducer, initialState, ContextActionType } from './reducer';
import { IPaymentData, IUserData, OnChangeEvent, ParamsType } from 'greenpeace';
import { AppContext } from '../../App/context';

export type IdentificationType = {
  type: string;
  value: string;
  validator: {
    expression: RegExp;
  };
  placeholder: string;
};

export type CardType = {
  text: string;
  slug: string;
  value: number;
  validator: {
    card_number: {
      expression: RegExp;
    };
    card_security_code: {
      expression: RegExp;
    };
  };
};

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
  identificationType?: IdentificationType | null,
  cardType?: CardType | null,
  dispatch: any;
  dispatchFormErrors: React.Dispatch<ContextActionType>;
  onChangeHandler: (evt: OnChangeEvent) => void;
  onUpdateFieldHandler: (fieldName: string, isValid: boolean, value: any) => void;
}

interface IProps {
  children: React.ReactNode | HTMLAllCollection;
}

const Context = createContext({} as IContext);
Context.displayName = 'CheckoutFormContext';
const { Provider, Consumer } = Context;

const ContextProvider: React.FunctionComponent<IProps> = ({ children }) => {
  const { appData } = useContext(AppContext);
  const { data: { payment, user }, params, dispatch } = useContext(FormContext);
  const [{ submitting, submitted, allowNext, error, errorDate, attemps }, dispatchFormErrors ] = useReducer(reducer, initialState);
  const [identificationType, setIdentificationType] = useState<IdentificationType | null>();
  const [cardType, setCardType] = useState<CardType | null>();

  const onChangeHandler = useCallback((evt: OnChangeEvent) => {
    evt.preventDefault();
    dispatch({
      type: 'UPDATE_PAYMENT_DATA',
      payload: { [ evt.currentTarget.name ]: evt.currentTarget.value }
    });
  }, [ dispatch ]);

  const onUpdateFieldHandler = useCallback((fieldName: string, isValid: boolean, value: any) => {
    dispatchFormErrors({
      type: 'UPDATE_FIELD_ERRORS',
      payload: {
        fieldName,
        isValid,
      }
    });
  }, []);

  useEffect(() => {
    setIdentificationType(
      appData.settings.general.form_fields.registration.identification_types.values.find(
        (d: {type: string, value: string}) => d.type === payment.docType
      ));
  }, [appData, payment.docType]);
  
  useEffect(() => {
    if(payment.cardType) {
      setCardType(
        appData.settings.general.form_fields.checkout.card_types.values.find(
          (c: CardType) => `${c.value}` === payment.cardType
        )
      );
    }
  }, [appData, payment.cardType, cardType]);

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
        identificationType,
        cardType,
        dispatch,
        dispatchFormErrors,
        onChangeHandler,
        onUpdateFieldHandler,
      }}>
        {children}
      </Provider>
  ), [
    appData,
    cardType,
    submitted,
    submitting,
    allowNext,
    error,
    errorDate,
    attemps,
    payment,
    user,
    params,
    identificationType,
    dispatch,
    dispatchFormErrors,
    onChangeHandler,
    onUpdateFieldHandler,
  ]);
};

export {
  ContextProvider as CheckoutFormProvider,
  Consumer as CheckoutFormConsumer,
  Context as CheckoutFormContext,
};
