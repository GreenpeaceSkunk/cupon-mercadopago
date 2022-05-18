import React, { useMemo, lazy, Suspense, useContext, useEffect } from 'react';
import Elements from '../Shared/Elements';
import { Loader } from '../Shared';
import { css } from 'styled-components';
import ErrorBoundary from '../ErrorBoundary';
import { AppContext } from './context';
import { getDesignVersion } from '../../utils';

const Home = lazy(() => import(`../v${getDesignVersion()}/Home`)); 

const Component: React.FunctionComponent<{}> = () => {
  const { appData } = useContext(AppContext);

  return useMemo(() => (
    <Elements.View
      customCss={css`
        display: flex;
        flex-direction: column;
        width: 100vw; 
        overflow-x: hidden;
        `}
      >
        {appData && (
          <ErrorBoundary fallback='App Error.'>
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          </ErrorBoundary>
        )}
      </Elements.View>
  ), [ appData ]);
};

Component.displayName = 'App';
export default Component;
