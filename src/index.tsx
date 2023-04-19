import React, { StrictMode, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './components/App/context';

const root = document.getElementById('root') as HTMLElement;

ReactDOM
  .createRoot(root)
  // .render(
  //   <StrictMode>
  //     <Router basename={process.env.PUBLIC_URL}>
  //       <AppProvider />
  //     </Router>
  //   </StrictMode>,
  //   root
  // )
  .render(
    <Router basename={process.env.PUBLIC_URL}>
      <AppProvider />
    </Router>
  )

/*ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);*/

// reportWebVitals(console.log);

