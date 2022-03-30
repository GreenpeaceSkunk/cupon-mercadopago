import React, { memo, useMemo } from 'react';
// import { Route, Switch, useRouteMatch } from 'react-router';
import {
  Routes,
  Route,
} from "react-router-dom";
import Shared from '../Shared';

const SubscriptionForm = React.lazy(() => import('./SubscriptionForm'));
const CheckoutForm = React.lazy(() => import('./CheckoutForm'));
const ThankYou = React.lazy(() => import('../ThankYou'));

const Component: React.FunctionComponent<{}> = memo(() => {
  // const { path } = useRouteMatch();
  console.log('Forms')
  return useMemo(() => (
    <Routes>
      <Route path='/'>
        <Route path={`/subscribe`}>
          <React.Suspense fallback={<Shared.Loader />}>
            <SubscriptionForm />
          </React.Suspense>
        </Route>
        <Route path={`/checkout`}>
          <React.Suspense fallback={<Shared.Loader />}>
            <CheckoutForm />
          </React.Suspense>
        </Route>
        <Route path={`/thank-you`}>
          <React.Suspense fallback={<Shared.Loader />}>
            <ThankYou />
          </React.Suspense>
        </Route>
      </Route>
    </Routes>
  ), [
    // path,
  ]);
});

Component.displayName = 'RouterForm';
export default Component;
