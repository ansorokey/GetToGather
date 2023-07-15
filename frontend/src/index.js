import './index.css';

import * as sessionActions from './store/session';

import App from './App';
import React from 'react';
import Favicon from 'react-favicon';
import ReactDOM from 'react-dom';
import ModalProvider from './Context/ModalContext.js';
import configureStore from './store';

import { Provider }  from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { restoreCSRF, csrfFetch } from './store/csrf';

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  restoreCSRF();

  window.store = store;
  window.csrfFetch = csrfFetch;
  window.sessionActions = sessionActions;
}

function Root() {
  return (
    <ModalProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Favicon url='https://res.cloudinary.com/dzntryr5a/image/upload/v1689185030/favicon_trm1r9.ico'/>
          <App/>
        </BrowserRouter>
      </Provider>
    </ModalProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
