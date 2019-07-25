import * as R from 'ramda'

import { toMap, setIn } from './utils'

import { put, all, takeLatest, call } from 'redux-saga/effects'

export const UPDATE_DATA_STATUS = 'UPDATE_DATA_STATUS'
export const DATA_STATUS_FETCHING = 'STATUS_FETCHING'
export const DATA_STATUS_SUCCESS = 'STATUS_SUCCESS'
export const DATA_STATUS_FAILED = 'STATUS_FAILED'

const allConfigMap = {}

const wrapperSaga = config => {
  return function* wrappered(action) {
    yield put({ type: UPDATE_DATA_STATUS, key: config.type, status: DATA_STATUS_FETCHING })
    if (action && action.reset) {
      yield put({
        type: `${config.type}_SET`,
        payload: action.reset || {},
        param: action.payload,
      })
    }
    try {
      const { process, fetcher, paramConvertor } = config
      let result
      if (typeof process === 'function') {
        result = yield process(action)
      } else if (typeof fetcher === 'function') {
        const param =
          typeof paramConvertor === 'function' ? paramConvertor(action.payload) : action.payload
        result = yield call(fetcher, param)
      } else {
        console.error(`Configuration of ${config.type} is not correct`)
        yield put({
          type: UPDATE_DATA_STATUS,
          key: config.type,
          status: DATA_STATUS_FAILED,
          error: `Configuration of ${config.type} is not correct`,
        })
        return
      }
      yield put({ type: UPDATE_DATA_STATUS, key: config.type, status: DATA_STATUS_SUCCESS })
      yield put({ type: `${config.type}_SET`, payload: result, param: action.payload })
    } catch (error) {
      yield put({
        type: UPDATE_DATA_STATUS,
        key: config.type,
        status: DATA_STATUS_FAILED,
        error,
      })
    }
  }
}

const buildSagas = configs => {
  const effects = configs.map(config => {
    const strategry = config.strategry || takeLatest
    return strategry(config.type, wrapperSaga(config))
  })
  return function* result() {
    yield all(effects)
  }
}

const buildReducer = ({ initialState, configs, localReducer }) => {
  const configMap = toMap(config => `${config.type}_SET`, R.identity)(configs)
  return (state = initialState, action = {}) => {
    const { type, payload } = action

    const config = configMap[type]
    if (config) {
      const { selector, set, resultConvertor } = config
      if (typeof set === 'function') return set(state, action)
      if (typeof selector === 'string') {
        if (typeof resultConvertor === 'function') {
          return setIn(state, selector.split('.'), resultConvertor(payload))
        }
        return setIn(state, selector.split('.'), payload)
      }
    }
    return typeof localReducer === 'function' ? localReducer(state, action) : state
  }
}

export const buildReducerAndSagas = ({ namespace, initialState, configs, localReducer }) => {
  configs.forEach(config => {
    allConfigMap[config.type] = { namespace, config }
  })
  const sagas = buildSagas(configs)
  const reducer = buildReducer({ initialState, configs, localReducer })
  return { sagas, reducer }
}

export const createStatusSelector = type => state => R.path(['dataStatus', type], state)

export const createDataSelector = type => (state, param) => {
  const { namespace, config } = allConfigMap[type]
  if (!namespace) return null
  const { selector, get } = config
  if (typeof get === 'function') return get(state, param)
  if (typeof selector === 'string') return R.path([namespace, ...selector.split('.')], state)
  return null
}

export const pathConvertor = R.curry((path, obj) => R.path((path || '').split('.'), obj))
