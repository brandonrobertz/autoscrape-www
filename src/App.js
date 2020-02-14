import React from 'react';
import { Provider } from 'react-redux';

import HeaderNav from 'HeaderNav';
import store from 'state/store'

import 'App.css';


function App() {
  return (
    // Provider passes our redux store state to components
    <Provider store={store}>
      <div className="App">
        <HeaderNav></HeaderNav>
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </Provider>
  );
}

export default App;
