import { call, cancelled, put, fork, race, take, takeLatest, takeEvery, all } from 'redux-saga/effects';
import objectAssignDeep from "object-assign-deep";
import * as api from 'api/requests';
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import Papa from 'papaparse'

import { update } from 'state/util'

const watchers = [];

/**
 * Builds a handler for an API request, given a function and base
 * action name. This is a top-level internal API for managing
 * our API requests and getting their results to record in our
 * redux store and then pass it down to the components through
 * our state tree (handled in src/state/store.js).
 *
 * It can be initiated on the _REQUESTED call.
 *
 * Adds action handlers for the following states:
 * _PENDING, _SUCCESSFUL, _FAILED
 *
 * (In the above notation, base is prefixed to the action type.)
 *
 * The _SUCCESSFUL response returns the action:
 *
 * { type: _SUCCESSFUL, data: { API response body } }
 *
 * The _FAILED response emits the action:
 *
 * { type: _FAILED, error: { API error } }
 *
 * The _PENDING action doesn't have a payload and is
 * simply meant to drive a loading message, etc.
 */
const mkHandler = (fn, base, latest=true) => {
  function* handler(action) {
    // dispatch a pending action for loading indication
    yield put({type: `${base}_PENDING`});
    try {
      // don't directly invoke the function here, pass the instruction to
      // middleware so we can test this in isolation
      const data = yield call(fn, action.payload);
      yield put({type: `${base}_SUCCESSFUL`, payload: data });
    } catch (error) {
      const errorData = error.response ? error.response.data : {};
      // use objectAssignDeep here because we want a two-way merge (meaning
      // if the second object tries to assign {} for a key and the first
      // one has this: {a: 1}, the result will be {a: 1} instead of {}
      // as Object.assign would do it.
      const errorPayload = objectAssignDeep({}, errorData, {
        statusCode: error.response ? error.response.status : null,
      });
      yield put({
        type: `${base}_FAILED`,
        payload: errorPayload,
      });
    }
  }

  // cancel any pending requests if concurrent requested
  // in the future, if we need to handle concurrent multiple
  // requests on the same resource we can toggle this and
  // use watchEvery instead
  function* watchHandler() {
    let takeFn = takeLatest;
    if (!latest) {
      takeFn = takeEvery;
    }
    yield takeFn(`${base}_REQUESTED`, handler);
  }
  // push the watcher to the stack for fork initialization
  watchers.push(fork(watchHandler));
  // return the handler for testing
  return handler;
};

export const stopScrape = mkHandler(api.stopScrape, "STOP_SCRAPE");
export const fetchFile = mkHandler(api.fetchFile, "FETCH_FILE");
export const fetchFilesList = mkHandler(api.fetchFilesList, "FETCH_FILES_LIST");

function* sleep(time) {
  yield new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Take a full file (with parsed data and fileclass, etc) and do
 * the necessary parsing to place it into a HTML-and-CSS
 * data structure, keyed by file. This is used for building
 * the document data structure.
 *
 * This doesn't replace htmlAndCSS, it adds entries to it.
 */
function recordToHtmlCss(file, htmlAndCSS) {
  // skip screenshots/downloads for the documents structure
  if (file.fileclass !== "crawl_pages" &&
      file.fileclass !== "data_pages")
      return;

  // extract extension and add to HTML/CSS data
  const matches = file.name.match(/(.*)\.([^\\.]{3,})$/);
  let extension = matches[2];
  if (extension !== "css") {
    extension = "html";
  }
  let filename = file.name;
  // AutoScrape saves CSS as [path].html.css
  if (file.name.endsWith(".css")) {
    filename = matches[1];
  }
  if (!htmlAndCSS[filename]) {
    htmlAndCSS[filename] = {
      name: filename
    };
  }
  htmlAndCSS[filename][extension] = file.data;
}

/**
 * Load the first hundred files of a scrape for showing
 * some scrape files and building templates. If the HTML
 * your're wanting to build a template for doesn't appear in the
 * first 100 results, your scrape is probably wrong.
 * Accepts scrapeId as parameter and yields the following:
 *
 * {
 *   type: "LOAD_SCRAPE_SUCCESS",
 *   payload: {
 *     documents: [{
 *       name: "file.ext",
 *       html: "<!doctype...",
 *       css: "CSS HERE",
 *     }, ...],
 *     filesList: [{
 *       name: "file.ext",
 *       data: "FILE DATA HERE",
 *       size: 188273,
 *       classname: "data-pages",
 *     }, ...],
 *   }
 * }
 */
function* loadScrape(action) {
  const scrapeId = action.payload;
  const data = {
    id: scrapeId,
    filesList: [],
    documents: [],
  };

  let page = 1;
  const maxResults = 100;
  const results = [];
  while (results.length < maxResults) {
    const listResult = yield call(api.fetchFilesList, {
      id: scrapeId,
      page: page,
    });
    listResult.data.forEach((rec) => {
      results.push(rec);
    });
    if (!listResult.has_next) {
      break;
    }
    page += 1;
  }

  const htmlAndCSS = {};

  for (let fileInfo of results) {
    const fileResponse = yield call(api.fetchFile, {
      id: scrapeId, file_id: fileInfo.id
    });

    const file = fileResponse.data;
    const parsedData = atob(file.data);
    const fullFile = {
      ...file,
      data: parsedData,
    };

    data.filesList.push(fullFile);
    recordToHtmlCss(fullFile, htmlAndCSS);
  }

  // build our documents set with HTML and CSS available in the same list
  // position, for building extraction template
  Object.keys(htmlAndCSS).forEach((filename) => {
    const doc = htmlAndCSS[filename];
    data.documents.push({
      name: filename,
      html: doc.html,
      css: doc.css,
    });
  });

  yield put({type: `SCRAPE_SUCCESS`, payload: data});
}

function* scrapeHandler(action) {
  const base = "SCRAPE"
  const initialResponse = yield call(api.startScrape, action.payload);
  let data = {
    id: initialResponse.data,
  };
  yield put({type: `${base}_PENDING`, payload: data});
  try {
    // poll until we're good or get a definite scrape failure
    while (true) {
      let response = null;
      try {
        response = yield call(api.pollProgress, data);
      } catch (error) {
        if (error.message !== "Network Error") {
          console.error("Poll Progress Error", error);
          throw error;
        }
        // ignore these and hope for best
        yield put({
          type: `${base}_NET_ERROR`,
          payload: data
        });
        yield call(sleep, 5000);
        continue;
      }

      data = update(data, response);

      if (response.message === "SUCCESS") {
        yield call(loadScrape, {payload: data.id});
        break;
      } else if (response.message === "FAILURE") {
        yield put({type: `${base}_FAILED`, payload: data});
        break;
      }
      const progResponse = yield call(api.pollProgress, data);
      if (progResponse.message === "STARTED") {
        yield put({type: `${base}_RUNNING`, payload: data});
      }
      yield call(sleep, 5000);
    }
  } catch (error) {
    yield put({
      type: `${base}_FAILED`,
      payload: {
        message: error.message,
        data: error.response ? error.response.data : {},
        code: error.response ? error.response.status : null,
      }
    });
  } finally {
    if (yield cancelled()) {
      yield put({type: `${base}_CANCELLED`, payload: data});
    }
  }
}

/**
 * Build a zip file. This will pull the full files list (not just
 * the first 100) and will build the ZIP without also storing
 * every file in memory. Will pop a saveAs on completion.
 *
 * Payload params:
 * { scrapeId: "scrape-id-here" }
 */
function* buildZip(action) {
  const { scrapeId } = action.payload;

  let page = 1;
  const results = [];
  while (true) {
    const listResult = yield call(api.fetchFilesList, {
      id: scrapeId,
      page: page,
    });
    listResult.data.forEach((rec) => {
      results.push(rec);
    });
    if (!listResult.has_next) {
      break;
    }
    page += 1;
  }

  const zip = new JSZip();
  for (let file of results) {
    const filename = `autoscrape-data/${file.name}`;
    const fileResponse = yield call(api.fetchFile, {
      id: scrapeId, file_id: file.id
    });
    const parsedData = atob(fileResponse.data.data);
    zip.file(filename, parsedData, {binary: true});
  }
  zip.generateAsync({type:"blob"}).then(blob => {
    const now = (new Date()).getTime();
    saveAs(blob, `autoscrape-data-${now}.zip`);
  });
}

/**
 * Extract data from HTML and build a specified output format.
 * Pops saveAs when complete. This pulls all files, not just
 * first 100.
 *
 * Payload:
 *   {
 *     hext: "hext-template-here",
 *     scrapeId: "scrape-id",
 *     format: "csv|json",
 *   }
 */
function* extractData(action) {
  const { scrapeId, hext, format } = action.payload;

  let page = 1;
  const records = [];
  while (true) {
    const listResult = yield call(api.fetchFilesList, {
      id: scrapeId,
      page: page,
    });
    for (let file of listResult.data) {
      // only extract from results pages
      if (file.fileclass !== "data_pages" && file.fileclass !== "crawl_pages") {
        continue;
      }
      // exclude CSS pages. HTML should remain
      const ext = file.name.match(/(.*)\.([^\\.]{3,})$/)[2];
      if (ext === "css") {
        continue;
      }

      const fileResponse = yield call(api.fetchFile, {
        id: scrapeId, file_id: file.id
      });
      const html = atob(fileResponse.data.data);
      const parsedHtml = new window.Module.Html(html);
      const rule = new window.Module.Rule(hext);
      const results = rule.extract(parsedHtml);
      // simply skip files with no results
      if (!results) return;
      results.forEach((r) => records.push(r));
    }

    if (!listResult.has_next) {
      break;
    }

    page += 1;
  }

  let strData = null;
  if (format === "json") {
    strData = JSON.stringify(records);
  } else if (format === "csv") {
    strData = Papa.unparse(records);
  }

  const blob = new Blob([strData]);
  const now = (new Date()).getTime();
  saveAs(blob, `autoscrape-data-${now}.${format}`)
}


function* watchScrape() {
  yield takeEvery("SCRAPE_REQUESTED", function* (...args) {
    yield race({
      task: call(scrapeHandler, ...args),
      cancel: take("STOP_SCRAPE_REQUESTED"),
    });
  });
}

function* watchLoadScrape() {
  yield takeLatest("LOAD_SCRAPE_REQUESTED", loadScrape);
}

function* watchBuildZip() {
  yield takeEvery("BUILD_ZIP_REQUESTED", buildZip);
}

function* watchExtractData() {
  yield takeEvery("EXTRACT_DATA_REQUESTED", extractData);
}

watchers.push(fork(watchScrape));
watchers.push(fork(watchLoadScrape));
watchers.push(fork(watchBuildZip));
watchers.push(fork(watchExtractData));

export default function* root() {
  yield all(watchers)
}
