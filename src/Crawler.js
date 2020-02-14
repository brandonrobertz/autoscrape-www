import React from "react"

import 'Crawler.css'

class Crawler extends React.Component {
  render() {
    return (
      <div id="main">
        <div id="controls">
          <div id="main-controls">
            <input type="text" placeholder="Base URL to scrape..." />
            <div id="toggle-wrapper">
              <span id="toggle-button-open">🔧</span>
              <span id="toggle-button-close" style="display: none">✖</span>
            </div>
            <button id="start-scrape">Start</button>
            <button id="stop-scrape" style="display: none">Cancel</button>
            <button id="reset-scrape" style="display: none">Reset</button>
            <div id="scrape-status-wrapper">
              <span id="scrape-status"></span>
            </div>
          </div>
          <div id="sub-controls">
            <div id="sub-controls-menu" style="display: none">
              <span className="small">
                scraper backend
                <select id="sub-controls-backend">
                  <option value="requests" selected="selected">Requests</option>
                  <option value="selenium">Selenium (Firefox)</option>
                </select>
              </span>
              <span className="small">
                form_submit_wait:
                <input id="sub-controls-form_submit_wait" type="text" value="5" />
              </span>
              <span className="large">
                input:
                <input id="sub-controls-input" type="text" value="" />
              </span>
              <span>
                load_images:
                <input id="sub-controls-load_images" type="checkbox" />
              </span>
              <span className="small">
                maxdepth:
                <input id="sub-controls-maxdepth" type="text" value="10" />
              </span>
              <span className="medium">
                next_match:
                <input id="sub-controls-next_match" type="text" value="next page" />
              </span>
              <span>
                leave_host:
                <input id="sub-controls-leave_host" type="checkbox" />
              </span>
              <span>
                form_submit_natural_click:
                <input id="sub-controls-form_submit_natural_click" type="checkbox" />
              </span>
              <span className="small">
                formdepth:
                <input id="sub-controls-formdepth" type="text" value="0" />
              </span>
              <span>
                link_priority:
                <input id="sub-controls-link_priority" type="text" value="" />
              </span>
              <span>
                ignore_links:
                <input id="sub-controls-ignore_links" type="text" value="" />
              </span>
              <span>
                form_match:
                <input id="sub-controls-form_match" type="text" value="" />
              </span>
            </div>
          </div>
        </div>
        <div id="status" style="display: none">
          <div id="screenshot">
            <p id="screenshot-url"></p>
            <img id="screenshot-img" src="" style="display: none" />
          </div>
        </div>
        <div id="complete" style="display: none">
          <div id="files-list-wrapper">
            <table id="files-list">
              <tr>
                <th>Filename</th>
                <th>Class</th>
                <th>Date</th>
              </tr>
            </table>
          </div>
          <div id="page-controls">
            <button id="prev-page">Prev</button>
            <button id="next-page">Next</button>
            <button id="download-all" onclick="saveZip()">Download all (ZIP)</button>
            <div id="zip-progress"></div>
          </div>
        </div>
      </div>
    );
  }
}



