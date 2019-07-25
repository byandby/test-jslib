import axios from 'axios'
import Qs from 'qs'
import config from '../utils/config'
import { getAccessToken } from '../utils/token'

export const axiosInstanceOauth = () => {
  const { clientId } = config.auth
  const token = btoa(clientId)
  return axios.create({
    // baseURL,
    timeout: 6000,
    type: 'json',
    headers: {
      Authorization: `Basic ${token}Og==`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    transformRequest: [
      function tr(data) {
        return Qs.stringify(data)
      },
    ],
  })
}

export const axioInstanceV1 = (() => {
  const instance = axios.create({
    baseURL: config.auth.baseUrl + '/mobile/v1',
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const apiConfig = () => ({
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  })

  return {
    post: (url, data) => instance.post(url, data, apiConfig()),
    get: url => instance.get(url, apiConfig()),
    patch: (url, data) => instance.patch(url, data, apiConfig()),
    put: (url, data) => instance.put(url, data, apiConfig()),
    delete: url => instance.delete(url, apiConfig()),
  }
})()
