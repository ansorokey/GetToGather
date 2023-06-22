import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store';

import { Provider }  from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import './index.css';

const store = configureStore();
if(process.env.NODE !== 'production'){
  window.store = store;
}

function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
