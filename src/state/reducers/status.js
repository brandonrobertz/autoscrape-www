import { update } from 'state/util';

const initialState = {
  status: null,
  details: null,
};

export const statusReducer = (state, action) => {
  if (state === undefined) {
    return initialState;
  }

  switch(action.type) {
    case "LOAD_SCRAPE_REQUESTED":
    case "LOAD_SCRAPE_PENDING":
      return {
        status: "Loading scrape..."
      };

    case "BUILD_ZIP_REQUESTED":
      return {
        status: "Building ZIP..."
      };

    case "EXTRACT_DATA_REQUESTED":
      return {
        status: "Extracting data..."
      };

    // display file loading information, progress, etc
    case "UPDATE_STATUS_DETAILS":
      return update(state, {
        details: action.payload
      });

    case "SCRAPE_SUCCESS":
    case "HEXT_CLEAR_REQUESTED":
    case "CLEAR_STATUS":
    case "CLEAR_SCRAPE":
      return initialState;

    default:
      return state;
  }
};
