import React, { createContext, lazy, Suspense, useEffect, useMemo, useReducer, useState } from "react";
import useQuery from "../../hooks/useQuery";
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../../theme/globalStyle';
import ErrorBoundary from '../ErrorBoundary';
import { getCoupon } from "../../services/greenlab";
import { initialState, reducer } from './reducer';
import { initialize as initializeTagManager, pushToDataLayer } from '../../utils/googleTagManager';
import { initialize as initializeFacebookPixel, trackEvent } from '../../utils/facebookPixel';
import { initialize as initializeMercadopago } from '../../utils/mercadopago';
import { initialize as inititalizeAnalytics } from '../../utils/googleAnalytics';
import { initialize as initializeHotjar } from '../../utils/hotjar';
import { initialize as initializeHubspot } from '../../utils/hubspot';

// TODO: Investigate how to load dinamically
import ThemeV1 from '../../theme/v1/Theme';
import ThemeV2 from '../../theme/v2/Theme';
// import Theme from `../../theme/v${window.localStorage.greenlab_app_design_version}/Theme`;

// const Theme = lazy(() => import(`../../theme/v${window.localStorage.greenlab_app_design_version}/Theme`));

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

const ContextProvider: React.FunctionComponent<IProps> = ({ children }) => {
  const [{ appData }, dispatch ] = useReducer(reducer, initialState);
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const { urlSearchParams } = useQuery();
  const [ appName, setAppName ] = useState<string | null>(null);

  useEffect(() => {
    if(appName !== null) {
      (async () => {
        const payload = await getCoupon(appName) as any;
        if(payload) {
          window.sessionStorage.setItem('greenlab_app_name', payload.name);
          window.sessionStorage.setItem('greenlab_app_design_version', payload.features.use_design_version ? payload.features.use_design_version : 1);
          dispatch({
            type: 'SET_APP_DATA',
            payload,
          });
        }
      })();
    }
  }, [ appName ]);

  useEffect(() => {
    if(appData && appData.settings) {
      document.title = appData.settings.title 
        ? `${process.env.REACT_APP_ENVIRONMENT !== 'production' ? '['+process.env.REACT_APP_ENVIRONMENT+'] ' : ''}${appData.settings.title}` 
        : 'Greenpeace Argentina';

      initializeHubspot(appData.settings.tracking.hubspot.id);
      initializeMercadopago();
      
      switch (process.env.REACT_APP_ENVIRONMENT) {
        case 'test':
        case 'production':
          initializeTagManager(appData.settings.tracking.google.tag_manager.id);
          inititalizeAnalytics(appData.name, appData.settings.tracking.google.analytics.tracking_id);
          initializeFacebookPixel(appData.settings.tracking.facebook.pixel_id);
          initializeHotjar(appData.settings.tracking.hotjar.id, appData.settings.tracking.hotjar.sv);
          break;
      }
    }
  }, [ appData ]);

  useEffect(() => {
    if(process.env.REACT_APP_ENVIRONMENT === 'test' ||
      process.env.REACT_APP_ENVIRONMENT === 'production') {
      trackEvent('PageView');
      pushToDataLayer('pageview');
    }
  }, []);

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
      <ThemeProvider theme={(appData && appData.features && appData.features.use_design_version === 2) ? ThemeV2 : ThemeV1}>
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

export {
  ContextProvider as AppProvider,
  Consumer as AppConsumer,
  Context as AppContext,
}
