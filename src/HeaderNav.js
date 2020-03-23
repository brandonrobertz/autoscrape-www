import React from 'react'
import { connect } from 'react-redux'

import history from 'state/history'

import 'HeaderNav.css'

function mapStateToProps(state) {
  const { scrape, hext } = state;
  return { scrape, hext };
}

class _HeaderTab extends React.Component {
  navigateTo = () => {
    history.push(`/${this.props.stepName}`);
  }

  render() {
    return (
      <button className="header-link" onClick={this.navigateTo}>
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
        <HeaderTab stepName="scrape" label="Scrape" />
        <HeaderTab stepName="build-extractor" label="Build Extractor" />
        <HeaderTab stepName="download-data" label="Download Data" />
        <HeaderTab stepName="help" label="Help" />
      </div>
    );
  }
}

export default connect(mapStateToProps, {})(HeaderNav);
