import React, { Suspense, lazy, memo, useMemo, useEffect } from 'react';
import { useNavigate, generatePath } from 'react-router';
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from '../Shared';

// const Forms = lazy(() => import('../Forms'));

const Component: React.FunctionComponent<{}> = memo(() => {
  // const { path } = useRouteMatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   navigate({
  //     pathname: generatePath(`/forms`, {}),
  //     // search: `${searchParams}`,
  //   });
  // }, []);

  return useMemo(() => (
    <Routes>
      <Route path={`/`}>
        {/* <Suspense fallback={<Loader />}>
          <Forms />
        </Suspense> */}
        <Route index element={<span>Forms</span>} />
        {/* <Navigate to={`/forms`} />  */}
      </Route>
    </Routes>
  ), [
    // path,
  ]);
})

Component.displayName = 'HomeRouter'
export default Component;
