import { update } from 'state/util';

const initialState = {
  step: "scraper",
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

    default:
      return state;
  }
};
