import React from 'react'
import { connect } from 'react-redux'

import Scraper from 'steps/Scraper'
import BuildExtractor from 'steps/BuildExtractor'
import ExtractData from 'steps/ExtractData'
import store from 'state/store'

import 'Body.css'

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfo: true,
    };
  }

  toggleInfo = (e) => {
    this.setState({showInfo: !this.state.showInfo});
  }

  helpPage() {
    store.dispatch({
      type: "CHANGE_STEP",
      payload: {
        step: "help-page",
      }
    });
  }

  infoBox = () => {
    if (!this.state.showInfo) {
      return (
        <div id="welcome" className="closed">
          <button onClick={this.toggleInfo} className="close">
            Open Info [^]
          </button>
          <div className="autoscrape-logo">
            <img src="/autoscraper.png" alt="AutoScrape logo" />
          </div>
          <h1>AutoScrape</h1>
        </div>
      );
    };
    return (
      <div id="welcome" className="opened">
        <button onClick={this.toggleInfo} className="close">
          Close Info [X]
        </button>
        <h1>Welcome to AutoScrape</h1>
        <p>
          AutoScrape is an <a href="https://github.com/brandonrobertz/autoscrape-py" target="_blank" rel="noopener noreferrer">open-source</a>, programming-free web scraper for interactive sites.
        </p>
        <p>
          This version of AutoScrape is alpha software and is available for a limited time, for testing. Everything scraped will be logged for testing purposes, but not shared publicly. Each scrape session will be limited to 25 pages. For larger scrapes, you can <a href="https://github.com/brandonrobertz/autoscrape-py" target="_blank" rel="noopener noreferrer">run the code yourself</a>.
        </p>
        <p>
          Don't know how to use AutoScrape? There's a <a href="#" target="_blank" rel="noopener noreferrer">30-second walkthrough</a> on YouTube or you can read the <a href="#" onClick={this.helpPage}>help page</a>.
        </p>
        <p>
          AutoScrape was written by <a href="https://bxroberts.org" target="_blank" rel="noopener noreferrer">Brandon Roberts</a>.
        </p>
      </div>
    );
  }

  render() {
    if (this.props.step === "scraper") {
      return (
        <div id="main">
          { this.infoBox() }
          <div>
            <Scraper />
          </div>
        </div>
      );
    } else if (this.props.step === "build-extractor") {
      return <div id="main"><BuildExtractor /></div>;
    } else if (this.props.step === "extract") {
      return <div id="main"><ExtractData /></div>;
    } else {
      return (
        <div id="main">
          <h1>Something went wrong!</h1>
          <p>
            Please refresh the page to restart the app.
          </p>
          <p>
            If you see anything interesting in the developer tools tab (F12 on Windows), you can <a href="https://github.com/brandonrobertz/autoscrape-www/issues" target="_blank" rel="noopener noreferrer">file a GitHub issue here</a>.
          </p>
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
