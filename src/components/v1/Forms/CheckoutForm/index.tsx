import React, { lazy, Suspense, useContext, useMemo } from 'react';
import { CheckoutFormProvider } from '../../../Forms/CheckoutForm/context';
import { AppContext } from '../../../App/context';

const Component: React.FunctionComponent<{}> = () => {
  const {appData} = useContext(AppContext);

  const LazyCheckoutForm = lazy(() => {
    return (appData.features.payment_gateway.enabled)
      ? import('../../../Forms/Mercadopago')
      : import('../../../Forms/CheckoutForm')
  });

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
