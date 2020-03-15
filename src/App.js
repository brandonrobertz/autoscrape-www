import React from 'react';
import { connect } from 'react-redux';

import Body from 'Body';
import HeaderNav from 'HeaderNav';

import 'App.css';


const App = () => {
  return (
    <div id="autoscrape-www">
      <HeaderNav />
      <Body />
    </div>
  );
};

function mapStateToProps(state) {
  const { step } = state;
  return { step };
}

export default connect(mapStateToProps, {})(App);
