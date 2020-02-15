import React from 'react'
import { render } from 'react-dom'

import App from 'App'
import 'index.css'

//import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import store from 'state/store';
console.log("STORE", store);

const rootElement = document.getElementById('root');
// Provider passes our redux store state to components
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
