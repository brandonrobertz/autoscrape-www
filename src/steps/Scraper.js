import React from "react"
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router'
import { saveAs } from 'file-saver'
import M from 'materialize-css'

import store from 'state/store';
import history from 'state/history';
import { SCRAPE_STATUS } from 'state/reducers/scrape'
//import DownloadHTML from 'steps/DownloadHTML'
//import ScrapeComplete from 'steps/ScrapeComplete'

import 'steps/Scraper.css'

class Scraper extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      scrapeId: null,
      showAdvanced: false,
      showLoadSave: false,
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
      formIncompleteMessage: "",
      // AutoScrape fields
      AS_backend: "selenium",
      AS_baseurl: "",
      AS_form_submit_wait: "5",
      AS_input: "",
      AS_save_graph: false,
      AS_load_images: false,
      AS_maxdepth: "",
      AS_formdepth: "",
      AS_next_match: "",
      AS_leave_host: false,
      AS_show_browser: false,
      AS_driver: "Firefox",
      //AS_form_submit_natural_click: false,
      AS_result_page_links: "",
      AS_only_links: "",
      AS_keep_filename: false,
      AS_ignore_links: "",
      AS_form_match: "",
      AS_save_screenshots: true,
      AS_remote_hub: "",
      AS_loglevel: "INFO",
      AS_page_timeout: "60",
      AS_disable_style_saving: false,
      AS_form_submit_button_selector: "brandon",
    };
    this.baseUrlRef = React.createRef();
    this.loadConfigInput = React.createRef();
    this.state = Object.assign({}, this.defaultState);
  }

  isFormValid = () => {
    const baseurl = this.state.AS_baseurl;
    if (!baseurl) return false;
    if (!baseurl.startsWith("http")) return false;
    return true;
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    let formComplete = this.state.formComplete;
    let formIncompleteMessage = "";
    if (name === "AS_baseurl") {
      if (!value) formComplete = false;
      else if (!value.match(/https?:\/\/[^\\.]+\.[^\\.]+.*$/)) {
        formComplete = false;
        formIncompleteMessage = "You need a full url, including the 'http' or 'https'.";
      } else if (value) {
        formIncompleteMessage = "";
        formComplete = true;
      }
    } else {
      formComplete = true;
    }
    this.setState({
      [name]: value,
      formComplete: formComplete,
      formIncompleteMessage: formIncompleteMessage,
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

  toggleLoadSave = (e) => {
    e.preventDefault();
    // don't toggle on enter (detail contains click count)
    if (e.detail === 0) {
      return;
    }
    this.setState({showLoadSave: !this.state.showLoadSave});
  }

  toggleBuilder = (e) => {
    this.setState({showBuilder: !this.state.showBuilder});
  }

  autoscrapeData = () => {
    const data = {};
    Object.keys(this.state).forEach((k) => {
      if (!k.startsWith("AS_")) return;
      const name = k.replace("AS_", "");
      const is_link_list = (
           name === "ignore_links"
        || name === "only_links"
        || name === "result_page_links"
      );
      if (is_link_list) {
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
    history.push("/build-extractor")
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
      "option select": "s",
      "date input": "d",
      "radio": "r",
    };
    const fullInputDesc = desc.map((i) => {
      const typeChr = typeChars[i.type];
      const ith = Number.parseInt(i.ith.replace(/[^0-9]+/, '')) - 1;
      let value = i.text.replace(",", "\\,");
      if (i.type === "checkbox") {
        value = this.capitalize(`${i.check}`);
      } else if (i.type === "radio") {
        value = Number.parseInt(value.replace(/[^0-9]+/, '')) - 1;
      }
      const code = `${typeChr}:${ith}:${value}`;
      return code;
    }).join(",");
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
      } else if (i.type === "radio") {
        return (
          <div key={`input-plan-${ix}`} className="input-desc">
            In radio checkbox group #{i.ith} select radio option #{i.text}
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
            <option value="radio">Radio checkbox</option>
          </select>
        </div>
        <div className="col s3 field-input">
          <label htmlFor="current-input-ith" className="active">
            Which {this.state.currentInput.type}
          </label>
          <input id="current-input-ith"
            type="text"
            placeholder="e.g., 1st, 3"
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
        <div className="col s3 field-input">
          <label htmlFor="current-input-text" className="active">
            { type === "text input" ? "What to fill in" : "Option to select" }
          </label>
          <input id="current-input-text"
            type="text"
            placeholder="E.g., John Smith"
            value={this.state.currentInput.text}
            onChange={this.onInputChange.bind(this, "text")}
          />
        </div>
      );
    }
    else if (type === "checkbox") {
      return (
        <div className="col s3">
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
        <div className="col s3">
          <label htmlFor="current-input-text">
            Which date
          </label>
          <input id="current-input-text"
            type="text"
            placeholder="e.g., YYYY-MM-DD"
            value={this.state.currentInput.text}
            onChange={this.onInputChange.bind(this, "text")}
          />
        </div>
      );
    } else if (type === "radio") {
      return (
        <div className="col s3 field-input">
          <label htmlFor="current-input-text" className="active">
            Which option?
          </label>
          <input id="current-input-text"
            type="text"
            placeholder="e.g., 1"
            value={this.state.currentInput.text}
            onChange={this.onInputChange.bind(this, "text")}
          />
        </div>
      );
    }
  }

  advancedControls() {
    if (!this.state.showAdvanced) return;
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
              placeholder="e.g., Search for candidates"
              value={this.state.AS_form_match} type="text" />
            <label className="active" htmlFor="form_match">
              Unique text can we use to find your form
            </label>
          </div>
          <div className="col s12 input-field">
            <input name="AS_next_match"
              id="next_match"
              onChange={this.handleChange}
              placeholder="e.g., Next Page ->"
              value={this.state.AS_next_match} type="text" />
            <label className="active" htmlFor="next_match">
              Text we can use to get to next result page
            </label>
          </div>
          <div className="col s8 input-field">
            <input
              id="input"
              name="AS_input"
              value={this.state.AS_input}
              onChange={this.handleChange}
              placeholder=""
              type="text" />
            <label className="active" htmlFor="input">
              Form input plan (use the builder to the right)
            </label>
          </div>
          <div className="col s4 input-field">
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
          <div className="col s12 input-field">
            <input id="result_page_links" name="AS_result_page_links"
              onChange={this.handleChange}
              value={this.state.AS_result_page_links}
              placeholder='e.g., view details'
              type="text"
            />
            <label htmlFor="result_page_links" className="active">
              Click only these links on result pages (case-sensitive,
              separated by comma)
            </label>
          </div>

          <div className="col s12 input-field">
            <input
              id="form_submit_button_selector"
              name="AS_form_submit_button_selector"
              onChange={this.handleChange}
              placeholder=""
              value={this.state.AS_form_submit_button_selector}
              type="text"
            />
            <label htmlFor="form_submit_button_selector" className="active">
              XPath selector to submit button
             (use this if AutoScrape can't find submit button)
            </label>
          </div>

        </div>

        <div className="row">
          <div className="col s12 input-field section">
            <h3>Link Clicking (Text or Regex)</h3>
            <p className="link-options-desc">
              These options control link clicking <b>before submitting
              forms</b>. Any rules applied here will not be used on results
              pages. Use these options to perform basic crawls or for
              instructing AutoScrape how to get to a search form.
            </p>
          </div>
          <div className="col s12 input-field">
            <input id="only_links" name="AS_only_links"
              onChange={this.handleChange}
              value={this.state.AS_only_links}
              placeholder='e.g. Accept Terms'
              type="text"
            />
            <label htmlFor="only_links" className="active">
              Link whitelist: only click matching text
            </label>
          </div>
          <div className="col s12 input-field">
            <input id="ignore_links" name="AS_ignore_links"
              onChange={this.handleChange}
              value={this.state.AS_ignore_links}
              placeholder='e.g. Logout, Leave site'
              type="text"
            />
            <label htmlFor="ignore_links" className="active">
              Link blacklist: ignore matching text
            </label>
          </div>
          <div className="col s4 input-field">
            <input id="formdepth" name="AS_formdepth"
              placeholder=""
              onChange={this.handleChange}
              value={this.state.AS_formdepth} type="text" />
            <label htmlFor="formdepth" className="active">
              Maximum results pages
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col s12 input-field section">
            <h3>miscellaneous Scrape</h3>
          </div>
          <div className="col s3 input-field">
            <input id="maxdepth"
              name="AS_maxdepth"
              type="text"
              placeholder=""
              onChange={this.handleChange}
              value={this.state.AS_maxdepth}
            />
            <label className="active"
              htmlFor="maxdepth">
              Limit crawl depth
            </label>
          </div>
          <div className="col s4 input-field">
            <input id="form_submit_wait"
              name="AS_form_submit_wait"
              type="text"
              placeholder=""
              onChange={this.handleChange}
              value={this.state.AS_form_submit_wait}
            />
            <label className="active" htmlFor="form_submit_wait">
              Wait after submit (secs)
            </label>
          </div>
          <div className="col s4 input-field">
            <input id="page_timeout"
              name="AS_page_timeout"
              type="text"
              placeholder=""
              onChange={this.handleChange}
              value={this.state.AS_page_timeout}
            />
            <label className="active" htmlFor="page_timeout">
              Page timeout (secs)
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col s6">
            <label>
              <input id="leave_host" name="AS_leave_host"
                onChange={this.handleChange}
                defaultChecked={this.state.AS_leave_host}
                type="checkbox" />
              <span>Leave host</span>
            </label>
          </div>
          <div className="col s6">
            <label>
              <input name="AS_keep_filename"
                id="keep_filename"
                onChange={this.handleChange}
                defaultChecked={this.state.AS_keep_filename}
                type="checkbox" />
              <span>Save filenames, not hashes (might cause missing HTML pages)</span>
            </label>
          </div>
          <div className="col s6">
            <label>
              <input name="AS_load_images"
                id="load_images"
                onChange={this.handleChange}
                defaultChecked={this.state.AS_load_images}
                type="checkbox" />
              <span>Load images (slow, usually not necessary)</span>
            </label>
          </div>
          {/*
          <div className="col s6">
            <label>
              <input
                id="form_submit_natural_click"
                name="AS_form_submit_natural_click"
                onChange={this.handleChange}
                defaultChecked={this.state.AS_form_submit_natural_click}
                type="checkbox"
              />
              <span>Simulate natural click on submit (required for some poorly programmed sites)</span>
            </label>
          </div>*/}
        </div>

      </div>
    );
  }

  saveConfig = (e) => {
    e.preventDefault();
    const config = {
      inputDesc: this.state.inputDesc,
      AS_backend: this.state.AS_backend,
      AS_baseurl: this.state.AS_baseurl,
      AS_form_submit_wait: this.state.AS_form_submit_wait,
      AS_page_timeout: this.state.AS_page_timeout,
      AS_input: this.state.AS_input,
      AS_save_graph: this.state.AS_save_graph,
      AS_load_images: this.state.AS_load_images,
      AS_maxdepth: this.state.AS_maxdepth,
      AS_formdepth: this.state.AS_formdepth,
      AS_next_match: this.state.AS_next_match,
      AS_leave_host: this.state.AS_leave_host,
      AS_keep_filename: this.state.AS_keep_filename,
      AS_show_browser: this.state.AS_show_browser,
      AS_driver: this.state.AS_driver,
      AS_form_submit_natural_click: this.state.AS_form_submit_natural_click,
      AS_result_page_links: this.state.AS_result_page_links,
      AS_only_links: this.state.AS_only_links,
      AS_ignore_links: this.state.AS_ignore_links,
      AS_form_match: this.state.AS_form_match,
      AS_save_screenshots: this.state.AS_save_screenshots,
      AS_remote_hub: this.state.AS_remote_hub,
      AS_loglevel: this.state.AS_loglevel,
      AS_disable_style_saving: this.state.AS_disable_style_saving,
      AS_form_submit_button_selector: this.state.AS_form_submit_button_selector,
    };
    const strData = JSON.stringify(config);
    const blob = new Blob([strData]);
    const now = (new Date()).getTime();
    saveAs(blob, `autoscrape-config-${now}.json`)
  }

  /**
   * Do the actual import of config values from saved
   * JSON config file.
   */
  loadConfigFromFile = (filereader, e) => {
    const text = filereader.result;
    const jsonData = JSON.parse(text);
    const newState = Object.assign({}, this.defaultState);
    Object.keys(jsonData).forEach((key) => {
      newState[key] = jsonData[key];
    });
    newState.showLoadSave = false;
    newState.formComplete = true;
    this.setState(newState);
  }

  /**
   * Setup JSON file load, run loader (loadConfigFromFile)
   * once it's loaded.
   */
  loadConfig = (e) => {
    e.preventDefault();
    if (!this.loadConfigInput.current.files[0]) return;
    const file = this.loadConfigInput.current.files[0];
    const filereader = new FileReader();
    filereader.onloadend = this.loadConfigFromFile.bind(this, filereader);
    filereader.readAsText(file);
  }

  loadSave() {
    if (!this.state.showLoadSave) return;
    return (
      <div id="load-save">
        <button onClick={this.toggleLoadSave} className="close">
          Close [X]
        </button>
        <div className="inner">
          <h2>Load/Save Scrape Config</h2>
          <p>
            Using this dialog, you can save your current scrape configuration or
            load a previously saved one. This will not load your previous data,
            but it will load the parameters you used to perform a scrape
            so it can be re-ran.
          </p>
          <div className="center">
            <form onSubmit={this.loadConfig}>
              <input type="file" accept=".json" ref={this.loadConfigInput} />
              <input type="submit" value="Load Saved Config" />
            </form>
            <button onClick={this.saveConfig}>Save Current Config</button>
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.state.materialzeInited) {
      M.AutoInit();
      this.setState({
        materialzeInited: true,
      });
    }
  }

  componentDidMount() {
    if (!this.state.materialzeInited && this.baseUrlRef && this.baseUrlRef.current) {
      M.AutoInit();
      this.baseUrlRef.current.focus();
    }
  }

  scrapeControls = () => {
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
    if (this.props.scrape && this.props.scrape.status === SCRAPE_STATUS.SUCCESS) {
      return (<Redirect to={`/scrape/${this.props.scrape.id}`} />);
    }
    return (
      <div id="main">
        { this.loadSave() }
        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <div className="row">
            <div className="advanced-wrapper">
              {!this.state.showAdvanced &&
                <p className="info">
                  AutoScrape will crawl a website, by default.
                  The options menu will allow you to interact with pages and
                  perform more complicated scrapes.
                </p>
              }<br/>
              <button className="advanced" type="button" onClick={this.toggleAdvanced}>
                {!this.state.showAdvanced ? 'Show Options 🔧' : 'Hide Options ✖'}
              </button>
              <button className="advanced" type="button" onClick={this.toggleLoadSave}>
                Load/Save <span role="img" aria-label="Floppy disk">💾</span>
              </button>
            </div>
          </div>
          { this.advancedControls() }
          <div id="main-controls" className="row">
            { this.state.formIncompleteMessage &&
              <div className="error">
                { this.state.formIncompleteMessage }
              </div>
            }
            <div className="col s9">
              <input value={this.state.AS_baseurl}
                onChange={this.handleChange}
                name="AS_baseurl"
                type="text"
                required={true}
                placeholder="Enter a base URL to scrape, e.g. https://site.com/page"
                ref={this.baseUrlRef}
              />
            </div>
            <div className="col s3">
              <div id="toggle-wrapper">
                { this.scrapeControls() }
              </div>
            </div>
          </div>
          { this.scrapeStatus() }
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { step, scrape } = state;
  return { step, scrape };
}

export default withRouter(connect(mapStateToProps, {})(Scraper));
