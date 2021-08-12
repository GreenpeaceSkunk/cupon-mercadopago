import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { /*generatePath,*/ /*useRouteMatch*/ } from 'react-router';
import { /*useParams,*/ /*useHistory*/ } from 'react-router';
import { ContextActionType, initialState, reducer } from './reducer';
import { IData } from 'greenpeace';
import { AppContext } from '../App/context';

export type FormComponentsType = {
  Component: React.LazyExoticComponent<React.FunctionComponent>,
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
  // step: string;
  step: number;
  Forms: {[key: string]: FormComponentsType};
  dispatch: (action: ContextActionType) => void;
  goNext: () => void;
}
interface IProps {
  children: React.ReactNode | HTMLAllCollection;
}

const Context = createContext({} as IContext);
Context.displayName = 'FormContext';
const { Provider, Consumer } = Context;

const ContextProvider: React.FunctionComponent<IProps> = ({ children }) => {
  const [{ data, }, dispatch] = useReducer(reducer, initialState);
  // const history = useHistory();
  // const routeMatch = useRouteMatch();
  // const { step } = useParams<{ step: string }>();
  const [ step, setStep ] = useState<number>(1);
  const { setGhostRouter } = useContext(AppContext);

  const goNext = useCallback(() => {
    console.log('Go next')
    // if((parseInt(step) + 1) <= Object.keys(Forms).length) {
    //   history.push(generatePath(routeMatch.path, { step: parseInt(step) + 1 }));
    // } else {
    //   history.push('/thank-you');
    // }

    // Used only for Data Crush Router
    // if((step + 1) <= Object.keys(Forms).length) {
    //   setStep(step + 1);
    // }
    setStep(step + 1);
  }, [
    step,
    // routeMatch,
    // history,
  ]);

  useEffect(() => {
    if((step - 1) < Object.keys(Forms).length) {
      setGhostRouter(Object.values(Forms)[step - 1].route);
    }
  }, [
    step,
    setGhostRouter,
  ])

  return useMemo(() => (
    <Provider 
      value={{
        data,
        step,
        Forms,
        goNext,
        dispatch,
      }}>
        {children}
      </Provider>
  ), [
    data,
    step,
    children,
    // setGhostRouter,
    dispatch,
    goNext,
  ]);
};

export {
  ContextProvider as FormProvider,
  Consumer as FormConsumer,
  Context as FormContext,
}
