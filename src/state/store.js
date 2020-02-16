import { compose, createStore, applyMiddleware } from "redux";
import createSagaMiddleware from 'redux-saga';

import { rootReducer } from "state/reducers/root";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  applyMiddleware(sagaMiddleware),
];

// set up our reducers, store and middleware
export const store = createStore(rootReducer, compose(...middlewares));

store.runSaga = sagaMiddleware.run;
export default store;
