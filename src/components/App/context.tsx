import React, { createContext, useEffect, useMemo, useReducer, useState } from "react";
import { RouteComponentProps, useLocation, useHistory, withRouter } from "react-router-dom";
import useQuery from "../../hooks/useQuery";
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../../theme/globalStyle';
import Theme from '../../theme/Theme';
import ErrorBoundary from '../ErrorBoundary';
import { getCoupon } from "../../utils/greenlabApi";
import { initialState, reducer } from './reducer';
import { initialize as initializeTagManager, pushToDataLayer } from '../../utils/googleTagManager';
import { initialize as initializeFacebookPixel, trackEvent } from '../../utils/facebookPixel';
import { initialize as initializeMercadopago } from '../../utils/mercadopago';
import { initialize as inititalizeAnalytics } from '../../utils/googleAnalytics';
import { initialize as initializeHotjar } from '../../utils/hotjar';

interface IContext {
  urlSearchParams: URLSearchParams;
  isOpen: boolean;
  appData: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IProps {
  children: React.ReactNode | HTMLAllCollection;
}

const Context = createContext({} as IContext);
Context.displayName = 'AppContext';
const { Provider, Consumer } = Context;

const ContextProvider: React.FunctionComponent<IProps & RouteComponentProps> = ({ children }) => {
  const [{ appData }, dispatch ] = useReducer(reducer, initialState);
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const { searchParams, urlSearchParams } = useQuery();
  const location = useLocation();
  const history = useHistory();
  const [ appName, setAppName ] = useState<string | null>(null);

  useEffect(() => {
    if(appName !== null) {
      (async () => {
        const payload = await getCoupon(appName) as any;
        if(payload) {
          window.sessionStorage.setItem('greenlab_app', payload.name)
          dispatch({
            type: 'SET_APP_DATA',
            payload,
          });
        }
      })();
    }
  }, [ appName ]);

  useEffect(() => {
    if(appData) {
      document.title = appData.settings.title 
        ? `${process.env.REACT_APP_ENVIRONMENT !== 'production' ? '['+process.env.REACT_APP_ENVIRONMENT+'] ' : ''}${appData.settings.title}` 
        : 'Greenpeace Argentina';

      switch (process.env.REACT_APP_ENVIRONMENT) {
        case 'test':
          initializeMercadopago();
        break;
        case 'production':
          initializeTagManager(appData.settings.tracking.google.tag_manager.id);
          inititalizeAnalytics(appData.name, appData.settings.tracking.google.analytics.tracking_id);
          initializeFacebookPixel(appData.settings.tracking.facebook.pixel_id);
          initializeHotjar(appData.settings.tracking.hotjar.id, appData.settings.tracking.hotjar.sv);
          initializeMercadopago();
          break;
      }
    }
  }, [ appData ]);

  useEffect(() => {
    if(process.env.REACT_APP_ENVIRONMENT === 'production') {
      trackEvent('PageView');
      pushToDataLayer('pageview');
    }
  }, [ location.pathname ]);

  
  useEffect(() => {
    if(urlSearchParams) {
      history.replace({
        pathname: location.pathname,
        search: searchParams,
      });
    }
  }, [
    history,
    location.pathname,
    searchParams,
  ]);

  useEffect(() => {
    setAppName(urlSearchParams.get('app') ? urlSearchParams.get('app') : 'general')
  }, [ ])

  return useMemo(() => (
    <Provider value={{
      appData,
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
    appData,
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
