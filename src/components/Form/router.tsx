import React, { memo, useMemo, } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import Forms from '.';

const Component: React.FunctionComponent<{}> = memo(() => {
  const { path } = useRouteMatch();

  return useMemo(() => (
    <Switch>
      <Route path={`${path}/step/:step`}>
        <Forms />
      </Route>
      <Redirect from={path} to={`${path}/step/1`} />
    </Switch>
  ), [
    path,
  ]);
})

Component.displayName = 'RouterForm';
export default Component;
