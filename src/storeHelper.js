import { connectRouter } from 'connected-react-router'
import Immutable from 'seamless-immutable'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { createBrowserHistory } from 'history'

import { buildReducerAndSagas } from './dataHelper'
import dataStatus from './dataStatus'

import { all } from 'redux-saga/effects'

export const history = createBrowserHistory()

const init = modules => {
  const sagaOptions = []
  const reduceOption = { dataStatus }
  modules.forEach(module => {
    const { sagas, reducer } = buildReducerAndSagas(module)
    sagaOptions.push(sagas())
    reduceOption[module.namespace] = reducer
  })
  return { sagaOptions, reduceOption }
}

const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
const enhancers = []
const SetTransform = createTransform(
  null,
  outboundState => {
    return Immutable(outboundState)
  },
  {}
)

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger)
  // eslint-disable-next-line no-underscore-dangle
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

export const buildStore = (modules, persists, preloadedState) => {
  const { sagaOptions, reduceOption } = init(modules)

  const createRootReducer = h => combineReducers({ ...reduceOption, router: connectRouter(h) })

  const persistConfig = {
    key: 'root',
    storage,
    whitelist: persists,
    transforms: [SetTransform]
  }

  const persistedReducer = persistReducer(persistConfig, createRootReducer(history))

  const store = createStore(
    persistedReducer,
    preloadedState,
    compose(
      applyMiddleware(...middlewares),
      ...enhancers
    )
  )
  const persistor = persistStore(store)

  function * mySaga() {
    yield all(sagaOptions)
  }
  sagaMiddleware.run(mySaga)

  return { store, persistor }
}
