import React, { memo, useMemo, } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import { useLocation } from 'react-router-dom';
import Shared from '../Shared';

const SubscriptionForm = React.lazy(() => import('./SubscriptionForm'));
const CheckoutForm = React.lazy(() => import('./CheckoutForm'));
const ThankYou = React.lazy(() => import('../ThankYou'));

const Component: React.FunctionComponent<{}> = memo(() => {
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  
  return useMemo(() => (
    <Switch>
      <Route path={path}>
        <Route exact path={`${path}/subscribe`}>
          <React.Suspense fallback={<Shared.Loader />}>
            <SubscriptionForm />
          </React.Suspense>
        </Route>
        <Route exact path={`${path}/checkout`}>
          <React.Suspense fallback={<Shared.Loader />}>
            <CheckoutForm />
          </React.Suspense>
        </Route>
        <Route exact path={`${path}/thank-you`}>
          <React.Suspense fallback={<Shared.Loader />}>
            <ThankYou />
          </React.Suspense>
        </Route>
      </Route>
    </Switch>
  ), [
    path,
    pathname,
  ]);
})

Component.displayName = 'RouterForm';
export default Component;
