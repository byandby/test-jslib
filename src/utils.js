import * as R from 'ramda'
import Immutable from 'seamless-immutable'

export const toMap = R.curry((getKey, getValue, array) =>
  R.reduce(
    (acc, value) => {
      acc[getKey(value)] = getValue(value)
      return acc
    },
    {},
    array,
  ),
)

export const setIn = (obj, path, value) =>
  Immutable.setIn(obj, typeof path === 'string' ? path.split('.') : path, value)

export const camelToSnack = str => str.replace(/([A-Z])/g, '_$1').toLowerCase()

export const snackToCamel = s => {
  return s.replace(/([-_][a-z])/gi, $1 => {
    return $1
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  })
}

const isArray = a => {
  return Array.isArray(a)
}

const isObject = o => {
  return o === Object(o) && !isArray(o) && typeof o !== 'function'
}

export const keysToCamel = o => {
  if (isObject(o)) {
    const n = {}

    Object.keys(o).forEach(k => {
      n[snackToCamel(k)] = keysToCamel(o[k])
    })

    return n
  }
  if (isArray(o)) {
    return o.map(i => {
      return keysToCamel(i)
    })
  }

  return o
}

export const keysToSnack = o => {
  if (isObject(o)) {
    const n = {}

    Object.keys(o).forEach(k => {
      n[camelToSnack(k)] = keysToSnack(o[k])
    })

    return n
  }
  if (isArray(o)) {
    return o.map(i => {
      return keysToSnack(i)
    })
  }

  return o
}

export const objToQuery = R.curry(
  (transfer, obj) =>
    // encodeURIComponent(
    Object.keys(obj)
      .filter(key => !R.isNil(obj[key]))
      .map(key => `${transfer(key)}=${obj[key]}`)
      .join('&'),
  // )
)

export const condition = R.curry((opt, value) => {
  const options = opt.map(item => [
    typeof item[0] === 'function' ? item[0] : R.equals(item[0]),
    typeof item[1] === 'function' ? item[1] : R.always(item[1]),
  ])
  return R.cond(options)(value)
})

export const check = R.curry((v, obj) => (R.isNil(obj) ? v : obj))
