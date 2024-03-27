import React, { Suspense, lazy, memo, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Loader } from '../../../Shared';
import useQuery from '../../../../hooks/useQuery';

const CheckoutForm = lazy(() => import('.'));

const Router: React.FunctionComponent<{}> = memo(() => {
  const { searchParams} = useQuery();

  return useMemo(() => (
    <Routes>
      <Route path='subscribe' element={<Suspense fallback={<Loader/>}><CheckoutForm/></Suspense>} />
      <Route path='*' element={<Navigate to={`subscribe${searchParams}`} />} />
    </Routes>
  ), [searchParams]);
});

Router.displayName = 'PayUCheckoutFormRouter';
export default Router;
