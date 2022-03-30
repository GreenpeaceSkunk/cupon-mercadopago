import React, { Suspense, lazy, memo, useMemo, useEffect } from 'react';
import { generatePath, useNavigate, useLocation } from 'react-router';
import { Routes, Route } from "react-router-dom";
import { Loader } from '../Shared';
import { AppProvider } from './context';
import useQuery from '../../hooks/useQuery';

const Forms = React.lazy(() => import('../Forms'));
const RegistrationForm = React.lazy(() => import('../Forms/RegistrationForm'));
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
            <Route path='registration' element={<Suspense fallback={<Loader/>}><RegistrationForm/></Suspense>} />
            <Route path='checkout' element={<Suspense fallback={<Loader/>}><CheckoutForm/></Suspense>} />
            <Route path='thankyou' element={<Suspense fallback={<Loader/>}><ThankYou/></Suspense>} />
          </Route>
        </Route>
      </Routes>
    </AppProvider>
  ), []);
});

Component.displayName = 'AppRouter';
export default Component;
