import React, { Suspense, lazy, memo, useMemo, useCallback, useEffect } from 'react';
import { generatePath, Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router';
import { Loader } from '../Shared';
import { AppProvider } from './context';
import useQuery from '../../hooks/useQuery';

const App = lazy(() => import('.'));

const Component: React.FunctionComponent<{}> = memo(() => {
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const history = useHistory();
  const { searchParams } = useQuery();

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
      history.push({
        pathname: generatePath(`/:couponType`, {
          couponType: 'regular',
        }),
        search: `${searchParams}`,
      });
    }
  }, [
    searchParams,
    pathname,
    history,
  ]);

  useEffect(() => {
    validateCouponType();
  }, [
    validateCouponType,
  ]);
  
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
  ]);
});

Component.displayName = 'AppRouter';
export default Component;
