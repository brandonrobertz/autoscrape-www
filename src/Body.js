import React from 'react'
import { connect } from 'react-redux'

import 'HeaderNav.css'

class Body extends React.Component {
  render() {
    return (
    <div>
      <h1>Welcome to AutoScrape Alpha</h1>
      <p>
        Feel free to use AutoScrape free! Note that I am logging the usage of
        AutoScrape here for testing and use-case information gathering purposes.
      </p>
    </div>
    );
  }
}

export default Body;
