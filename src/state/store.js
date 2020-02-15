import { createStore } from "redux";

import { rootReducer } from "state/reducers/root";

// set up our reducers, store and middleware
export const store = createStore(rootReducer);

export default store;
