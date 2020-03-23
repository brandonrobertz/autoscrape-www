const initialState = "scraper";

export const stepReducer = (state, action) => {
  if (state === undefined) {
    return initialState;
  }

  switch(action.type) {
    case "CLEAR_SCRAPE":
      return initialState;

    case "CHANGE_STEP":
      return action.payload.step;

    default:
      return state;
  }
};
