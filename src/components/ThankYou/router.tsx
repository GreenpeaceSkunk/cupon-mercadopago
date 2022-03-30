import React, { memo, useMemo, } from 'react';
// import { Route, Switch, useRouteMatch } from 'react-router';
import { Routes, Route } from "react-router-dom";
import Index from '.';

const Component: React.FunctionComponent<{}> = memo(() => {
  // const { path } = useRouteMatch();

  return useMemo(() => (
    <Routes>
      <Route path='/'>
        <Index />
      </Route>
    </Routes>
  ), [
    // path,
  ]);
})

Component.displayName = 'ThankYouRouter';
export default Component;
