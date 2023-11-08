import React, { lazy, Suspense } from 'react';
import { CheckoutFormProvider } from '../../../Forms/CheckoutForm/context';
import { getPaymentGateway } from '../../../../utils';

const LazyCheckoutForm = lazy(() => {
  return (getPaymentGateway())
    ? import('../../../Forms/CheckoutForm/MPSecurityFieldsForm')
    : import('../../../Forms/CheckoutForm')
}); 

const Component: React.FunctionComponent<{}> = () => {
  return (
    <CheckoutFormProvider>
      <Suspense fallback={<div>Cargando formulario</div>}>
        <LazyCheckoutForm />
      </Suspense>
    </CheckoutFormProvider>
  );
};

Component.displayName = 'CheckoutForm';
export default Component;
