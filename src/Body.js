import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { connect } from 'react-redux'

import Scraper from 'steps/Scraper'
import BuildExtractor from 'steps/BuildExtractor'
import ExtractData from 'steps/ExtractData'
import HelpPage from 'steps/HelpPage'
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
          Never used AutoScrape? Check out the <a href="#help" onClick={this.helpPage}>step-by-step walkthrough</a>.
        </p>
        <p>
          This version of AutoScrape is alpha software and is available for a limited time, for testing. Everything scraped will be logged for testing purposes, but not shared publicly. Each scrape session will be limited to 50 pages. For larger scrapes, you can <a href="https://github.com/brandonrobertz/autoscrape-py" target="_blank" rel="noopener noreferrer">run the code yourself</a>.
        </p>
        <p>
          AutoScrape was written by <a href="https://bxroberts.org" target="_blank" rel="noopener noreferrer">Brandon Roberts</a>.
        </p>
      </div>
    );
  }

  render() {
    return (
      <div id="main">
        <Switch>
          <Route exact path="/scrape/:scrapeId?">
            <Scraper />
          </Route>
          <Route exact path="/build-extractor">
            <BuildExtractor />
          </Route>
          <Route exact path="/download-data">
            <ExtractData />
          </Route>
          <Route exact path="/help">
            <HelpPage />
          </Route>
          <Route>
            <Redirect to="/scrape" />
          </Route>
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { step } = state;
  return { step };
}

export default connect(mapStateToProps, {})(Body);
