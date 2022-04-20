import React, { memo, useMemo, } from 'react';
import { Routes, Route } from "react-router-dom";
import Index from '.';

const Component: React.FunctionComponent<{}> = memo(() => {

  return useMemo(() => (
    <Routes>
      <Route path='/'>
        <Index />
      </Route>
    </Routes>
  ), []);
})

Component.displayName = 'ThankYouRouter';
export default Component;
