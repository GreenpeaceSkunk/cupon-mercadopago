import React, { createContext, useEffect, useMemo, useReducer } from 'react';
import { ContextActionType, initialState, reducer } from './reducer';
import { IData, ParamsType } from 'greenpeace';
import { generatePath, useHistory, useParams } from 'react-router-dom';

export interface IFormComponent {
  formIndex?: number;
}

export type FormComponentsType = {
  Component: React.LazyExoticComponent<React.FunctionComponent<IFormComponent>>,
  route: string,
}

const Forms = {
  subscriptionForm: {
    Component: React.lazy(() => import('./SubscriptionForm')),
    route: 'form/user', // Used only for Data Crush Route
  },
  checkoutForm: {
    Component: React.lazy(() => import('./CheckoutForm')),
    route: 'form/checkout', // Used only for Data Crush Route
  },
};

export interface IContext {
  data: IData;
  Forms: {[key: string]: FormComponentsType};
  params: ParamsType; 
  dispatch: (action: ContextActionType) => void;
}

interface IProps {
  children: React.ReactNode | HTMLAllCollection;
}

const Context = createContext({} as IContext);
Context.displayName = 'FormContext';
const { Provider, Consumer } = Context;

const ContextProvider: React.FunctionComponent<IProps> = ({ children }) => {
  const [{ data, }, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();
  const params = useParams<ParamsType>();
  
  useEffect(() => {
    history.push(generatePath(`/:couponType/forms/subscribe`, {
      couponType: params.couponType,
    }));
  }, [
    history,
    params.couponType,
  ]);

  return useMemo(() => (
    <Provider
      value={{
        data,
        Forms,
        params,
        dispatch,
      }}>
        {children}
      </Provider>
  ), [
    data,
    params,
    children,
    dispatch,
  ]);
};

export {
  ContextProvider as FormProvider,
  Consumer as FormConsumer,
  Context as FormContext,
}
