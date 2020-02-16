import React from "react"
import { connect } from 'react-redux'

import 'steps/Scraper.css'

const STATUS = {
  FAILURE: "FAILURE",
  SUCCESS: "SUCCESS",
  STARTED: "STARTED",
  PENDING: "PENDING",
};

class Scraper extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      scrapeId: null,
      showAdvanced: false,
      scrapeStatus: null,
      autoscrape: {
        backend: "requests",
        baseurl: "",
        form_submit_wait: "5",
        input: "",
        save_graph: false,
        load_images: false,
        maxdepth: "10",
        next_match: "next page",
        leave_host: false,
        show_browser: false,
        driver: "Firefox",
        form_submit_natural_click: false,
        formdepth: "15",
        link_priority: "",
        keep_filename: false,
        ignore_links: "",
        form_match: "",
        save_screenshots: true,
        remote_hub: "",
        loglevel: "DEBUG",
        output: "http://flask:5000/receive",
        disable_style_saving: false,
      },
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
    const url = `${this.state.autoscrape.baseurl}/files/data/${id}/${file_id}`
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

  startScrape = () => {}

  stopScrape = () => {
    const id = this.state.scrapeId;
  }

  toggleMenu = () => {}

  reset = () => {
    console.log("State", this.state);
    this.setState(this.defaultState);
  }

  scrapeComplete() {
    if (this.state.scrapeStatus !== STATUS.SUCCESS) return;
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
    if (this.state.scrapeStatus !== STATUS.STARTED) return;
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
            <input value={this.state.autoscrape.baseurl} onChange={this.handleChange}
              name="baseurl" type="text" placeholder="Base URL to scrape..."
            />
            <div id="toggle-wrapper">
              <span onClick={this.toggleAdvanced}>
                {!this.state.showAdvanced ? '🔧' : '✖'}
              </span>
            </div>
            <button id="start-scrape" onClick={this.startScrape}>Start</button>
            <button id="cancel-scrape" onClick={this.stoptScrape}>Cancel</button>
            <button id="reset-scrape" onClick={this.reset}>Reset</button>
            <div id="scrape-status-wrapper">
              <span id="scrape-status"></span>
            </div>
          </div>
          {!this.state.showAdvanced ? null :
          <div id="sub-controls">
            <div id="sub-controls-menu">
              <span className="small">
                scraper backend
                <select
                  value={this.state.autoscrape.backend}
                  onChange={this.handleChange}
                  name="backend"
                  id="sub-controls-backend"
                >
                  <option value="requests">Requests</option>
                  <option value="selenium">Selenium (Firefox)</option>
                </select>
              </span>
              <span className="small">
                <label htmlFor="form_submit_wait">form_submit_wait</label>
                <input id="form_submit_wait"
                  name="form_submit_wait"
                  onChange={this.handleChange}
                  value={this.state.autoscrape.form_submit_wait}
                />
              </span>
              <span className="large">
                <label htmlFor="input">input</label>
                <input id="input"
                  name="input"
                  value={this.state.autoscrape.input}
                  onChange={this.handleChange}
                  type="text" />
              </span>
              <span>
                <label htmlFor="load_images">load_images</label>
                <input id="load_images" name="load_images"
                  onChange={this.handleChange}
                  value={this.state.autoscrape.load_images} type="checkbox" /> </span>
              <span className="small">
                <label htmlFor="maxdepth">maxdepth</label>
                <input id="maxdepth" name="maxdepth"
                  onChange={this.handleChange}
                  value={this.state.autoscrape.maxdepth} type="text" />
              </span>
              <span className="medium">
                <label htmlFor="next_match">next_match</label>
                <input id="next_match" name="next_match"
                  onChange={this.handleChange}
                  value={this.state.autoscrape.next_match} type="text" />
              </span>
              <span>
                <label htmlFor="leave_host">leave_host</label>
                <input id="leave_host" name="leave_host"
                  onChange={this.handleChange}
                  value={this.state.autoscrape.leave_host} type="checkbox" /> </span>
              <span>
                <label htmlFor="form_submit_natural_click">form_submit_natural_click</label>
                <input
                  id="form_submit_natural_click"
                  name="form_submit_natural_click"
                  onChange={this.handleChange}
                  value={this.state.autoscrape.form_submit_natural_click}
                  type="checkbox"
                />
              </span>
              <span className="small">
                <label htmlFor="formdepth">formdepth</label>
                <input id="formdepth" name="formdepth"
                  onChange={this.handleChange}
                  value={this.state.autoscrape.formdepth} type="text" />
              </span>
              <span>
                <label htmlFor="link_priority">link_priority</label>
                <input id="link_priority" name="link_priority"
                  onChange={this.handleChange}
                  value={this.state.autoscrape.link_priority} type="text"
                />
              </span>
              <span>
                <label htmlFor="ignore_links">ignore_links</label>
                <input id="ignore_links" name="ignore_links"
                  onChange={this.handleChange}
                  value={this.state.autoscrape.ignore_links} type="text"
                />
              </span>
              <span>
                <label htmlFor="form_match">form_match</label>
                <input id="form_match" name="form_match"
                  onChange={this.handleChange}
                  value={this.state.autoscrape.form_match} type="text" />
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
  const { step } = state;
  return { step };
}

export default connect(mapStateToProps, {})(Scraper);
