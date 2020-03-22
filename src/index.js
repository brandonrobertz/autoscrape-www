import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'

import App from 'App'
import rootSaga from 'api/apiHandlers'
import store, { history } from 'state/store';

import 'index.css'

store.runSaga(rootSaga);

// Provider passes our redux store state to components
render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
