import React from 'react';
import { connect } from 'react-redux';

import store from 'state/store';

import 'steps/BuildExtractor.css';

class BuildExtractor extends React.Component {
  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();
    this.state = {
      showHext: false,
    };

    // listen for iframe to ask for HTML documents or
    // to tell us it has a complete template.
    window.addEventListener("message", (event) => {
      if (event.data === "waiting") {
        this.sendFilesList(this.props.scrape);
      } else if (event.data.params && event.data.params.hext_template) {
        console.log("Got hext template", event.data);
        // dispatch hext template
        store.dispatch({
          type: "HEXT_RECEIVED",
          payload: event.data.params.hext_template,
        });
      }
    });
  }

  sendFilesList = (scrape) => {
    if (!scrape || !scrape.filesList) return;
    const data = {documents: scrape.documents};
    this.iframeRef.current.contentWindow.postMessage(data, '*');
  }

  toggleShowHext = () => {
    this.setState({
      showHext: !this.state.showHext
    });
  }

  showHextControl() {
    return (<div>
      <button onClick={this.toggleShowHext}>
        { this.state.showHext ? "Hide extractor" : "Show extractor" }
      </button>
    </div>);
  }

  renderIframe() {
    if (!this.props.scrape || !this.props.scrape.filesList) {
      return (
        <p>
          You haven't scraped any data, yet! Please visit the 'Scraper'
          step and complete a successful scrape.
        </p>
      );
    }
    else if (this.props.hext) {
      return (
        <div>
          <p>
            You've successfully built a template. Continue to the
            extract data step above to download your data.
          </p>
          { this.showHextControl() }
          { this.state.showHext && <pre>{this.props.hext}</pre> }
        </div>
      );
    }
    return (
      <iframe id="build-extractor"
        title="Build Hext Extractor"
        ref={this.iframeRef}
        src="/hextractor/hextractor.html">
      </iframe>
    );
  }

  render() {
    return (
      <div>
        { this.renderIframe() }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { step, scrape, hext } = state;
  return { step, scrape, hext };
}

export default connect(mapStateToProps, {})(BuildExtractor);
