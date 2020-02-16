import React from 'react'
import { connect } from 'react-redux'

import store from 'state/store'

import 'HeaderNav.css'

function mapStateToProps(state) {
  const { step, scrape } = state;
  return { step, scrape };
}

class _HeaderTab extends React.Component {
  navigateTo = () => {
    store.dispatch({
      type: "CHANGE_STEP",
      payload: {
        step: this.props.stepName,
      }
    });
  }
  getClassNames() {
    let className = "header-link";
    // if we're on the scraper page, but we ought to move to
    // the build extractor phase, highlight the build extractor button
    if (this.props.stepName === "build-extractor" &&
        this.props.step === "scraper" &&
        this.props.scrape.filesList) {
      className += " highlighted";
    }
    return className;
  }
  render() {
    return (
      <button className={this.getClassNames()} onClick={this.navigateTo}>
        {this.props.label}
      </button>
    );
  }
}

const HeaderTab = connect(mapStateToProps, {})(_HeaderTab);

class HeaderNav extends React.Component {
  render() {
    return (
      <div id="header">
        <HeaderTab stepName="scraper" label="Scraper" />
        <HeaderTab stepName="build-extractor" label="Build Extractor" />
        <HeaderTab stepName="extract" label="Extract Data" />
      </div>
    );
  }
}

export default connect(mapStateToProps, {})(HeaderNav);
