import React, { memo, useMemo, } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import Index from '.';

const Component: React.FunctionComponent<{}> = memo(() => {
  const { path } = useRouteMatch();

  return useMemo(() => (
    <Switch>
      <Route path={path}>
        <Index />
      </Route>
    </Switch>
  ), [
    path,
  ]);
})

Component.displayName = 'ThankYouRouter';
export default Component;
