import { all } from 'redux-saga/effects'

import { sagas as userSagas } from './modules/user'

function* mySaga() {
  yield all([userSagas()])
}

export default mySaga
