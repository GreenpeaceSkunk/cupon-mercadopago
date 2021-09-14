import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
// import App from './components/App';
import AppRouter from './components/App/router';

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
