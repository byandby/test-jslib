'use strict';

var R = require('ramda');
require('seamless-immutable');
require('redux-saga/effects');

var foo = 'hello world!';

var version = "0.0.4";

const toMap = R.curry((getKey, getValue, array) =>
  R.reduce(
    (acc, value) => {
      acc[getKey(value)] = getValue(value);
      return acc
    },
    {},
    array,
  ),
);

const objToQuery = R.curry(
  (transfer, obj) =>
    // encodeURIComponent(
    Object.keys(obj)
      .filter(key => !R.isNil(obj[key]))
      .map(key => `${transfer(key)}=${obj[key]}`)
      .join('&'),
  // )
);

const condition = R.curry((opt, value) => {
  const options = opt.map(item => [
    typeof item[0] === 'function' ? item[0] : R.equals(item[0]),
    typeof item[1] === 'function' ? item[1] : R.always(item[1]),
  ]);
  return R.cond(options)(value)
});

const check = R.curry((v, obj) => (R.isNil(obj) ? v : obj));

const pathConvertor = R.curry((path, obj) => R.path((path || '').split('.'), obj));

function index() {
  console.log(foo + version);
  console.log('in watching mode again');
}

module.exports = index;
