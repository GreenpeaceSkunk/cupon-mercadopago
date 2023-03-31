import React from 'react';
import { CheckoutFormProvider } from '../../../Forms/CheckoutForm/context';
import MPSecurityFieldsForm from '../../../Forms/CheckoutForm/MPSecurityFieldsForm';

const Component: React.FunctionComponent<{}> = () => {
  return (
    <CheckoutFormProvider>
      <MPSecurityFieldsForm />
    </CheckoutFormProvider>
  );
};

Component.displayName = 'CheckoutForm';
export default Component;
