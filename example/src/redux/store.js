import helper from 'test-rl'

import clusterModule from './modules/cluster'

const reduxModules = [clusterModule]

const persistNamespaces = []

debugger
const { store: s, persistor: p } = helper.buildStore(reduxModules, persistNamespaces)

export const store = s
export const persistor = p
