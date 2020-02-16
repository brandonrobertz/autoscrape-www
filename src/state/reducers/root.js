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
      const completeScrapeState = action.payload;
      completeScrapeState.status = SCRAPE_STATUS.SUCCESS;
      completeScrapeState.message = "Scrape complete!";
      return update(state, {
        scrape: completeScrapeState,
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
