import { createStore, applyMiddleware, compose } from 'redux'
import logger from 'redux-logger'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './reducers'
import createSagaMiddleware from 'redux-saga'
import history from '../utils/history'
import { loadState, saveState } from '../utils/localStorage'
import mySaga from './sagas'
import throttle from 'lodash-es/throttle'

const sagaMiddleware = createSagaMiddleware()

const initialState = loadState()
const enhancers = []
const middleware = [routerMiddleware(history), sagaMiddleware]

if (process.env.NODE_ENV === 'development') {
  middleware.push(logger)
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers,
)

const configureStore = preloadedState => {
  const store = createStore(createRootReducer(history), preloadedState, composedEnhancers)

  return store
}

const store = configureStore(initialState)

store.subscribe(
  throttle(() => {
    saveState(store.getState())
  }, 1000),
)

sagaMiddleware.run(mySaga)

export default store
