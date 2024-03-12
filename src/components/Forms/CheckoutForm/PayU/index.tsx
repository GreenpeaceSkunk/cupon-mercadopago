import React, {useMemo} from 'react';

const Component: React.FunctionComponent<{}> = () => {
  return useMemo(() => (
    <>
      PayU checkout form
      <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/PayU.svg/1200px-PayU.svg.png'/>
    </>
  ), []);
}

Component.displayName = 'PayUCheckoutForm';
export default Component;
