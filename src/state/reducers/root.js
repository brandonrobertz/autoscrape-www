import { update } from 'state/util';

const initialState = {
  step: "scraper",
  scrape: {},
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

    //case "SCRAPE_REQUESTED":
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
          filesList: action.payload.data,
          status: SCRAPE_STATUS.SUCCESS,
          message: "Scrape complete!",
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

    default:
      return state;
  }
};
