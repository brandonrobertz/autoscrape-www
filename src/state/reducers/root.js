import { update } from 'state/util';

const initialState = {
  step: "scraper",
  scrape: {},
  hext: null,
};

export const SCRAPE_STATUS = {
  FAILURE: "FAILURE",
  SUCCESS: "SUCCESS",
  RUNNING: "RUNNING",
  PENDING: "PENDING",
};

export const rootReducer = (state, action) => {
  if (state === undefined) {
    return initialState;
  }

  switch(action.type) {
    case "CHANGE_STEP":
      return update(state, {
        step: action.payload.step,
      });

    case "SCRAPE_PENDING":
      return update(state, {
        scrape: {
          id: action.payload.id,
          status: SCRAPE_STATUS.PENDING,
          message: "Scrape queued, waiting for turn to run...",
        }
      });
    case "SCRAPE_RUNNING":
      const runningScrapeState = action.payload;
      runningScrapeState.status = SCRAPE_STATUS.RUNNING;
      runningScrapeState.message = "Scrape running.";
      return update(state, {
        scrape: runningScrapeState,
      });
    case "SCRAPE_SUCCESS":
      return update(state, {
        scrape: {
          id: action.payload.id,
          filesList: action.payload.filesList,
          documents: action.payload.documents,
          status: SCRAPE_STATUS.SUCCESS,
          message: "Scrape complete! You can now move to the build extractor step, above.",
        }
      });
    case "SCRAPE_CANCELLED":
      return update(state, {
        scrape: {
          status: SCRAPE_STATUS.FAILURE,
          message: "Scrape cancelled.",
        }
      });
    case "SCRAPE_FAILED":
      return update(state, {
        scrape: {
          id: action.payload.id,
          status: SCRAPE_STATUS.FAILURE,
          message: "Scrape failed.",
        }
      });

    case "HEXT_RECEIVED":
      return update(state, {
        hext: action.payload,
      });

    default:
      return state;
  }
};
