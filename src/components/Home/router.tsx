import React, { Suspense, lazy, memo, useMemo, } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import { Loader } from '../Shared';

const FormsRouter = lazy(() => import('../Form/router'));
const TahnkYouRouter = lazy(() => import('../ThankYou/router'));


const Component: React.FunctionComponent<{}> = memo(() => {
  const { path } = useRouteMatch();
  
  return useMemo(() => (
    <Switch>
      <Route exact path={`/thank-you`}>
        <Suspense fallback={<Loader />}>
          <TahnkYouRouter />
        </Suspense>
      </Route>
      <Route path={`/form`}>
        <Suspense fallback={<Loader />}>
          <FormsRouter />
        </Suspense>
      </Route>
      <Redirect exact from={path} to='/form' /> 
    </Switch>
  ), [
    path,
  ]);
})

Component.displayName = 'HomeRouter'
export default Component;
