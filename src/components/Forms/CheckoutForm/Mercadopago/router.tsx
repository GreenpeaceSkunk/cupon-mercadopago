import React, { Suspense, lazy, memo, useMemo } from 'react';
import { Route, Routes } from 'react-router';
import { Loader } from '../../../Shared';

const CheckoutForm = lazy(() => import('.'));

const Router: React.FunctionComponent<{}> = memo(() => {
  return useMemo(() => (
    <Routes>
      <Route path='' element={<Suspense fallback={<Loader/>}><CheckoutForm/></Suspense>} />
    </Routes>
  ), []);
});

Router.displayName = 'MercadopagoCheckoutFormRouter';
export default Router;
