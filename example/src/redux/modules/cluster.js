import Immutable from 'seamless-immutable'

import * as api from '../../api'

// initial state
const initialState = Immutable({
  clusters: null,
})

// remote async calls
export const CLUSTER_LIST = 'cluster/LIST'

const namespace = 'cluster'

const configs = [
  {
    type: CLUSTER_LIST,
    selector: 'clusters',
    fetcher: api.fetchEnv,
  },
]

export default {
  namespace,
  initialState,
  configs,
}
