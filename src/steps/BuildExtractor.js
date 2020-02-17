import React from 'react';
import { connect } from 'react-redux'

import 'steps/BuildExtractor.css';

class BuildExtractor extends React.Component {
  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();
    this.state = {};
    window.addEventListener("message", (event) => {
      if (event.data === "waiting") {
        this.sendFilesList(this.props.scrape);
      } else if (event.data.params && event.data.params.hext_template) {
        console.log("Got hext template", event.data);
        // dispatch hext template
      }
    });
  }
  sendFilesList = (scrape) => {
    if (!scrape || !scrape.filesList) return;
    const data = {documents: scrape.documents};
    this.iframeRef.current.contentWindow.postMessage(data, '*');
  }
  renderIframe() {
    if (!this.props.scrape || !this.props.scrape.filesList) {
      return (
        <div>
          You haven't scraped any data, yet! Please visit the 'Scraper'
          step and complete a successful scrape.
        </div>
      );
    }
    console.log("Return iFrame...");
    return (
      <iframe id="build-extractor"
        title="Build Hext Extractor"
        ref={this.iframeRef}
        src="/hextractor/hextractor.html">
      </iframe>
    );
  }
  render() {
    console.log("Rendering...");
    return (
      <div>
        { this.renderIframe() }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { step, scrape } = state;
  return { step, scrape };
}

export default connect(mapStateToProps, {})(BuildExtractor);
