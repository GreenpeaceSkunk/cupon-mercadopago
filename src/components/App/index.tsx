import React, { useMemo, lazy, Suspense, useContext, useEffect } from 'react';
// import { AppProvider } from './context';
// import AppRouter from './router';
import Elements from '../Shared/Elements';
import { Loader } from '../Shared';
import { css } from 'styled-components';
import ErrorBoundary from '../ErrorBoundary';
import { AppContext } from './context';
import { getDesignVersion } from '../../utils';
// import { getDesignVersion } from '../../utils';

// console.log('Import Home:', getDesignVersion());
// const HomeWrapper = lazy(() => import(`../Home`));
const Home = lazy(() => import(`../v${getDesignVersion()}/Home`)); 
// const AppRouter = lazy(() => import(`./router`)); 
// console.log('Import Home:', getDesignVersion());

function Loading() {
  return <div>Loading</div>;
}

const Component: React.FunctionComponent<{}> = () => {
  const { appData } = useContext(AppContext);
  // const [ router, setRouter ] = useState<any>(null);
  // const [ home, setHome ] = useState<any>(Loading);

  useEffect(() => {
    if(appData) {
      (async () => {
        // setRouter((await import ('./router')).default);
        //   setHome((await import ('../Home')).default);
      })();
    }
  }, [ appData ]);

  return useMemo(() => (
    <Elements.View
      customCss={css`
        display: flex;
        flex-direction: column;
        width: 100vw; 
        overflow-x: hidden;
        `}
      >
        {/* <>Router: {router && React.cloneElement(router, {})}</> */}
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
