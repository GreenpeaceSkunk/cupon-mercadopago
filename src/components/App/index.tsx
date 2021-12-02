import React, { useMemo, lazy, Suspense, useEffect } from 'react';
import { initialize as initializeTagManager, pushToDataLayer } from '../../utils/googleTagManager';
import { initialize as initializeFacebookPixel, trackEvent } from '../../utils/facebookPixel';
import { initialize as initializeMercadopago } from '../../utils/mercadopago';
import { initialize as initializeDataCrush } from '../../utils/dataCrush';
import { initialize as inititalizeAnalytics } from '../../utils/googleAnalytics';
import { initialize as initializeHotjar } from '../../utils/hotjar';
import Elements from '../Shared/Elements';
import { Loader } from '../Shared';
import { css } from 'styled-components';
import ErrorBoundary from '../ErrorBoundary';
import { useLocation } from 'react-router';

const Home = lazy(() => import('../Home'));

if(process.env.REACT_APP_ENVIRONMENT === 'production') {
  initializeTagManager();
  inititalizeAnalytics();
  initializeFacebookPixel();
  initializeDataCrush();
  initializeHotjar();
}

if(process.env.REACT_APP_ENVIRONMENT === 'test' || process.env.REACT_APP_ENVIRONMENT === 'production') {
  initializeMercadopago();
}

const Component: React.FunctionComponent<{}> = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if(process.env.REACT_APP_ENVIRONMENT === 'production') {
      trackEvent('PageView');
      pushToDataLayer('pageview');
    }
  }, [
    pathname,
  ]);

  return useMemo(() => (
    <Elements.View
      customCss={css`
        display: flex;
        flex-direction: column;
        width: 100vw;
        overflow-x: hidden;
      `}
    >
      <ErrorBoundary fallback='App Error.'>
        <Suspense fallback={<Loader />}>
          <Home />
        </Suspense>
      </ErrorBoundary>
    </Elements.View>
  ), []);
};

Component.displayName = 'App';
export default Component;
