import React, { memo, useMemo } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import Shared from '../Shared';

const SubscriptionForm = React.lazy(() => import('./SubscriptionForm'));
const CheckoutForm = React.lazy(() => import('./CheckoutForm'));
const ThankYou = React.lazy(() => import('../ThankYou'));

const Component: React.FunctionComponent<{}> = memo(() => {
  const { path } = useRouteMatch();
  
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
  ]);
});

Component.displayName = 'RouterForm';
export default Component;
