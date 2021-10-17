import React, { createContext, useEffect, useMemo, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import useQuery from "../../hooks/useQuery";
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../../theme/globalStyle';
import Theme from '../../theme/Theme';
import ErrorBoundary from '../ErrorBoundary';

interface IContext {
  refParam: string;
  queryParams: URLSearchParams;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IProps {
  children: React.ReactNode | HTMLAllCollection;
}

const Context = createContext({} as IContext);
Context.displayName = 'AppContext';
const { Provider, Consumer } = Context;

const ContextProvider: React.FunctionComponent<IProps & RouteComponentProps> = ({ children }) => {
  const [ refParam, setRefParam ] = useState<string>(`${process.env.REACT_APP_DEFAULT_REF_PARAM}`);
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const queryParams = useQuery();
  
  useEffect(() => {
    if(queryParams) {
      if(queryParams.get('ref')) {
        setRefParam(queryParams.get('ref') || `${process.env.REACT_APP_DEFAULT_REF_PARAM}`);
      }
    }
  }, [
    queryParams,
  ])

  return useMemo(() => (
    <Provider value={{
      refParam,
      queryParams,
      isOpen,
      setIsOpen,
    }}>
      <ThemeProvider theme={Theme}>
        <GlobalStyle />
        <ErrorBoundary>
          { children }
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  ), [
    refParam,
    queryParams,
    // ghostRoute,
    children,
  ]);
};

const WrappedProvider = withRouter(ContextProvider);

export {
  WrappedProvider as AppProvider,
  Consumer as AppConsumer,
  Context as AppContext,
}
