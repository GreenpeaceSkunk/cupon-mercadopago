import React, { createContext, useEffect, useMemo, useReducer, useState } from "react";
import useQuery from "../../hooks/useQuery";
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../../theme/globalStyle';
import ErrorBoundary from '../ErrorBoundary';
import Elements from '@bit/meema.ui-components.elements';
import { getCoupon } from "../../services/greenlab";
import { initialState, reducer } from './reducer';
import { initialize as initializeTagManager, pushToDataLayer } from '../../utils/googleTagManager';
import { initialize as initializeFacebookPixel, trackEvent } from '../../utils/facebookPixel';
import { initialize as initializeMercadopago } from '../../utils/mercadopago';
import { initialize as inititalizeAnalytics } from '../../utils/googleAnalytics';
// import { initialize as initializeHotjar } from '../../utils/hotjar';
import { initialize as initializeHubspot } from '../../utils/hubspot';
import { Loader } from "../Shared";

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
  const [ appName, setAppName ] = useState<string | null>(null);
  const [ designVersion, setDesignVersion ] = useState<number>();
  const [ theme, setTheme ] = useState<any>();
  const [ router, setRouter ] = useState<any>(<Loader />);
  const { urlSearchParams } = useQuery();

  useEffect(() => {
    window.sessionStorage.removeItem('greenlab_app_name');
    window.sessionStorage.removeItem('greenlab_app_design_version');
    if(appName !== null) {
      (async () => {
        const payload = await getCoupon(appName) as any;
        if(payload) {
          window.sessionStorage.setItem('greenlab_app_name', payload.name);
          dispatch({
            type: 'SET_APP_DATA',
            payload,
          });
        }
      })();
    }
  }, [ appName ]);

  useEffect(() => {
    (async () => {
      if(appData) {
        if(appData.features) {

          if(appData.features.use_design_version) {
            setDesignVersion(appData.features.use_design_version);
          } else {
            setDesignVersion(1);
          }

          if(appData.features.payment_gateway.enabled) {
            window.localStorage.setItem('ENABLE_PAYMENT_GATEWAY', appData.features.payment_gateway.enabled);

            switch (appData.features.payment_gateway.third_party) {
              case 'mercadopago':
                initializeMercadopago();
                break;
              case 'transbank':
                // TODO: implement it
                alert('Transbank is not already implemented');
                break;
                case 'payu':
                  // TODO: implement it
                  alert('PayU is not already implemented');
                  break;
                  default:
                alert('Please define a `Payment Gateway`');
            }
          }
        }

        if(appData.settings) {
          document.title = appData.settings.title
            ? `${process.env.REACT_APP_ENVIRONMENT !== 'production' ? '['+process.env.REACT_APP_ENVIRONMENT+'] ' : ''}${appData.settings.title}` 
            : `Greenpeace ${appData.settings.general.country}`;

          initializeHubspot(appData.settings.tracking.hubspot.id);

          switch (process.env.REACT_APP_ENVIRONMENT) {
            case 'test':
            case 'production':
              initializeTagManager(appData.settings.tracking.google.tag_manager.id);
              inititalizeAnalytics(appData.name, appData.settings.tracking.google.analytics.tracking_id);
              initializeFacebookPixel(appData.settings.tracking.facebook.pixel_id);
              // initializeHotjar(appData.settings.tracking.hotjar.id, appData.settings.tracking.hotjar.sv);
              break;
          }
        }
      }
    })();
  }, [ appData ]);

  useEffect(() => {
    if(designVersion) {
      window.sessionStorage.setItem('greenlab_app_design_version', `${designVersion}`);
      (async () => {
        setTheme((await import (`../../theme/v${designVersion}/Theme`)).default);
        setRouter((await import ('./lazyRouter')).default);
      })();
    }
  }, [ designVersion ]);

  useEffect(() => {
    setAppName(urlSearchParams.get('app') ? urlSearchParams.get('app') : 'general');
    window.localStorage.removeItem('ENABLE_PAYMENT_GATEWAY');

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
      {(!appData || !designVersion || !theme)
        ? (
          <Elements.Wrapper>
            <Loader />
          </Elements.Wrapper>
        ) : <>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <ErrorBoundary>
              <>{router}</>
            </ErrorBoundary>
          </ThemeProvider>

        </>}
    </Provider>
  ), [
    appData,
    urlSearchParams,
    isOpen,
    theme,
    designVersion,
    children,
  ]);
};

export {
  ContextProvider as AppProvider,
  Consumer as AppConsumer,
  Context as AppContext,
}

