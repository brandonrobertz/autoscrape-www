import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import App from 'App'
import rootSaga from 'api/apiHandlers'
import store from 'state/store'
import history from 'state/history'

import 'index.css'

store.runSaga(rootSaga);

window.addEventListener("beforeunload", function (e) {
  const confirmationMessage = "Are you sure you want to reload the page? Data could be lost.";
  e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
  return confirmationMessage;              // Gecko, WebKit, Chrome <34
});

// Provider passes our redux store state to components
render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
