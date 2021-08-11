import React, { useMemo, useEffect, lazy, Suspense, useContext } from 'react';
import { initialize as initializeTagManager, pushToDataLayer } from '../../utils/googleTagManager';
import { initialize as inititalizeAnalytics, trackPage } from '../../utils/googleAnalytics';
import { initialize as initializeFacebookPixel, trackEvent } from '../../utils/facebookPixel';
import { initialize as initializeMercadopago } from '../../utils/mercadopago';
import { initialize as initializeDataCrush } from '../../utils/dataCrush';
import { View } from '@bit/meema.ui-components.elements';
import { Loader } from '../Shared';
import { AppContext, AppProvider } from './context';
import { css } from 'styled-components';
import ErrorBoundary from '../ErrorBoundary';
/* TODO: DO NOT REMOVE */
// import { useLocation } from 'react-router-dom';

const AppRouter = lazy(() => import('./router'));

// if(process.env.NODE_ENV === 'production') {
  // initializeTagManager();
  // inititalizeAnalytics();
  // initializeFacebookPixel();
  // initializeDataCrush();
  // initializeMercadopago();
// }

const Component: React.FunctionComponent<{}> = () => {
  const { ghostRoute } = useContext(AppContext);

  /* TODO: DO NOT REMOVE */
  // const { pathname } = useLocation();

  /* TODO: DO NOT REMOVE */
  /*
  useEffect(() => {
    if(process.env.NODE_ENV === 'production') {
      trackEvent('PageView');
      pushToDataLayer('pageview');
      trackPage("", pathname, "");
    }
  }, [
    pathname,
  ]);
  */
  
  /* Only for Ghosty Router */
  useEffect(() => {
    // if(process.env.NODE_ENV === 'production') {
      console.log('Path', ghostRoute);
      trackEvent('PageView');
      pushToDataLayer('pageview');
      trackPage("", ghostRoute, "");
    // }
  }, [
    ghostRoute,
  ]);
  /** */
  
  return useMemo(() => (
    <View
      customCss={css`
        display: flex;
        flex-direction: column;
        width: 100vw;
        overflow-x: hidden;
      `}
    >
      <ErrorBoundary fallback='App Error.'>
        <Suspense fallback={<Loader />}>
          <AppRouter />
        </Suspense>
      </ErrorBoundary>
    </View>
  ), [
    // ghostRoute,
  ]);
};

Component.displayName = 'App';
export default function App() {
  return useMemo(() => (
    <AppProvider>
      <Component />
    </AppProvider>
  ), []);
};
