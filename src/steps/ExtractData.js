import React from 'react'
import { connect } from 'react-redux'
import { saveAs } from 'file-saver'
import Papa from 'papaparse'

class ExtractData extends React.Component {
  extractAll = () => {
    const hext = this.props.hext;
    const documents = this.props.scrape.documents;
    return documents.map((doc) => {
      const html = doc.html;
      const parsedHtml = new window.Module.Html(html);
      const rule = new window.Module.Rule(hext);
      const results = rule.extract(parsedHtml);
      return results;
    }).filter(x => x).flat();
  }

  downloadJSON = () => {
    const records = this.extractAll();
    const strData = JSON.stringify(records);
    const blob = new Blob([strData]);
    const now = (new Date()).getTime();
    saveAs(blob, `autoscrape-data-${now}.json`)
  }

  downloadCSV = () => {
    const records = this.extractAll();
    const csv = Papa.unparse(records);
    const blob = new Blob([csv]);
    const now = (new Date()).getTime();
    saveAs(blob, `autoscrape-data-${now}.csv`)
  }

  render() {
    return (
      <div>
        <h1>Extract Data</h1>
        <p>
          Select an output format below to get your extracted data.
        </p>
        <div>
          <button onClick={this.downloadJSON}>JSON</button>
          <button onClick={this.downloadCSV}>Spreadsheet (CSV)</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { scrape, hext } = state;
  return { scrape, hext };
}

export default connect(mapStateToProps, {})(ExtractData);
