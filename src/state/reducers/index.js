import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router'

import { hextReducer } from "state/reducers/hext";
import { stepReducer } from "state/reducers/step";
import { scrapeReducer } from "state/reducers/scrape";
import { statusReducer } from "state/reducers/status";

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  step: stepReducer,
  scrape: scrapeReducer,
  hext: hextReducer,
  status: statusReducer,
});

export default createRootReducer;
