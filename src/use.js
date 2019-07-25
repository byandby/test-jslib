import { useState, useEffect } from 'react'

import { DATA_STATUS_FETCHING, DATA_STATUS_SUCCESS, DATA_STATUS_FAILED } from './dataHelper'

export const useApi = ({ fn, onSuccess, onFail }) => {
  const [state, setState] = useState({ init: true, result: {}, symbol: Symbol('init') })

  useEffect(() => {
    if (state.init || typeof fn !== 'function') return
    const fetchData = async () => {
      let result = {}
      try {
        const response = await fn(state.param)
        result = { status: DATA_STATUS_SUCCESS, response }
        if (typeof onSuccess === 'function') onSuccess(response)
      } catch (error) {
        result = { status: DATA_STATUS_FAILED, response: error }
        if (typeof onFail === 'function') onFail(error)
      }
      setState({
        ...state,
        result,
      })
    }

    fetchData()
  }, [state.symbol])

  const handler = param => {
    setState({
      ...state,
      param,
      result: { status: DATA_STATUS_FETCHING },
      init: false,
      symbol: Symbol('trigger api call'),
    })
  }

  return [handler, state.result]
}

export const useTimeout = interval => {
  const [tick, setTick] = useState(0)
  const [on, setOn] = useState(true)

  useEffect(() => {
    if (on) {
      setTimeout(() => {
        if (on) setTick(tick + 1)
      }, interval * 1000)
    }
  }, [on, tick, interval])

  const stop = () => setOn(false)
  const start = () => setOn(true)

  return [tick, stop, start]
}

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value])

  return debouncedValue
}

export const useQuery = (pageSize, page, filter) => {
  const [query, setQuery] = useState({ pageSize, page, filter })
  useEffect(() => {
    // console.log('page size changed')
    setQuery({ ...query, pageSize })
  }, [pageSize])

  const setPage = newPage => setQuery({ ...query, page: newPage })
  const setSearch = (newPage, newFilter) => setQuery({ ...query, page: newPage, filter: newFilter })

  return [query, setPage, setSearch]
}

export const useWindowSize = () => {
  const [rect, setRect] = useState({ width: window.innerWidth, height: window.innerHeight })
  const handleResize = () => setRect({ width: window.innerWidth, height: window.innerHeight })
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return rect
}
