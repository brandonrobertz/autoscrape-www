import React from 'react'

import './HeaderNav.css'


class HeaderNav extends React.Component {
  navigateTo(step) {
    console.log(`Navigating to {step}`);
  }

  render() {
    return (
      <div id="header">
        <a onClick={this.navigateTo("scraper")} className="header-link">Scraper</a>
        <a onClick={this.navigateTo("build-extractor")} className="header-link">Build Extractor</a>
        <a onClick={this.navigateTo("extract")} className="header-link">Extract Data</a>
      </div>
    );
  }
}

export default HeaderNav;
