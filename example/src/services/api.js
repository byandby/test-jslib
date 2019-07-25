import { axiosInstanceOauth, axioInstanceV1 } from './axios'
import config from '../utils/config'
import { FETCH_STORE_LIMIT, FETCH_ORDER_LIMIT } from '../utils/constant'
import { getUserId } from '../utils/token'

const { baseUrl, tokenPath } = config.auth

export const getToken = async paramter => axiosInstanceOauth().post(baseUrl + tokenPath, paramter)

export const fetchUser = async userId => axioInstanceV1.get(`/users/${getUserId()}`)

export const fetchUserV1 = async () => axioInstanceV1.get(`/users/${getUserId()}`)

export const updateUserV1 = async data => axioInstanceV1.patch(`/users/${getUserId()}`, data)

export const updateUser = async (userId, userInfo) =>
  axioInstanceV1.patch(`/users/${getUserId()}`, userInfo)

export const deleteUser = async userId => axioInstanceV1.delete(`/users/${getUserId()}`)

export const fetchUserSessions = async userId =>
  axioInstanceV1.get(`/sessions?user_id=${getUserId()}`)

export const fetchSessionDetails = async sessionId => axioInstanceV1.get(`/sessions/${sessionId}`)

export const fetchMeasurements = async (measurementId, sessionId, type, side) => {
  const typeInLower = type.toLowerCase()
  const sideInLower = side.toLowerCase()
  if (!['dimensions', 'pressure'].includes(typeInLower)) {
    throw new Error(`invalid measurement type: ${typeInLower}`)
  }

  if (typeInLower === 'pressure' && !['left', 'right'].includes(sideInLower)) {
    throw new Error(`invalid measurement side: ${sideInLower}`)
  }

  let callPath = ''
  if (type === 'dimensions') {
    callPath = `/scans/measurement/${measurementId}/dimensions?session_id=${sessionId}`
  } else if (type === 'pressure') {
    callPath = `/scans/measurement/${measurementId}/pressure/?selection=${sideInLower}&session_id=${sessionId}`
  }

  return axioInstanceV1.get(`${callPath}`)
}

export const fetchShoeSize = async sessionId =>
  axioInstanceV1.get(`/scans/desma/shoe_size?session_id=${sessionId}`)
export const fetchInstructions = async () => axioInstanceV1.get(`/banner/intro`)

export const fetchOrders = async () =>
  axioInstanceV1.get(`/orders?created_by=${getUserId()}&limit=${FETCH_ORDER_LIMIT}&offset=0`)

export const fetchOrderDetails = async orderId => axioInstanceV1.get(`/orders/${orderId}`)

export const validateProduct = async (productId, data) =>
  axioInstanceV1.post(`/products/${productId}/validation`, data)

export const reorderProduct = async (orderId, data) =>
  axioInstanceV1.post(`/orders/${orderId}/reorder`, data)

export const updateUserAvatar = async (userId, avatarUrl) =>
  axioInstanceV1.patch(`/users/${userId}/avatar`, {
    avatar_url: avatarUrl,
  })

// address
export const fetchAddresses = async userId => axioInstanceV1.get(`/users/${userId}/addresses`)
export const fetchAddressDetails = async (userId, addressId) =>
  axioInstanceV1.get(`/users/${userId}/addresses/${addressId}`)
export const setDefaultAddress = async (userId, addressId) =>
  axioInstanceV1.patch(`/users/${userId}/addresses/${addressId}/primary`)
export const addAddress = async (userId, payload) =>
  axioInstanceV1.post(`/users/${userId}/addresses`, payload)
export const updateAddress = async (userId, addressId, payload) =>
  axioInstanceV1.patch(`/users/${userId}/addresses/${addressId}`, payload)
export const deleteAddress = async (userId, addressId) =>
  axioInstanceV1.delete(`/users/${userId}/addresses/${addressId}`)

// store
export const fetchStores = async () =>
  axioInstanceV1.get(`/stores?limit=${FETCH_STORE_LIMIT}&offset=0`)
export const fetchStore = async storeId => axioInstanceV1.get(`/stores/${storeId}`)

// product
export const fetchProducts = async brandName => {
  let productIds = []
  const productsDetails = []
  const rep = await axioInstanceV1.get(`/banner/products`)
  if (brandName) {
    rep.data.brands.forEach(brand => {
      if (brand.brand_name === brandName) {
        productIds = brand.product_ids
      }
    })
  }

  if (productIds.length > 0) {
    await Promise.all(
      productIds.map(async productId => {
        const productDetails = await axioInstanceV1.get(`/products/${productId}`)
        productsDetails.push(productDetails.data)
      }),
    )
  }
  return productsDetails
}

// QA product id 4c367e6f-54fc-4301-88ec-aaeeecbd829c
// dev product id 62988b82-b81a-4065-b5e9-6e48edb5832a
