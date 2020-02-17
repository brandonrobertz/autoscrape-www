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
      // AutoScrape fields
      AS_backend: "requests",
      AS_baseurl: "",
      AS_form_submit_wait: "5",
      AS_input: "",
      AS_save_graph: false,
      AS_load_images: false,
      AS_maxdepth: "0",
      AS_next_match: "",
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
      AS_loglevel: "INFO",
      AS_output: "http://localhost:5000/receive",
      AS_disable_style_saving: false,
    };
    this.baseUrlRef = React.createRef();
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

  /*
  saveZip = () => {
    const id = this.state.scrape.id;
    const data = this.state.scrape.filesList;
    if (!id || !data) {
      console.error("saveZip called without id or data available");
      return;
    }
    const file_ids = data.map(data => data.id);
    Promise.all(file_ids.map((fid) => {
      changeStatusText(`Fetching file ID ${fid}`, "pending");
      return fetchFile(id, fid);
    }))
      .then((responses) => {
        return responses.map((r) => {
          return {
            "name": r.data.name,
            "data": r.data.data
          };
        });
      })
      .then((files) => {
        changeStatusText(`${files.length} files downloaded`, "pending");
        const zip = new JSZip();
        // const seenFileNames = [];
        files.forEach((file) => {
          const filename = `autoscrape-data/${file.name}`;
          // if (seenFileNames.indexOf(filename) !== -1) {
          //   console.warn("Skipping already included filename", filename);
          //   return;
          // }
          // seenFileNames.push(filename);
          changeStatusText(`Zipping ${filename}`, "pending");
          zip.file(filename, atob(file.data), {binary: true});
        });
        return zip.generateAsync({type:"blob"});
      })
      .then((blob) => {
        changeStatusText(`Completing ZIP`, "pending");
        const now = (new Date()).getTime();
        changeStatusText(`Zipping complete!`, "complete");
        saveAs(blob, `autoscrape-data-${now}.zip`);
      })
      .catch((err) => {
        console.error("Overall zip error", err);
      });
  }
  */

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
    this.setState({showAdvanced: false});
    store.dispatch({
      type: "SCRAPE_REQUESTED",
      payload: this.autoscrapeData(),
    });
  }

  stopScrape = () => {
    if (!this.props.scrape || !this.props.scrape.id) return;
    const id = this.props.scrape.id;
    store.dispatch({
      type: "STOP_SCRAPE_REQUESTED",
      payload: {
        id: id,
      }
    });
  }

  toggleMenu = () => {}

  reset = () => {
    this.setState(this.defaultState);
  }

  filesPageControls() {
    return null;
    //return (
    //  <div id="page-controls">
    //    <button id="prev-page">Prev</button>
    //    <button id="next-page">Next</button>
    //    <button id="download-all" onClick={this.saveZip}>Download all (ZIP)</button>
    //    <div id="zip-progress"></div>
    //  </div>
    //);
  }

  scrapeComplete() {
    if (this.props.scrape.status !== SCRAPE_STATUS.SUCCESS) return;

    const rows = this.props.scrape.filesList.map((item, ix) => {
      return (<tr key={`file-row-${ix}`} className="file-row">
        <td data-content="name">{item.name}</td>
        <td data-content="fileclass">{item.fileclass}</td>
        <td data-content="timestamp">{item.timestamp}</td>
      </tr>);
    });
    return (
      <div id="complete">
        <h2>Scrape Complete</h2>
        <p>
          A list of all the scraped files are below. You can start extracting data
          from them by continuing to the build extractor step.
        </p>
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
        { this.filesPageControls() }
      </div>
    );
  }

  scrapeScreenshot() {
    if ((this.props.scrape.status !== SCRAPE_STATUS.RUNNING) || !this.props.scrape.data) return;
    const src = `data:image/png;base64,${this.props.scrape.data}`;
    return (
      <div id="screenshot">
        { this.props.scrape.url &&
          <p id="screenshot-url">Current URL: {this.props.scrape.url}</p>
        }
        { src &&
          <img id="screenshot-img" alt="Current Scraper Screenshot" src={src} />
        }
      </div>
    );
  }

  scrapeStatus() {
    if (!this.props.scrape || !this.props.scrape.message)
      return;

    return (
      <div id="status">
        <span id="scrape-status">
          {this.props.scrape.message}
        </span>
        { this.scrapeScreenshot() }
      </div>
    );
  }

  advancedControls() {
    if (!this.state.showAdvanced) return;
    return (
      <div id="sub-controls">
        <div id="sub-controls-menu">
          <div>
            <label htmlFor="AS_backend">
              Scraper backend
            </label>
            <select
              value={this.state.AS_backend}
              onChange={this.handleChange}
              name="AS_backend"
              id="sub-controls-backend"
            >
              <option value="requests">Requests</option>
              <option value="selenium">Selenium (Firefox)</option>
            </select>
          </div>

          <div>
            <label htmlFor="form_match">Form text</label>
            <input id="form_match" name="AS_form_match"
              onChange={this.handleChange}
              placeholder="Text can we use to find your form"
              value={this.state.AS_form_match} type="text" />
          </div>
          <div>
            <label htmlFor="next_match">Next page button text</label>
            <input id="next_match" name="AS_next_match"
              onChange={this.handleChange}
              placeholder="Text can we use to find next page buttons"
              value={this.state.AS_next_match} type="text" />
          </div>
          <div>
            <label htmlFor="input">Form input plan</label>
            <input id="input"
              name="AS_input"
              value={this.state.AS_input}
              onChange={this.handleChange}
              type="text" />
          </div>

          <div>
            <label htmlFor="form_submit_wait">Wait after submit (seconds)</label>
            <input id="form_submit_wait"
              name="AS_form_submit_wait"
              onChange={this.handleChange}
              value={this.state.AS_form_submit_wait}
            />
          </div>
          <div>
            <label htmlFor="load_images">Load images?</label>
            <input id="load_images" name="AS_load_images"
              onChange={this.handleChange}
              value={this.state.AS_load_images} type="checkbox" />
          </div>
          <div>
            <label htmlFor="maxdepth">Max click depth</label>
            <input id="maxdepth" name="AS_maxdepth"
              onChange={this.handleChange}
              value={this.state.AS_maxdepth} type="text" />
          </div>
          <div>
            <label htmlFor="leave_host">Leave host?</label>
            <input id="leave_host" name="AS_leave_host"
              onChange={this.handleChange}
              value={this.state.AS_leave_host} type="checkbox" />
          </div>
          <div>
            <label htmlFor="form_submit_natural_click">Simulate natural click on submit?</label>
            <input
              id="form_submit_natural_click"
              name="AS_form_submit_natural_click"
              onChange={this.handleChange}
              value={this.state.AS_form_submit_natural_click}
              type="checkbox"
            />
          </div>
          <div>
            <label htmlFor="formdepth">Maximum form page depth</label>
            <input id="formdepth" name="AS_formdepth"
              onChange={this.handleChange}
              value={this.state.AS_formdepth} type="text" />
          </div>
          <div>
            <label htmlFor="link_priority">Click matching links first</label>
            <input id="link_priority" name="AS_link_priority"
              onChange={this.handleChange}
              value={this.state.AS_link_priority} type="text"
            />
          </div>
          <div>
            <label htmlFor="ignore_links">Ignore matching links</label>
            <input id="ignore_links" name="AS_ignore_links"
              onChange={this.handleChange}
              value={this.state.AS_ignore_links} type="text"
            />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.baseUrlRef.current.focus();
  }

  scrapeControls = () => {
    //<button id="reset-scrape" onClick={this.reset}>Reset Options</button>
    if (!this.props.scrape || !this.props.scrape.status) {
      return (
        <button id="start-scrape" onClick={this.startScrape}>Start</button>
      );
    }
    const status = this.props.scrape.status;
    if (status === SCRAPE_STATUS.SUCCESS || status === SCRAPE_STATUS.FAILURE) {
      return <button id="start-scrape" onClick={this.startScrape}>Start</button>
    } else if (status === SCRAPE_STATUS.RUNNING || status === SCRAPE_STATUS.PENDING) {
      return <button id="cancel-scrape" onClick={this.stopScrape}>Stop</button>;
    }
  }

  render() {
    return (
      <div id="main">
        <form onSubmit={this.handleSubmit} onChange={this.handleChange} id="controls">
          <div id="main-controls">
            <input value={this.state.AS_baseurl} onChange={this.handleChange}
              name="AS_baseurl" type="text" placeholder="Base URL to scrape..."
              ref={this.baseUrlRef}
            />
            <div id="toggle-wrapper">
              <span onClick={this.toggleAdvanced}>
                {!this.state.showAdvanced ? '🔧' : '✖'}
              </span>
              { this.scrapeControls() }
            </div>
            { this.advancedControls() }

            { this.scrapeStatus() }
          </div>
        </form>
        { this.scrapeComplete() }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { step, scrape } = state;
  return { step, scrape };
}

export default connect(mapStateToProps, {})(Scraper);
