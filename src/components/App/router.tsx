import React, { Suspense, lazy, memo, useMemo, useCallback, useEffect } from 'react';
import { generatePath, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router';
import { Loader } from '../Shared';
import { AppProvider } from './context';

const App = lazy(() => import('.'));

const Component: React.FunctionComponent<{}> = memo(() => {
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const history = useHistory();

  const validateCouponType = useCallback(() => {
    let isValid = true;
    const paths = pathname.split('/').filter((v) => v !== '');
    if(!paths.length) {
      isValid = false;
    } else {
      if(paths[0] !== 'regular' && paths[0] !== 'oneoff') {
        isValid = false;
      }
    }
    if(!isValid) {
      history.push(generatePath(`/:couponType`, {
        couponType: 'regular',
      }));
    }
  }, [
    path,
    pathname,
  ]);

  useEffect(() => {
    validateCouponType();
  }, []);
  
  return useMemo(() => (
    <AppProvider>
      <Switch>
        <Route path={`${path}:couponType`}>
          <Suspense fallback={<Loader />}>
            <App />
          </Suspense>
        </Route>
      </Switch>
    </AppProvider>

  ), [
    path,
    pathname,
  ]);
});

Component.displayName = 'AppRouter';
export default Component;
