import React from "react"
import { connect } from 'react-redux'

import store from 'state/store';
import { SCRAPE_STATUS } from 'state/reducers/root';

import 'steps/Scraper.css'

class Scraper extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      scrapeId: null,
      showAdvanced: false,
      // autoscrape_fields
      AS_backend: "requests",
      AS_baseurl: "",
      AS_form_submit_wait: "5",
      AS_input: "",
      AS_save_graph: false,
      AS_load_images: false,
      AS_maxdepth: "10",
      AS_next_match: "next page",
      AS_leave_host: false,
      AS_show_browser: false,
      AS_driver: "Firefox",
      AS_form_submit_natural_click: false,
      AS_formdepth: "15",
      AS_link_priority: "",
      AS_keep_filename: false,
      AS_ignore_links: "",
      AS_form_match: "",
      AS_save_screenshots: true,
      AS_remote_hub: "",
      AS_loglevel: "DEBUG",
      AS_output: "http://flask:5000/receive",
      AS_disable_style_saving: false,
    };
    this.state = this.defaultState;
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  // we don't use submit, disable it here
  handleSubmit  = (e) => { e.preventDefault();}

  toggleAdvanced = () => {
    this.setState({showAdvanced: !this.state.showAdvanced});
  }

  fetchFile = (file_id) => {
    const id = this.state.scrapeId;
    const url = `${this.state.AS_baseurl}/files/data/${id}/${file_id}`
    return fetch(url).then((response) => {
      return response.json();
    });
  }

  saveZip = (data) => {
    const id = this.state.scrapeId;
  }

  renderPage = (data, page) => {}

  renderFilesList = (data) => {}

  fetchFilesList = () => {
    const id = this.state.scrapeId;
  }

  updateStatus = (data) => {
    const id = this.state.scrapeId;
  }

  updateProgress = (progressUrl) => {
    const id = this.state.scrapeId;
  }

  pollProgress = () => {
    const id = this.state.scrapeId;
  }

  autoscrapeData = () => {
    const data = {};
    Object.keys(this.state).forEach((k) => {
      if (!k.startsWith("AS_")) return;
      const stripped = k.replace("AS_", "");
      data[stripped] = this.state[k];
    });
    return data;
  }

  startScrape = () => {
    store.dispatch({
      type: "START_SCRAPE_REQUESTED",
      payload: this.autoscrapeData(),
    });
  }

  stopScrape = () => {
    const id = this.state.scrapeId;
  }

  toggleMenu = () => {}

  reset = () => {
    console.log("State", this.state);
    this.setState(this.defaultState);
  }

  scrapeComplete() {
    if (this.state.scrapeStatus !== SCRAPE_STATUS.SUCCESS) return;
    const rows = (
      <tr>
        <th>Filename</th>
        <th>Class</th>
        <th>Date</th>
      </tr>
    );
    return (
      <div id="complete">
        <h2>Scrape Complete</h2>
        <div id="files-list-wrapper">
          <table id="files-list">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Class</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              { rows }
            </tbody>
          </table>
        </div>
        <div id="page-controls">
          <button id="prev-page">Prev</button>
          <button id="next-page">Next</button>
          <button id="download-all" onClick={this.saveZip}>Download all (ZIP)</button>
          <div id="zip-progress"></div>
        </div>
      </div>
    );
  }

  scrapeStatus() {
    if (this.state.scrapeStatus !== SCRAPE_STATUS.STARTED) return;
    return (
      <div id="status">
        <div id="screenshot">
          <p id="screenshot-url"></p>
          <img id="screenshot-img" alt="Current Scraper Screenshot" src="" />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div id="main">
        <form onSubmit={this.handleSubmit} onChange={this.handleChange} id="controls">
          <div id="main-controls">
            <input value={this.state.AS_baseurl} onChange={this.handleChange}
              name="AS_baseurl" type="text" placeholder="Base URL to scrape..."
            />
            <div id="toggle-wrapper">
              <span onClick={this.toggleAdvanced}>
                {!this.state.showAdvanced ? '🔧' : '✖'}
              </span>
            </div>
            <button id="start-scrape" onClick={this.startScrape}>Start</button>
            <button id="cancel-scrape" onClick={this.stoptScrape}>Cancel</button>
            <button id="reset-scrape" onClick={this.reset}>Clear Options</button>
            <div id="scrape-status-wrapper">
              <span id="scrape-status">
                {this.props.scrape.message}
              </span>
            </div>
          </div>
          {!this.state.showAdvanced ? null :
          <div id="sub-controls">
            <div id="sub-controls-menu">
              <span className="small">
                scraper backend
                <select
                  value={this.state.AS_backend}
                  onChange={this.handleChange}
                  name="AS_backend"
                  id="sub-controls-backend"
                >
                  <option value="requests">Requests</option>
                  <option value="selenium">Selenium (Firefox)</option>
                </select>
              </span>
              <span className="small">
                <label htmlFor="form_submit_wait">form_submit_wait</label>
                <input id="form_submit_wait"
                  name="AS_form_submit_wait"
                  onChange={this.handleChange}
                  value={this.state.AS_form_submit_wait}
                />
              </span>
              <span className="large">
                <label htmlFor="input">input</label>
                <input id="input"
                  name="AS_input"
                  value={this.state.AS_input}
                  onChange={this.handleChange}
                  type="text" />
              </span>
              <span>
                <label htmlFor="load_images">load_images</label>
                <input id="load_images" name="AS_load_images"
                  onChange={this.handleChange}
                  value={this.state.AS_load_images} type="checkbox" /> </span>
              <span className="small">
                <label htmlFor="maxdepth">maxdepth</label>
                <input id="maxdepth" name="AS_maxdepth"
                  onChange={this.handleChange}
                  value={this.state.AS_maxdepth} type="text" />
              </span>
              <span className="medium">
                <label htmlFor="next_match">next_match</label>
                <input id="next_match" name="AS_next_match"
                  onChange={this.handleChange}
                  value={this.state.AS_next_match} type="text" />
              </span>
              <span>
                <label htmlFor="leave_host">leave_host</label>
                <input id="leave_host" name="AS_leave_host"
                  onChange={this.handleChange}
                  value={this.state.AS_leave_host} type="checkbox" /> </span>
              <span>
                <label htmlFor="form_submit_natural_click">form_submit_natural_click</label>
                <input
                  id="form_submit_natural_click"
                  name="AS_form_submit_natural_click"
                  onChange={this.handleChange}
                  value={this.state.AS_form_submit_natural_click}
                  type="checkbox"
                />
              </span>
              <span className="small">
                <label htmlFor="formdepth">formdepth</label>
                <input id="formdepth" name="AS_formdepth"
                  onChange={this.handleChange}
                  value={this.state.AS_formdepth} type="text" />
              </span>
              <span>
                <label htmlFor="link_priority">link_priority</label>
                <input id="link_priority" name="AS_link_priority"
                  onChange={this.handleChange}
                  value={this.state.AS_link_priority} type="text"
                />
              </span>
              <span>
                <label htmlFor="ignore_links">ignore_links</label>
                <input id="ignore_links" name="AS_ignore_links"
                  onChange={this.handleChange}
                  value={this.state.AS_ignore_links} type="text"
                />
              </span>
              <span>
                <label htmlFor="form_match">form_match</label>
                <input id="form_match" name="AS_form_match"
                  onChange={this.handleChange}
                  value={this.state.AS_form_match} type="text" />
              </span>
            </div>
          </div>}
        </form>
        {  this.scrapeComplete() }
        {  this.scrapeStatus() }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { step, scrape } = state;
  console.log("mapStateToProps scrape", scrape);
  return { step, scrape };
}

export default connect(mapStateToProps, {})(Scraper);
