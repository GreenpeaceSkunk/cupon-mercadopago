import React, { createContext, useEffect, useMemo, useReducer } from 'react';
import { ContextActionType, initialState, reducer } from './reducer';
import { IData, ParamsType } from 'greenpeace';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import useQuery from '../../hooks/useQuery';

export interface IContext {
  data: IData;
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
  const [{ data }, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const params = useParams<ParamsType>();
  const { searchParams } = useQuery();
  
  // useEffect(() => {
  //   if(params) {
  //     console.log('subscribe')
  //     navigate({
  //       pathname: generatePath(`/:couponType/forms/subscribe`, {
  //         couponType: params.couponType,
  //       }),
  //       search: `${searchParams}`,
  //     }, { replace: true });
  //   }
  // }, [
  //   searchParams,
  //   params,
  // ]);

  return useMemo(() => (
    <Provider
      value={{
        data,
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
