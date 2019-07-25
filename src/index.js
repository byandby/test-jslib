import foo from './foo.js'
import { version } from '../package.json'
import {
  UPDATE_DATA_STATUS,
  DATA_STATUS_FETCHING,
  DATA_STATUS_SUCCESS,
  DATA_STATUS_FAILED,
} from './dataHelper'

export default function() {
  console.log(foo + version)
  console.log('in watching mode again')
}
