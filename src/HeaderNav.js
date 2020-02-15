import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import store from 'state/store'

import 'HeaderNav.css'

class HeaderTab extends React.Component {
  navigateTo = () => {
    console.log(`Navigating to ${this.props.stepName}`);
    store.dispatch({
      type: "CHANGE_STEP",
      payload: {
        step: this.props.stepName,
      }
    });
  }
  render() {
    return (
      <a className="header-link" onClick={this.navigateTo}>
        {this.props.label}
      </a>
    );
  }
}

class HeaderNav extends React.Component {
  componentWillMount = () => {
    console.log(`HeaderNav step: ${this.props.step}`);
  }

  render() {
    return (
      <div id="header">
        <p>Current step: { this.props.step }</p>
        <HeaderTab stepName="scraper" label="Scraper" />
        <HeaderTab stepName="build-extractor" label="Build Extractor" />
        <HeaderTab stepName="extract" label="Extract Data" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { step } = state;
  return { step };
}

export default connect(mapStateToProps, {})(HeaderNav);
