import React, { Suspense, lazy, memo, useMemo, } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import { Loader } from '../Shared';

const Forms = lazy(() => import('../Forms'));

const Component: React.FunctionComponent<{}> = memo(() => {
  const { path } = useRouteMatch();

  return useMemo(() => (
    <Switch>
      <Route path={`${path}/forms`}>
        <Suspense fallback={<Loader />}>
          <Forms />
        </Suspense>
      </Route>
      <Redirect from={path} to={`${path}/forms`} /> 
    </Switch>
  ), [
    path,
  ]);
})

Component.displayName = 'HomeRouter'
export default Component;
