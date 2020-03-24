import React from "react"
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import store from 'state/store';
import history from 'state/history';
import { SCRAPE_STATUS } from 'state/reducers/scrape';
import DownloadHTML from 'steps/DownloadHTML'

import 'steps/Scraper.css'

class ScrapeComplete extends React.Component {
  filesPageControls() {
    return null;
    //return (
    //  <div id="page-controls">
    //    <button id="prev-page">Prev</button>
    //    <button id="next-page">Next</button>
    //    <button id="download-all" onClick={this.saveZip}>Download all (ZIP)</button>
    //    <div id="zip-progress"></div>
    //  </div>
    //);
  }

  nextStep() {
    history.push("/build-extractor");
  }

  clearScrape() {
    store.dispatch({
      type: "CLEAR_SCRAPE",
    });
    history.push("/scrape");
  }

  render() {
    if (this.props.scrape.status === SCRAPE_STATUS.LOADING) {
      return <span className="center">Loading data...</span>;
    } else if (this.props.scrape.status !== SCRAPE_STATUS.SUCCESS) {
      return null;
    }
    const rows = this.props.scrape.filesList.map((item, ix) => {
      return (
        <tr key={`file-row-${ix}`} className="file-row">
          <td data-content="name">{item.name}</td>
          <td data-content="fileclass">{item.fileclass}</td>
          <td data-content="timestamp">{item.timestamp}</td>
        </tr>
      );
    });
    return (
      <div id="main">
        <div id="complete">
          <h2>Scrape Complete</h2>
          <p>
            <a href={`/scrape/${this.props.scrape.id}`}>
              Here's a persistent link to this scrape.
            </a>
          </p>
          <p>
            Here's a list of (up to 100) of the files found during your scrape.
            This includes the web pages visited, the styles from each, screenshots
            taken during scraping, and any documents found.
          </p>
          <p>
            If you want to extract structured data (like a spreadsheet), you
            need to build an extractor first. An extractor shows AutoScrape what
            a record (one of the rows in the spreadsheet you'd like to build)
            looks like. You can do this in the 'Build Extractor' step.
          </p>
          <p>
            If you just want a copy of all the files gathered during the crawl,
            click the 'Download Files (ZIP)' button below.
          </p>
          <div id="files-list-wrapper">
            <table id="files-list">
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Class</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                { rows }
              </tbody>
            </table>
          </div>
          { this.filesPageControls() }
          <div className="next">
            <button type="button" onClick={this.clearScrape}>Start New Scrape</button>
            <DownloadHTML scrapeId={this.props.scrape.id} />
            <button type="button" onClick={this.nextStep}>Build Extractor &rarr;</button>
          </div>
        </div>
      </div>
    );
  }

  //componentDidUpdate(a, b, c) {
  //}

  componentDidMount(a, b, c) {
    if (this.scrape && this.scrape.status === SCRAPE_STATUS.LOADING) {
      return;
    }
    const scrapeId = this.props.match.params.scrapeId;;
    store.dispatch({
      type: "LOAD_SCRAPE_REQUESTED",
      payload: scrapeId,
    });
  }
}

function mapStateToProps(state) {
  const { step, scrape } = state;
  return { step, scrape };
}

export default withRouter(connect(mapStateToProps, {})(ScrapeComplete));
