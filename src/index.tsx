import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './components/App/router';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router basename={process.env.PUBLIC_URL}>
      <AppRouter />
    </Router>
  </React.StrictMode>
);

reportWebVitals(console.log);
