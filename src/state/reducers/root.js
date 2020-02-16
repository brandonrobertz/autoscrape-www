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

    //case "SCRAPE_REQUESTED":
    case "SCRAPE_PENDING":
      return update(state, {
        scrape: {
          id: action.payload.id,
          status: SCRAPE_STATUS.PENDING,
          message: "Trying to start scrape...",
        }
      });
    case "SCRAPE_WAITING":
      return update(state, {
        scrape: {
          id: action.payload.id,
          status: SCRAPE_STATUS.PENDING,
          message: "Scrape queued.",
        }
      });
    case "SCRAPE_STARTED":
      return update(state, {
        scrape: {
          id: action.payload.id,
          status: SCRAPE_STATUS.STARTED,
          message: "Scrape running.",
        }
      });
    case "SCRAPE_SUCCESSFUL":
      return update(state, {
        scrape: {
          id: action.payload.id,
          status: SCRAPE_STATUS.SUCCESS,
          message: "Scrape complete!",
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
