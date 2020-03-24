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

    case "HEXT_CLEAR_REQUESTED":
    case "CLEAR_STATUS":
    case "CLEAR_SCRAPE":
      return initialState;

    default:
      return state;
  }
};
