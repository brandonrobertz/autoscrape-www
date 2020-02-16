import React from 'react'
import { connect } from 'react-redux'

import Scraper from 'steps/Scraper'

import 'HeaderNav.css'

class Body extends React.Component {
  render() {
    if (this.props.step === "scraper") {
      return (
        <div>
          <h1>Welcome to AutoScrape Alpha</h1>
          <p>
            Feel free to use AutoScrape free! Note that I am logging the usage of
            AutoScrape here for testing and use-case information gathering purposes.
          </p>
          <div>
            <Scraper />
          </div>
        </div>
      );
    } else if (this.props.step === "build-extractor") {
      return (
        <div>
          <h1>Build Extractor</h1>
          <p>
            Build your extractor.
          </p>
        </div>
      );
    } else if (this.props.step === "extract") {
      return (
        <div>
          <h1>Extractor</h1>
          <p>
            Extract data now.
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <h1>404</h1>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  const { step } = state;
  return { step };
}

export default connect(mapStateToProps, {})(Body);
