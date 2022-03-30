import React, { createContext, useMemo, useReducer } from 'react';
import { ContextActionType, initialState, reducer } from './reducer';
import { IData, ParamsType } from 'greenpeace';
import { useParams } from 'react-router-dom';

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
  const params = useParams<ParamsType>();

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
