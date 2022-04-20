import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './components/App/router';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Router basename={process.env.PUBLIC_URL}>
      <AppRouter />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
