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


  clearHext = () => {
    store.dispatch({
      type: "HEXT_CLEAR_REQUESTED",
    });
  }

  toggleShowHext = () => {
    this.setState({
      showHext: !this.state.showHext
    });
  }

  showHextControl() {
    return (<div className="hext-complete-controls">
      <button onClick={this.clearHext}>
        Create New Extractor
      </button>
      <button onClick={this.toggleShowHext}>
        { this.state.showHext ? "Hide extractor" : "Show extractor" }
      </button>
    </div>);
  }

  render() {
    if (!this.props.scrape || !this.props.scrape.filesList) {
      return (
        <div>
          <h2>This is where you'll build an extractor</h2>
          <p>
            You haven't completed a successful scrape, yet. Go back to the
            scraper section and do that first.
          </p>
        </div>
      );
    }
    else if (this.props.hext) {
      return (
        <div className="extractor-built-complete row">
          <h2>Extractor Built</h2>
          <p>
            You've successfully built a template. Continue to the
            download step above to get your data.
          </p>
          <div className="hext-template">
            { this.showHextControl() }
            { this.state.showHext && <pre>{this.props.hext}</pre> }
          </div>
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
}

function mapStateToProps(state) {
  const { step, scrape, hext } = state;
  return { step, scrape, hext };
}

export default connect(mapStateToProps, {})(BuildExtractor);
