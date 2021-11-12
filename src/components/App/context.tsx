import React, { createContext, useEffect, useMemo, useState } from "react";
import { RouteComponentProps, useLocation, useHistory, withRouter } from "react-router-dom";
import useQuery from "../../hooks/useQuery";
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../../theme/globalStyle';
import Theme from '../../theme/Theme';
import ErrorBoundary from '../ErrorBoundary';

interface IContext {
  // refParam: string;
  urlSearchParams: URLSearchParams;
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
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const { searchParams, urlSearchParams } = useQuery();
  const location = useLocation();
  const history = useHistory();
  
  useEffect(() => {
    if(urlSearchParams) {
      if(!urlSearchParams.get('ref')) {
        history.replace({
          pathname: location.pathname,
          search: `?ref=${`${process.env.REACT_APP_DEFAULT_REF_PARAM}`}${searchParams.replace('?', '&')}`,
        })
      }
    }
  }, [
    urlSearchParams,
    history,
    location.pathname,
    searchParams,
  ])

  return useMemo(() => (
    <Provider value={{
      urlSearchParams,
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
    urlSearchParams,
    isOpen,
    children,
  ]);
};


const WrappedProvider = withRouter(ContextProvider);

export {
  WrappedProvider as AppProvider,
  Consumer as AppConsumer,
  Context as AppContext,
}
