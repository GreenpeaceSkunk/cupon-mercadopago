import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './components/App/context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router basename={process.env.PUBLIC_URL}>
      <AppProvider />
    </Router>
  </React.StrictMode>
);

reportWebVitals(console.log);
