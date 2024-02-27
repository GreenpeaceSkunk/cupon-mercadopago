import React, { Suspense, lazy, memo, useMemo } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import { Loader } from '../../../Shared';

const CheckoutForm = lazy(() => import('.'));

const Router: React.FunctionComponent<{}> = memo(() => {
  return useMemo(() => (
    <Routes>
      {/* <Route path='' element={<Suspense fallback={<Loader/>}><CheckoutForm/></Suspense>} /> */}
      <Route path='' element={<>Transbank form</>} />
      <Route path='confirm' element={<>Transbank confirm</>} />
      <Route path='*' element={<Navigate to={''} />} />
    </Routes>
  ), []);
});

Router.displayName = 'TransbankCheckoutFormRouter';
export default Router;
