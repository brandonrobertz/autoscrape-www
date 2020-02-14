import React from 'react';
import './App.css';

function App() {
  return (
    <div>
      <div id="loading-shim">
        Loading...
      </div>
      <div id="hextractor-selected-menu">
        <label id="hextractor-column-label" for="column-name">
          Column Title
        </label>
        <input id="hextractor-column-name" type="text" />
        <button id="hextractor-remove">Unselect</button>
        <button id="hextractor-save">Save</button>
        <button id="hextractor-cancel">X</button>
        <br />
        <button id="hextractor-optional">Make optional</button>
        <button id="hextractor-select-like">Select all like this</button>
        <a className="hextractor-help"
          href="http://help.workbenchdata.com/modules/scrape/hextractor-extract"
          target="_blank">?</a>
      </div>
      <div id="directory-loader">
        <p id="directory-instructions">
          Select or drag-and-drop an AutoScrape data directory.
        </p>
        <input id="directory-selector" type="file"
          webkitdirectory directory multiple />
        <div id="zip-area">
          <p>Or select an AutoScrape ZIP file.</p>
          <input id="zip-selector" type="file" />
        </div>
      </div>
      <div id="hext-overlay">
        <p>This is the selected Hext template:</p>
        <div id="hext-area"></div>
        <button id="hext-download-btn">Download</button>
      </div>
      <div id="hextractor-ui">
        <div id="hextractor-controls">
          <button id="prev-btn">Previous</button>
          <span id="current-number"></span> of
          <span id="total-number"></span>
          <button id="next-btn">Next</button>
          <input id="current-doc-name" type="text" readonly />
          <button id="complete-btn" class="disabled">▶</button>
          <button id="cancel-btn">Reset</button>
        </div>
      </div>
    </div>
  );
}

export default App;
