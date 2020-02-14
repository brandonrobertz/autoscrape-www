import { update } from 'state/util';

const initialState = {
  step: "crawl",
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

    default:
      return state;
  }
};
