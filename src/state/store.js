import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from 'state/reducers';
import history from 'state/history';

const sagaMiddleware = createSagaMiddleware();

export function configureStore(preloadedState) {
  return createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        sagaMiddleware,
      ),
    ),
  );
}

// set up our reducers, store and middleware
export const store = configureStore();

store.runSaga = sagaMiddleware.run;
export default store;
