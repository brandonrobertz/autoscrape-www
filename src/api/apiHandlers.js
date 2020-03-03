import { call, cancelled, put, fork, race, take, takeLatest, takeEvery, all } from 'redux-saga/effects';
import objectAssignDeep from "object-assign-deep";
import * as api from 'api/requests';

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

function* scrapeHandler(action) {
  const base = "SCRAPE"
  const initialResponse = yield call(api.startScrape, action.payload);
  let data = {
    id: initialResponse.data,
  };
  yield put({type: `${base}_PENDING`, payload: data});
  try {
    while (true) {
      const response = yield call(api.pollProgress, data);
      data = update(data, response);
      if (response.message === "SUCCESS") {
        const filesList = yield call(api.fetchFilesList, data);

        // filename => html, css
        const htmlAndCSS = {};

        for(let i = 0; i < filesList.data.length; i++) {
          const fileInfo = filesList.data[i];

          // fetch the file data
          const fid = fileInfo.id;
          const result = yield call(api.fetchFile, {
            id: data.id, file_id: fid
          });
          filesList.data[i].data = atob(result.data.data)

          // skip screenshots/downloads for the documents structure
          if (fileInfo.fileclass !== "crawl_pages" &&
              fileInfo.fileclass !== "data_pages")
              continue;

          // extract extension and add to HTML/CSS data
          const matches = fileInfo.name.match(/(.*)\.([^\\.]{3,})$/);
          let extension = matches[2];
          if (extension !== "css") {
            extension = "html";
          }
          let filename = fileInfo.name;
          // AutoScrape saves CSS as [path].html.css
          if (fileInfo.name.endsWith(".css")) {
            filename = matches[1];
          }
          if (!htmlAndCSS[filename]) {
            htmlAndCSS[filename] = {
              name: filename
            };
          }
          htmlAndCSS[filename][extension] = atob(result.data.data);
        }

        const documents = Object.keys(htmlAndCSS).map((filename) => {
          const doc = htmlAndCSS[filename]
          return {
            name: filename,
            html: doc.html,
            css: doc.css,
          };
        });

        data.filesList = filesList.data;
        data.documents = documents;
        yield put({type: `${base}_SUCCESS`, payload: data});
        break;
      } else if (response.message === "FAILURE") {
        yield put({type: `${base}_FAILED`, payload: data});
        break;
      }
      yield call(sleep, 5000);
      yield put({type: `${base}_RUNNING`, payload: data});
      yield call(api.pollProgress, data);
    }
  } catch (error) {
    console.error(error);
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

function* watchScrape() {
  yield takeEvery("SCRAPE_REQUESTED", function* (...args) {
    yield race({
      task: call(scrapeHandler, ...args),
      cancel: take("STOP_SCRAPE_REQUESTED"),
    });
  });
}

watchers.push(fork(watchScrape));

export default function* root() {
  yield all(watchers)
}
