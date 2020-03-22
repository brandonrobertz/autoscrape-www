const initialState = "scraper";

export const stepReducer = (state, action) => {
  if (state === undefined) {
    return initialState;
  }

  switch(action.type) {
    case "CHANGE_STEP":
      return action.payload.step;

    default:
      return state;
  }
};
