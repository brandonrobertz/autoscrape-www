import React from 'react'
import { connect } from 'react-redux'
import store from 'state/store'

import 'steps/ExtractData.css'


class ExtractData extends React.Component {
  extractData(format) {
    store.dispatch({
      type: "EXTRACT_DATA_REQUESTED",
      payload: {
        scrapeId: this.props.scrape.id,
        format: format,
        hext: this.props.hext,
      }
    });
  }

  render() {
    if (this.props.hext) {
      return (
        <div id="extract-data">
          <h1>Download Data</h1>
          <p>
            Click an output format below to download your extracted data.
          </p>
          <div className="downloads">
            <span className="json" onClick={this.extractData.bind(this, "json")}>
              <img src="/json-icon.svg" alt="Download Data (JSON)" />
            </span>
            <span className="csv" onClick={this.extractData.bind(this, "csv")}>
              <img src="/csv-icon.svg" alt="Download Spreadsheet (CSV)" />
            </span>
          </div>
        </div>
      );
    }
    if (this.props.documents && !this.props.hext) {
      return (
        <div id="extract-data">
          <h2>This is where you'll download your extracted data</h2>
          <p>
            You haven't created an extractor, yet! Go back to the 'Build Extractor'
            step and build one first.
          </p>
        </div>
      );
    }
    return (
      <div id="extract-data">
        <h2>This is where you'll download your extracted data</h2>
        <p>
          You haven't completed a successful scrape, yet. Go back to
          the scraper section and do that first.
        </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { scrape, hext } = state;
  return { scrape, hext };
}

export default connect(mapStateToProps, {})(ExtractData);
