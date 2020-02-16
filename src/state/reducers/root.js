import { update } from 'state/util';

const initialState = {
  step: "scraper",
  scrape: {},
};

export const SCRAPE_STATUS = {
  FAILURE: "FAILURE",
  SUCCESS: "SUCCESS",
  STARTED: "STARTED",
  PENDING: "PENDING",
};

export const rootReducer = (state, action) => {
  console.log("rootReducer state:", state, "action:", action);
  if (state === undefined) {
    return initialState;
  }

  switch(action.type) {
    case "CHANGE_STEP":
      return update(state, {
        step: action.payload.step,
      });

    case "START_SCRAPE_REQUESTED":
    case "START_SCRAPE_PENDING":
      return update(state, {
        scrape: {
          status: SCRAPE_STATUS.PENDING,
          message: "Trying to start scrape...",
        }
      });
    case "START_SCRAPE_SUCCESSFUL":
      return update(state, {
        scrape: {
          status: SCRAPE_STATUS.SUCCESS,
          message: "Scrape queued.",
        }
      });
    case "START_SCRAPE_FAILED":
      return update(state, {
        scrape: {
          status: SCRAPE_STATUS.FAILURE,
          message: "Starting scrape failed.",
        }
      });

    default:
      return state;
  }
};
