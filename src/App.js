import React from 'react';
import { connect } from 'react-redux';

import Body from 'Body';
import HeaderNav from 'HeaderNav';

import 'App.css';


const App = (props) => {
  return (
    <div id="autoscrape-www">
      <HeaderNav />
      { props.status && props.status.status &&
      <div id="status">{ props.status.status }<br/>{ props.status.details }</div> }
      <Body />
    </div>
  );
};

function mapStateToProps(state) {
  const { status, step } = state;
  return { status, step };
}

export default connect(mapStateToProps, {})(App);
