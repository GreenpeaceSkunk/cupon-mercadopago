import React, { Suspense, lazy, memo, useMemo, } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Loader } from '../Shared';

const Home = lazy(() => import('../Home'));

const Component: React.FunctionComponent<{}> = memo(() => {
  const { path } = useRouteMatch();
  
  return useMemo(() => (
    <Switch>
      <Route path={path}>
        <Suspense fallback={<Loader />}>
          <Home />
        </Suspense>
      </Route>
    </Switch>
  ), [
    path,
  ]);
})

Component.displayName = 'AppRouter'
export default Component;
