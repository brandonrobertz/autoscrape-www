import React from 'react'
import { connect } from 'react-redux'

import store from 'state/store'

import 'HeaderNav.css'

function mapStateToProps(state) {
  const { step, scrape, hext } = state;
  return { step, scrape, hext };
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
    let className = `header-link ${this.props.stepName}`;
    // point the user to the next step by highlighting
    // the next step when we have the data needed to
    // use it. these are in order of precedence, so
    // the last steps should come higher priorirt, to
    // avoid pointing people back
    if (
      this.props.stepName === "extract" &&
      this.props.scrape.filesList &&
      this.props.hext
    ) {
      className += " highlighted";
    }
    else if (
      this.props.stepName === "build-extractor" &&
      this.props.scrape.filesList &&
      !this.props.hext
    ) {
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
        <HeaderTab stepName="extract" label="Download Data" />
        <HeaderTab stepName="help-page" label="Help" />
      </div>
    );
  }
}

export default connect(mapStateToProps, {})(HeaderNav);
