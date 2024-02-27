import React, { useEffect, useMemo } from "react"

const Component: React.FunctionComponent<{}> = () => {
  useEffect(() => {
    console.log('Confirm payment...')
  }, []);

  return useMemo(() => (
    <>Confirm payment...</>
  ), []);
}


Component.displayName = 'TransbankConfirmPayment';
export default Component;
