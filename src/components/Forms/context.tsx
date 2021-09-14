import React, { createContext, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { ContextActionType, initialState, reducer } from './reducer';
import { IData, ParamsType } from 'greenpeace';
import { generatePath, useHistory, useLocation, useParams } from 'react-router-dom';

export interface IFormComponent {
  formIndex?: number;
}

const paths = [
  '/form/subscribe',
  '/form/checkout',
  '/thankyou',
]

export type FormComponentsType = {
  Component: React.LazyExoticComponent<React.FunctionComponent<IFormComponent>>,
  route: string,
};

const Forms = {
  subscriptionForm: {
    Component: React.lazy(() => import('./SubscriptionForm')),
    route: 'form/user', // Used only for Data Crush Route
  },
  checkoutForm: {
    Component: React.lazy(() => import('./CheckoutForm')),
    route: 'form/checkout', // Used only for Data Crush Route
  },
  // thankYou: {
  //   Component: React.lazy(() => import('../ThankYou')),
  //   route: 'thank-you', // Used only for Data Crush Route
  // },
};

export interface IContext {
  data: IData;
  step: number;
  Forms: {[key: string]: FormComponentsType};
  params: ParamsType; 
  dispatch: (action: ContextActionType) => void;
  // goNext: () => void;
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
  const { pathname } = useLocation();
  const [ step, setStep ] = useState<number>(0);
  const params = useParams<ParamsType>();

  // const goNext = useCallback(() => {
  //   setStep(step + 1);
  // }, [
  //   step,
  // ]);

  // useEffect(() => {
  //   history.push(generatePath(`/:couponType(oneoff|regular)${paths[step]}`, {
  //     couponType,
  //   }));
  // }, [
  //   step,
  // ]);

  useEffect(() => {
    history.push(generatePath(`/:couponType/forms/subscribe`, {
      couponType: params.couponType,
    }));
  }, []);

  return useMemo(() => (
    <Provider
      value={{
        data,
        step,
        Forms,
        params,
        // goNext,
        dispatch,
      }}>
        {children}
      </Provider>
  ), [
    data,
    step,
    pathname,
    children,
    dispatch,
    // goNext,
  ]);
};

export {
  ContextProvider as FormProvider,
  Consumer as FormConsumer,
  Context as FormContext,
}
