import React, { lazy, Suspense, useContext, useMemo } from 'react';
import { CheckoutFormProvider } from '../../../Forms/CheckoutForm/context';
import { AppContext } from '../../../App/context';

const LazyCheckoutForm = lazy(() => import('../../../Forms/CheckoutForm'));

const Component: React.FunctionComponent<{}> = () => {
  const {appData} = useContext(AppContext);

  return useMemo(() => (
    <CheckoutFormProvider>
      <Suspense fallback={<div>Cargando formulario</div>}>
        <LazyCheckoutForm />
      </Suspense>
    </CheckoutFormProvider>
  ), [ appData ]);
};

Component.displayName = 'CheckoutForm';
export default Component;
