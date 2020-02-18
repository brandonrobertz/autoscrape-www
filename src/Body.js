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

  toggleInfo = (e) => {
    this.setState({showInfo: !this.state.showInfo});
  }

  infoBox = () => {
    if (!this.state.showInfo) {
      return (
        <div id="welcome" className="closed">
          <button onClick={this.toggleInfo} className="close">
            Open [^]
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
          Close [X]
        </button>
        <h1>Welcome to AutoScrape</h1>
        <p>
          This is a free online interface to <a href="https://github.com/brandonrobertz/autoscrape-py" target="_blank" rel="noopener noreferrer">AutoScrape</a>, a web scraping tool capable of crawling and submitting forms on interactive, JavaScript-heavy websites. No programming required.
        </p>
        <p>
          There are three steps: first crawl a site, optionally adding instructions for how AutoScrape can find and fill out a search form. Then build an extractor and, finally, use it to download extracted JSON or CSV files.
        </p>
        <p>
          This is alpha software and is only available for testing purposes. Everything here is logged, but won't be shared publicly. There is a limit of 50 total pages scraped. For larger scrapes, using AutoScrape with <a href="https://workbenchdata.com/" target="_blank" rel="noopener noreferrer">Workbench</a> is the preferred route.
        </p>
        <p>
          AutoScrape is a project of <a href="https://artificialinformer.com">Artificial Informer Labs</a>. This web app is ran by <a href="https://bxroberts.org" target="_blank" rel="noopener noreferrer">Brandon Roberts</a>.
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
