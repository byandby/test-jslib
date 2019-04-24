import foo from './foo.js';
import { version } from '../package.json';

export default function () {
  console.log(foo + version);
  console.log('in watching mode again')
}