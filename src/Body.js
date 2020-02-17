import React from 'react'
import { connect } from 'react-redux'

import Scraper from 'steps/Scraper'
import BuildExtractor from 'steps/BuildExtractor'
import ExtractData from 'steps/ExtractData'

import 'Body.css'

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfo: true,
    };
  }

  toggleInfo = () => {
    this.setState({showInfo: !this.state.showInfo});
  }

  infoBox = () => {
    if (!this.state.showInfo) return;
    return (
      <div id="welcome">
        <button onClick={this.toggleInfo}>[X] Close</button>
        <h1>Welcome to AutoScrape</h1>
        <p>
          This is a free online interface to <a href="https://github.com/brandonrobertz/autoscrape-py" target="_blank" rel="noopener noreferrer">AutoScrape</a>, a web scraping tool capable of crawling and submitting forms on the most annoying JavaScript-heavy websites.
        </p>
        <p>
          This is alpha software and is only available for testing purposes. Everything here is logged, but won't be shared publicly. AutoScrape is a project of  <a href="https://artificialinformer.com" target="_blank" rel="noopener noreferrer">Artificial Informer Labs</a>. This web app is ran by <a href="https://bxroberts.org" target="_blank" rel="noopener noreferrer">Brandon Roberts</a>.
        </p>
      </div>
    );
  }

  render() {
    if (this.props.step === "scraper") {
      return (
        <div>
          { this.state.showInfo && this.infoBox() }
          <div>
            <Scraper />
          </div>
        </div>
      );
    } else if (this.props.step === "build-extractor") {
      return <BuildExtractor />;
    } else if (this.props.step === "extract") {
      return <ExtractData />;
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
