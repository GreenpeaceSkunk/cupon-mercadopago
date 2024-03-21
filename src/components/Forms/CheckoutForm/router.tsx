import React, { Suspense, lazy, memo, useMemo, useContext } from 'react';
import { Navigate, Route, Routes, useLocation} from 'react-router';
import { Loader } from '../../Shared';
import { getDesignVersion } from '../../../utils';
import { AppContext } from '../../App/context';
import useQuery from '../../../hooks/useQuery';
import { CheckoutFormProvider } from './context';

const DESIGN_VERSION = getDesignVersion();
const OfflineCheckoutForm = lazy(() => import(`../../v${DESIGN_VERSION}/Forms/CheckoutForm`));
const MercadopagoCheckoutFormRouter = lazy(() => import('./Mercadopago/router'));
const TransbankCheckoutFormRouter = lazy(() => import('./Transbank/router'));

const Router: React.FunctionComponent<{}> = memo(() => {
  const {appData} = useContext(AppContext);
  const {pathname} = useLocation();
  const { searchParams } = useQuery();

  return useMemo(() => (
    <Routes>
      <Route path='mercadopago' element={<Suspense fallback={<Loader/>}><MercadopagoCheckoutFormRouter/></Suspense>} />
      <Route path='transbank/*' element={<Suspense fallback={<Loader/>}><TransbankCheckoutFormRouter/></Suspense>} />
      <Route path='offline' element={<Suspense fallback={<Loader/>}><OfflineCheckoutForm/></Suspense>} />
      <Route path='*' element={<Navigate to={`offline${searchParams}`} />} />
    </Routes>
  ), [
    appData,
    pathname,
    searchParams,
  ]);
});

Router.displayName = 'CheckoutFormRouter';
export default () => (
  <CheckoutFormProvider>
    <Router />
  </CheckoutFormProvider>
);
