const initialState = null;

export const hextReducer = (state, action) => {
  if (state === undefined) {
    return initialState;
  }

  switch(action.type) {
    case "HEXT_RECEIVED":
      return action.payload;

    case "HEXT_CLEAR_REQUESTED":
    case "CLEAR_SCRAPE":
      return null;

    default:
      return state;
  }
};
