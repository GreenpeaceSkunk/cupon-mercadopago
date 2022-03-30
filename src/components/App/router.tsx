import React, { Suspense, lazy, memo, useMemo, /*useCallback,*/ useEffect } from 'react';
import { generatePath, /*Route, Routes,*/ useNavigate, useLocation, /*useRouteMatch*/ } from 'react-router';
import { Routes, Route } from "react-router-dom";
import { Loader } from '../Shared';
import { AppProvider } from './context';
import useQuery from '../../hooks/useQuery';
// import { FormProvider } from '../Forms/context';

const Forms = React.lazy(() => import('../Forms'));
const SubscriptionForm = React.lazy(() => import('../Forms/SubscriptionForm'));
const CheckoutForm = React.lazy(() => import('../Forms/CheckoutForm'));
const ThankYou = React.lazy(() => import('../ThankYou'));

const App = lazy(() => import('.'));

const Component: React.FunctionComponent<{}> = memo(() => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { searchParams } = useQuery();

  useEffect(() => {
    let isValid = true;
    const paths = pathname.split('/').filter((v) => v !== '');
    if(!paths.length) {
      isValid = false;
    } else {
      if(paths[0] !== 'regular' && paths[0] !== 'oneoff') {
        isValid = false;
      }
    }
    if(!isValid) {
    }
    navigate({
      pathname: generatePath(`:couponType/forms`, {
        couponType: 'regular',
      }),
      search: `${searchParams}`,
    });
  }, []);
  
  return useMemo(() => (
    <AppProvider>
      <Routes>
        <Route path=":couponType" element={<Suspense fallback={<Loader/>}><App/></Suspense>}>
          <Route path='forms' element={<Suspense fallback={<Loader/>}><Forms/></Suspense>}>
            <Route path='registration' element={<Suspense fallback={<Loader/>}><SubscriptionForm/></Suspense>} />
            <Route path='checkout' element={<Suspense fallback={<Loader/>}><CheckoutForm/></Suspense>} />
          </Route>
          <Route path='thankyou' element={<Suspense fallback={<Loader/>}><ThankYou/></Suspense>} />
        </Route>
      </Routes>
    </AppProvider>
  ), []);
});

Component.displayName = 'AppRouter';
export default Component;
