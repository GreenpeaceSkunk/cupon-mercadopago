import React, { Suspense, lazy, memo, useMemo, useEffect } from 'react';
import { generatePath, useNavigate, useLocation } from 'react-router';
import { Routes, Route } from "react-router-dom";
import { Loader } from '../Shared';
import useQuery from '../../hooks/useQuery';
import { getDesignVersion } from '../../utils';

const DESIGN_VERSION = getDesignVersion();
const App = lazy(() => import('.'));
const Forms = lazy(() => import(`../v${DESIGN_VERSION}/Forms`));
const RegistrationForm = lazy(() => import(`../v${DESIGN_VERSION}/Forms/RegistrationForm`));
const CheckoutForm = lazy(() => import(`../v${DESIGN_VERSION}/Forms/CheckoutForm`));
const ThankYou = lazy(() => import(`../v${DESIGN_VERSION}/ThankYou`));

const Component: React.FunctionComponent<{}> = memo(() => {
  const { pathname } = useLocation();
  const { searchParams } = useQuery();
  const navigate = useNavigate();

  useEffect(() => {
    const paths = pathname.split('/').filter((v) => v !== '');
      
    navigate({
      pathname: generatePath(`:couponType/forms`, {
        couponType: (paths[0] !== 'regular' && paths[0] !== 'oneoff' || !paths.length) ? 'regular' : paths[0],
      }),
      search: `${searchParams}`,
    });

  }, []);
  
  return useMemo(() => (
    <Routes>
      <Route path=":couponType" element={<Suspense fallback={<Loader/>}><App/></Suspense>}>
        <Route path='forms' element={<Suspense fallback={<Loader/>}><Forms/></Suspense>}>
          <Route path='registration' element={<Suspense fallback={<Loader/>}><RegistrationForm/></Suspense>} />
          <Route path='checkout' element={<Suspense fallback={<Loader/>}><CheckoutForm/></Suspense>} />
          <Route path='thank-you' element={<Suspense fallback={<Loader/>}><ThankYou/></Suspense>} />
        </Route>
      </Route>
    </Routes>
  ), [
    pathname,
    searchParams,
    navigate,
  ]);
});

Component.displayName = 'AppRouter';
export default Component;
