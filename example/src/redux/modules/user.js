import { all, call, put, takeLatest } from 'redux-saga/effects'
import * as api from '../../services/api'
import history from '../../utils/history'
import { signOutAC } from './auth'
import { getDecodedToken } from '../../utils/token'

// actions
export const FETCH = 'customer-portal/user/FETCH'
const FETCH_SUCCESS = 'customer-portal/user/FETCH_SUCCESS'
const FETCH_FAIL = 'customer-portal/user/FETCH_FAIL'

const UPDATE = 'customer-portal/user/UPDATE'
const UPDATE_SUCCESS = 'customer-portal/user/UPDATE_SUCCESS'
const UPDATE_FAIL = 'customer-portal/user/UPDATE_FAIL'

const INITSTATE = 'customer-portal/user/INITSTATE'

const DELETE = 'customer-portal/user/DELETE'
const DELETE_SUCCESS = 'customer-portal/user/DELETE_SUCCESS'
const DELETE_FAIL = 'customer-portal/user/DELETE_FAIL'

// action creators

export const fetchUserAC = () => ({
  type: FETCH,
})

export const updateUserConsentAC = consent => {
  return (dispatch, getState) => {
    let user = getState().user.profile
    dispatch(updateUserAC({ data: { ...user.data, ...consent } }))
  }
}

export const updateUserPreferenceAC = preference => {
  return (dispatch, getState) => {
    let user = getState().user.profile
    dispatch(updateUserAC({ data: { ...user.data, ...preference } }))
  }
}

export const updateUserAC = (user, prevPage) => ({
  type: UPDATE,
  user,
  prevPage,
})

export const initStateAC = () => ({
  type: INITSTATE,
})

export const deleteUserAC = () => ({
  type: DELETE,
})
// sagas

function* fetchUser(action) {
  try {
    const resp = yield call(api.fetchUserV1)
    yield put({
      type: FETCH_SUCCESS,
      user: resp.data,
    })
  } catch (e) {
    yield put({
      type: FETCH_FAIL,
      error: 'Failed to fetch user info',
    })
  }
}

function* updateUser(action) {
  try {
    const rep = yield call(api.updateUserV1, action.user)
    yield put({ type: UPDATE_SUCCESS, user: rep.data })
    if (action.prevPage) {
      history.push(action.prevPage)
    }
  } catch (e) {
    yield put({ type: UPDATE_FAIL, error: e && e.mssage })
  }
}

function* deleteUser() {
  try {
    const rep = yield call(api.deleteUser, getDecodedToken().user_id)
    if (rep.status === 204) {
      // delete user will return 204 for succeeded
      yield put({ type: DELETE_SUCCESS })
      yield put(signOutAC())
    } else {
      throw new Error('Fail to delete user')
    }
  } catch (e) {
    yield put({ type: DELETE_FAIL, error: e && e.mssage })
  }
}
// enable sagas watcher
export function* sagas() {
  yield all([
    takeLatest(FETCH, fetchUser),
    takeLatest(UPDATE, updateUser),
    takeLatest(DELETE, deleteUser),
  ])
}

const initialState = {
  profile: undefined,
}
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        profile: action.user,
      }
    case UPDATE:
      return { ...state, updating: true, updated: false }
    case UPDATE_SUCCESS:
      return {
        ...state,
        updating: false,
        updated: true,
        profile: action.user,
        error: null,
      }
    case UPDATE_FAIL:
      return {
        ...state,
        updating: false,
        updated: false,
        error: action.error,
      }
    case DELETE:
      return { ...state, deleting: true }
    case DELETE_SUCCESS:
      return { ...state, deleting: false, deleted: true }
    case DELETE_FAIL:
      return { ...state, deleting: false, error: action.error }
    case INITSTATE:
      return { ...state, updated: false }
    default:
      return state
  }
}
