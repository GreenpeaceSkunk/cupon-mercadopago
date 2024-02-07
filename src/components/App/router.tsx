import React, { Suspense, lazy, memo, useMemo, useEffect } from 'react';
import { generatePath, useNavigate, useLocation, useParams, Outlet } from 'react-router';
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from '../Shared';
import useQuery from '../../hooks/useQuery';
import { getDesignVersion } from '../../utils';
import useCouponType from '../../hooks/useCouponType';

const App = lazy(() => import('.'));
const Forms = lazy(() => import(`../v${DESIGN_VERSION}/Forms`));
const RegistrationForm = lazy(() => import(`../v${DESIGN_VERSION}/Forms/RegistrationForm`));
const CheckoutFormRouter = lazy(() => import('../Forms/CheckoutForm/router'));
const ThankYou = lazy(() => import(`../v${DESIGN_VERSION}/ThankYou`));

const DESIGN_VERSION = getDesignVersion();

const Component: React.FunctionComponent<{}> = memo(() => {
  const { pathname } = useLocation();
  const { searchParams } = useQuery();
  const navigate = useNavigate();
  const {couponType} = useCouponType();
  
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    if(pathname === '/' && couponType) {
      navigate({
        pathname: generatePath(':couponType/forms', { couponType }),
        search: `${searchParams}`,
      });
    } else {
      navigate({
        pathname,
        search: `${searchParams}`,
      });
    }
  }, [couponType]);

  return useMemo(() => (
    <Routes>
      <Route path=":couponType" element={<Suspense fallback={<Loader/>}><App/></Suspense>}>
        <Route path='forms' element={<Suspense fallback={<Loader/>}><Forms/></Suspense>}>
          <Route path='registration' element={<Suspense fallback={<Loader/>}><RegistrationForm/></Suspense>} />
          <Route path='checkout/*' element={<CheckoutFormRouter/>} />
          <Route path='thank-you' element={<Suspense fallback={<Loader/>}><ThankYou/></Suspense>} />
        </Route>
      </Route>
    </Routes>
  ), [
    couponType,
    pathname,
    searchParams,
    navigate,
  ]);
});

Component.displayName = 'AppRouter';
export default Component;
