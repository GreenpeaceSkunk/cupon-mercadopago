import React, { createContext, useEffect, useMemo, useReducer, useState } from "react";
import useQuery from "../../hooks/useQuery";
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../../theme/globalStyle';
import ErrorBoundary from '../ErrorBoundary';
import Elements from '@bit/meema.ui-components.elements';
import { getCoupon } from "../../services/greenlab";
import { getDesignVersion } from "../../utils";
import { initialState, reducer } from './reducer';
import { initialize as initializeTagManager, pushToDataLayer } from '../../utils/googleTagManager';
import { initialize as initializeFacebookPixel, trackEvent } from '../../utils/facebookPixel';
import { initialize as initializeMercadopago } from '../../utils/mercadopago';
import { initialize as inititalizeAnalytics } from '../../utils/googleAnalytics';
import { initialize as initializeHotjar } from '../../utils/hotjar';
import { initialize as initializeHubspot } from '../../utils/hubspot';
import { Loader } from "../Shared";

import ThemeV1 from '../../theme/v1/Theme';
import ThemeV2 from '../../theme/v2/Theme';

interface IContext {
  urlSearchParams: URLSearchParams;
  isOpen: boolean;
  appData: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IProps {
  children?: React.ReactNode | HTMLAllCollection | any;
}

const Context = createContext({} as IContext);
Context.displayName = 'AppContext';
const { Provider, Consumer } = Context;

const ContextProvider: React.FunctionComponent<IProps> = ({ children }) => {
  const [{ appData }, dispatch ] = useReducer(reducer, initialState);
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const { urlSearchParams } = useQuery();
  const [ appName, setAppName ] = useState<string | null>(null);
  const [ designVersion, setDesignVersion ] = useState<number | null>(null);
  const [ router, setRouter ] = useState<any>(<Loader />);

  useEffect(() => {
    window.sessionStorage.removeItem('greenlab_app_name');
    window.sessionStorage.removeItem('greenlab_app_design_version');
    if(appName !== null) {
      (async () => {
        const payload = await getCoupon(appName) as any;
        if(payload) {
          window.sessionStorage.setItem('greenlab_app_name', payload.name);
          
          if(payload.features.use_design_version) {
            setDesignVersion(payload.features.use_design_version);
          } else {
            setDesignVersion(1);
          }
          
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
    if(designVersion !== null) {
      window.sessionStorage.setItem('greenlab_app_design_version', `${designVersion}`);
      (async () => {
        const Router = (await import ('./lazyRouter')).default; 
        setRouter(Router);
      })();
    }
  }, [ designVersion ]);

  useEffect(() => {
    setAppName(urlSearchParams.get('app') ? urlSearchParams.get('app') : 'general');

    if(process.env.REACT_APP_ENVIRONMENT === 'test' ||
      process.env.REACT_APP_ENVIRONMENT === 'production') {
      trackEvent('PageView');
      pushToDataLayer('pageview');
    }
  }, []);

  return useMemo(() => (
    <Provider value={{
      appData,
      urlSearchParams,
      isOpen,
      setIsOpen,
    }}>
      {!appData && !designVersion
        ? (
          <Elements.Wrapper>
            <Loader />
          </Elements.Wrapper>
        ) : (
          <ThemeProvider theme={(getDesignVersion(designVersion as number) === "2") ? ThemeV2 : ThemeV1}>
            <GlobalStyle />
            <ErrorBoundary>
              <>{router}</>
            </ErrorBoundary>
          </ThemeProvider>
        )}
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
