import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './components/App/router';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ReactDOM.render(
//   <React.StrictMode>
//     <Router
//       basename={process.env.PUBLIC_URL}
//     >
//       <AppRouter />
//     </Router>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
ReactDOM.render(
  <React.StrictMode>
    <Router
      basename={process.env.PUBLIC_URL}
    >
      <AppRouter />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

/* <Routes>
  <Route path="/">
    Entra
    <Route index element={<div>Home</div>} />
    <Route path="teams">
      <Route path=":teamId" element={<div>Team</div>} />
      <Route path="new" element={<div>NewTeamForm</div>} />
      <Route index element={<div>LeagueStandings</div>} />
    </Route>
  </Route>
  </Routes> */
