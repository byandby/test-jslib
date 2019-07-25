import Immutable from 'seamless-immutable'

import { UPDATE_DATA_STATUS } from './dataHelper'

const initialState = Immutable({})

export default function reducer(state = initialState, action = {}) {
  const { type, key, status, error } = action
  const obj = {
    status,
    ts: Date.now(),
  }

  switch (type) {
    case UPDATE_DATA_STATUS:
      if (error) obj.error = error
      return Immutable.set(state, key, obj)
    default:
      return state
  }
}
