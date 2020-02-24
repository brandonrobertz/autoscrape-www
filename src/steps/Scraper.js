import React from "react"
import { connect } from 'react-redux'
import M from 'materialize-css';

import store from 'state/store';
import { SCRAPE_STATUS } from 'state/reducers/root';

import 'steps/Scraper.css'

class Scraper extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      scrapeId: null,
      showAdvanced: false,
      showBuilder: false,
      inputDesc: [],
      currentInput: {
        type: "text input",
        ith: "",
        text: "",
        check: true,
      },
      materialzeInited: false,
      formComplete: false,
      // AutoScrape fields
      AS_backend: "selenium",
      AS_baseurl: "",
      AS_form_submit_wait: "5",
      AS_input: "",
      AS_save_graph: false,
      AS_load_images: false,
      AS_maxdepth: "2",
      AS_formdepth: "10",
      AS_next_match: "",
      AS_leave_host: false,
      AS_show_browser: false,
      AS_driver: "Firefox",
      AS_form_submit_natural_click: false,
      AS_link_priority: "",
      AS_keep_filename: false,
      AS_ignore_links: "",
      AS_form_match: "",
      AS_save_screenshots: true,
      AS_remote_hub: "",
      AS_loglevel: "INFO",
      AS_disable_style_saving: false,
    };
    this.baseUrlRef = React.createRef();
    this.state = this.defaultState;
  }

  isFormValid = () => {
    if (!this.state.AS_baseurl) return false;
    return true;
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const formComplete = this.isFormValid();
    this.setState({
      [event.target.name]: value,
      formComplete: formComplete,
    });
  }

  // we don't use submit, disable it here
  handleSubmit  = (e) => {
    e.preventDefault();
  }

  toggleAdvanced = (e) => {
    e.preventDefault();
    // don't toggle on enter (detail contains click count)
    if (e.detail === 0) {
      return;
    }
    this.setState({showAdvanced: !this.state.showAdvanced});
  }

  toggleBuilder = (e) => {
    this.setState({showBuilder: !this.state.showBuilder});
  }

  fetchFile = (file_id) => {
    const id = this.state.scrapeId;
    const url = `${this.state.AS_baseurl}/files/data/${id}/${file_id}`
    return fetch(url).then((response) => {
      return response.json();
    });
  }

  autoscrapeData = () => {
    const data = {};
    Object.keys(this.state).forEach((k) => {
      if (!k.startsWith("AS_")) return;
      const name = k.replace("AS_", "");
      if (name === "AS_ignore_links" || name === "AS_link_priority") {
        data[name] = this.state[k].replace(",", "|");
      } else {
        data[name] = this.state[k];
      }
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

  nextStep() {
    store.dispatch({
      type: "CHANGE_STEP",
      payload: {
        step: "build-extractor",
      }
    });
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
        <div className="next">
          <button type="button" onClick={this.nextStep}>Build Extractor &rarr;</button>
        </div>
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

  capitalize(str) {
    return str.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  }

  buildInputDesc(desc) {
    const typeChars = {
      "text input": "i",
      "checkbox": "c",
      "option select": "o",
      "date input": "d",
    };
    const fullInputDesc = desc.map((i) => {
      const typeChr = typeChars[i.type];
      const ith = Number.parseInt(i.ith.replace(/[^0-9]+/, '')) - 1;
      let value = i.text;
      if (i.type === "checkbox") {
        value = this.capitalize(`${i.check}`);
      }
      const code = `${typeChr}:${ith}:${value}`;
      return code;
    }).join(";");
    return fullInputDesc;
  }

  onInputChange(name, event) {
    const nextInput = this.state.currentInput;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    nextInput[name] = value;
    this.setState({
      currentInput: nextInput,
    });
  }

  addInput = () => {
    const inp = Object.assign({}, this.state.currentInput);
    const nextInputDesc = this.state.inputDesc.concat([inp]);
    const nextInput = this.buildInputDesc(nextInputDesc);
    this.setState({
      inputDesc: nextInputDesc,
      currentInput: {
        type: "text input",
        ith: "",
        text: "",
        check: true,
      },
      AS_input: nextInput,
    });
  }

  removeInput(index) {
    const nextInputDesc = [
      ...this.state.inputDesc.slice(0, index),
      ...this.state.inputDesc.slice(index + 1)
    ];
    const nextInput = this.buildInputDesc(nextInputDesc);
    this.setState({
      inputDesc: nextInputDesc,
      AS_input: nextInput,
    });
  }

  inputBuilder() {
    const inputs = this.state.inputDesc.map((i, ix) => {
      if (i.type === "text input") {
        return (
          <div key={`input-plan-${ix}`} className="input-desc">
            Type "{i.text}" into text field #{i.ith}
            <span className="remove-input" onClick={this.removeInput.bind(this, ix)}>x</span>
          </div>
        );
      } else if (i.type === "checkbox") {
        return (
          <div key={`input-plan-${ix}`} className="input-desc">
            { i.check ? "Check" : "Uncheck"} checkbox #{i.ith}
            <span className="remove-input" onClick={this.removeInput.bind(this, ix)}>x</span>
          </div>
        );
      } else if (i.type === "option select") {
        return (
          <div key={`input-plan-${ix}`} className="input-desc">
            Choose "{i.text}" in option selector #{i.ith}
            <span className="remove-input" onClick={this.removeInput.bind(this, ix)}>x</span>
          </div>
        );
      } else if (i.type === "date input") {
        return (
          <div key={`input-plan-${ix}`} className="input-desc">
            Select "{i.text}" in date selector #{i.ith}
            <span className="remove-input" onClick={this.removeInput.bind(this, ix)}>x</span>
          </div>
        );
      }

      return null;
    });
    return (
      <div id="input-builder">
        <div className="col s12 input-plan-viewer">
          { inputs }
        </div>
        <div className="col s3 field-input">
          <label htmlFor="current-input-type" className="active">
            Form field type
          </label>
          <select id="current-input-type"
            onChange={this.onInputChange.bind(this, "type")}
            value={this.state.currentInput.type}>
            <option value="text input">Text input</option>
            <option value="checkbox">Checkbox</option>
            <option value="option select">Option Selector</option>
            <option value="date input">Date input</option>
          </select>
        </div>
        <div className="col s2 field-input">
          <label htmlFor="current-input-ith" className="active">
            Which {this.state.currentInput.type}
          </label>
          <input id="current-input-ith"
            type="text"
            placeholder="1"
            value={this.state.currentInput.ith}
            onChange={this.onInputChange.bind(this, "ith")}
          />
        </div>
        { this.selectorForType(this.state.currentInput.type) }
        <div className="col s1">
          <button type="button" onClick={this.addInput}>
            Add
          </button>
        </div>
      </div>
    );
  }

  selectorForType(type) {
    if (type === "text input" || type === "option select") {
      return (
        <div className="col s5 field-input">
          <label htmlFor="current-input-text" className="active">
            { type === "text input" ? "What to fill in" : "Option to select" }
          </label>
          <input id="current-input-text"
            type="text"
            placeholder="Enter text..."
            value={this.state.currentInput.text}
            onChange={this.onInputChange.bind(this, "text")}
          />
        </div>
      );
    }
    else if (type === "checkbox") {
      return (
        <div className="col s5">
          <label htmlFor="current-input-text">
            <input id="current-input-text"
              type="checkbox"
              checked={this.state.currentInput.check}
              onChange={this.onInputChange.bind(this, "check")}
            />
            <span>Check checkbox?</span>
          </label>
        </div>
      );
    }
    else if (type === "date input") {
      return (
        <div className="col s5">
          <label htmlFor="current-input-text">
            Which date
          </label>
          <input id="current-input-text"
            type="text"
            placeholder="YYYY-MM-DD"
            value={this.state.currentInput.text}
            onChange={this.onInputChange.bind(this, "text")}
          />
        </div>
      );
    }
  }

  advancedControls() {
    if (!this.state.showAdvanced) return;
    /**
     * <div className="col s3 input-field">
     *   <input id="formdepth" name="AS_formdepth"
     *     onChange={this.handleChange}
     *     value={this.state.AS_formdepth} type="text" />
     *   <label htmlFor="formdepth" className="active">
     *     Max results pages
     *   </label>
     * </div>
     */
    return (
      <div id="advanced-controls">
        <h2>AutoScrape Options</h2>
        <div className="row">
          <div className="col s12 input-field">
            <select
              value={this.state.AS_backend}
              onChange={this.handleChange}
              id="AS_backend"
              name="AS_backend"
            >
              <option value="requests">Requests (fast, but only for basic web pages)</option>
              <option value="selenium">Selenium (Firefox, slow but can deal with JavaScript)</option>
            </select>
            <label htmlFor="AS_backend">
              Scraper backend
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col s12 input-field section">
            <h3>Form interaction</h3>
          </div>
          <div className="col s12 input-field">
            <input name="AS_form_match"
              id="form_match"
              onChange={this.handleChange}
              placeholder="Unique text can we use to find your form (e.g. Search candidates here)"
              value={this.state.AS_form_match} type="text" />
            <label className="active" htmlFor="form_match">
              Form text
            </label>
          </div>
          <div className="col s12 input-field">
            <input name="AS_next_match"
              id="next_match"
              onChange={this.handleChange}
              placeholder="Text can we use to find next page buttons"
              value={this.state.AS_next_match} type="text" />
            <label className="active" htmlFor="next_match">
              Next page button text
            </label>
          </div>
          <div className="col s9 input-field">
            <input
              id="input"
              name="AS_input"
              value={this.state.AS_input}
              onChange={this.handleChange}
              placeholder="Use the builder to the right..."
              type="text" />
            <label className="active" htmlFor="input">
              Form input plan
            </label>
          </div>
          <div className="col s3 input-field">
            <div
              id="toggle-builder"
              onClick={this.toggleBuilder}>
              { !this.state.showBuilder ?
                "Tell AutoScrape how to fill out search form..." :
                "Close form filler builder"
              }
            </div>
          </div>
          { this.state.showBuilder && this.inputBuilder() }
        </div>

        <div className="row">
          <div className="col s12 input-field section">
            <h3>Link Clicking</h3>
          </div>
          <div className="col s12 input-field">
            <input id="link_priority" name="AS_link_priority"
              onChange={this.handleChange}
              value={this.state.AS_link_priority}
              placeholder='Case-sensitive texts, separated by comma (e.g.: Accept, More data)'
              type="text"
            />
            <label htmlFor="link_priority" className="active">
              Click matching link text first
            </label>
          </div>
          <div className="col s12 input-field">
            <input id="ignore_links" name="AS_ignore_links"
              onChange={this.handleChange}
              value={this.state.AS_ignore_links}
              placeholder='Case-sensitive texts, separated by comma (e.g.: Logout)'
              type="text"
            />
            <label htmlFor="ignore_links" className="active">
              Ignore matching link text
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col s12 input-field section">
            <h3>miscellaneous Scrape</h3>
          </div>
          <div className="col s3 input-field">
            <input id="maxdepth" name="AS_maxdepth"
              onChange={this.handleChange}
              value={this.state.AS_maxdepth}
              className="active"
              type="text" />
            <label className="active"
              htmlFor="maxdepth">Max crawl depth (clicks)</label>
          </div>
          <div className="col s3 input-field">
            <input id="form_submit_wait"
              name="AS_form_submit_wait"
              onChange={this.handleChange}
              type="text"
              value={this.state.AS_form_submit_wait}
            />
            <label className="active" htmlFor="form_submit_wait">Page wait (secs)</label>
          </div>
        </div>

        <div className="row">
          <div className="col s2">
            <label>
              <input id="leave_host" name="AS_leave_host"
                onChange={this.handleChange}
                value={this.state.AS_leave_host}
                type="checkbox" />
              <span>Leave host</span>
            </label>
          </div>
          <div className="col s5">
            <label>
              <input name="AS_load_images"
                id="load_images"
                onChange={this.handleChange}
                value={this.state.AS_load_images}
                type="checkbox" />
              <span>Load images (faster, usually not necessary)</span>
            </label>
          </div>
          <div className="col s5">
            <label>
              <input
                id="form_submit_natural_click"
                name="AS_form_submit_natural_click"
                onChange={this.handleChange}
                value={this.state.AS_form_submit_natural_click}
                type="checkbox"
              />
              <span>Simulate natural click on submit (required for some poorly programmed sites)</span>
            </label>
          </div>
        </div>

      </div>
    );
  }

  componentDidUpdate() {
    if (this.state.materialzeInited) return;
    M.AutoInit();
    this.setState({
      materialzeInited: true,
    });
  }

  componentDidMount() {
    M.AutoInit();
    this.baseUrlRef.current.focus();
  }

  scrapeControls = () => {
    //<button id="reset-scrape" onClick={this.reset}>Reset Options</button>
    if (!this.props.scrape || !this.props.scrape.status) {
      return (
        <button
          id="start-scrape"
          type="submit"
          onClick={this.startScrape}
          disabled={!this.state.formComplete}
        >
          Start
        </button>
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
        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <div className="row">
            <div className="advanced-wrapper">
              <button className="advanced" type="button" onClick={this.toggleAdvanced}>
                {!this.state.showAdvanced ? 'Show Options 🔧' : 'Hide Options ✖'}
              </button>
            </div>
          </div>
          { this.advancedControls() }
          <div id="main-controls" className="row">
            <div className="col s8">
              <input value={this.state.AS_baseurl}
                onChange={this.handleChange}
                name="AS_baseurl"
                type="text"
                required={true}
                placeholder="Enter a base URL to scrape..."
                ref={this.baseUrlRef}
              />
            </div>
            <div className="col s4">
              <div id="toggle-wrapper">
                { this.scrapeControls() }
              </div>
            </div>
          </div>
          { this.scrapeStatus() }
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
