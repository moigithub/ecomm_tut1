import axios from 'axios'
import { ThunkAction } from 'redux-thunk'
import { Action, ActionCreator, AnyAction, Dispatch } from 'redux'

import { RootState } from '../store'

import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_FAIL,
  ALL_PRODUCTS_SUCCESS,
  CLEAR_ERRORS,
  PRODUCT_DETAIL_FAIL,
  PRODUCT_DETAIL_SUCCESS,
  PRODUCT_DETAIL_REQUEST,
  REVIEW_FAIL,
  REVIEW_REQUEST,
  REVIEW_SUCCESS,
  ADMIN_PRODUCTS_FAIL,
  ADMIN_PRODUCTS_REQUEST,
  ADMIN_PRODUCTS_SUCCESS,
  NEW_PRODUCT_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  ADMIN_ORDERS_FAIL,
  ADMIN_ORDERS_REQUEST,
  ADMIN_ORDERS_SUCCESS,
  PRODUCT_REVIEWS_FAIL,
  PRODUCT_REVIEWS_REQUEST,
  PRODUCT_REVIEWS_SUCCESS
} from '../constants/product'
import { START_REQUEST, SET_SUCCESS_STATUS, SET_ERROR_STATUS } from '../constants/user'

export const getProducts: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (page: number = 1, keyword: string = '', price = [1, 1000], category = '') =>
  async dispatch => {
    try {
      dispatch({ type: ALL_PRODUCTS_REQUEST })
      let url = `http://localhost:4000/api/v1/products?page=${page}&keyword=${keyword}&minprice=${price[0]}&maxprice=${price[1]}`

      if (category) {
        url += `&category=${category}`
      }

      const { data } = await axios.get(url, { withCredentials: true })
      dispatch({ type: ALL_PRODUCTS_SUCCESS, payload: data })
    } catch (error: any) {
      dispatch({ type: ALL_PRODUCTS_FAIL, payload: error.response.data.message })
    }
  }

export const clearError = () => (dispatch: Dispatch<Action>) => {
  return dispatch({ type: CLEAR_ERRORS })
}

export const getProductDetails: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (id: string) => async dispatch => {
    try {
      dispatch({ type: PRODUCT_DETAIL_REQUEST })

      const { data } = await axios.get(`http://localhost:4000/api/v1/product/${id}`, {
        withCredentials: true
      })
      dispatch({ type: PRODUCT_DETAIL_SUCCESS, payload: data })
    } catch (error: any) {
      dispatch({ type: PRODUCT_DETAIL_FAIL, payload: error.response.data.message })
    }
  }

export const getProductReviews: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  id => async dispatch => {
    try {
      dispatch({ type: PRODUCT_REVIEWS_REQUEST })
      let url = `http://localhost:4000/api/v1/product/${id}/reviews`
      const { data } = await axios.get(url, { withCredentials: true })
      dispatch({ type: PRODUCT_REVIEWS_SUCCESS, payload: data.reviews })
    } catch (error: any) {
      dispatch({ type: PRODUCT_REVIEWS_FAIL, payload: error.response.data.message })
    }
  }

export const newReview: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (id: string, rating: number, comment: string) => async dispatch => {
    try {
      dispatch({ type: REVIEW_REQUEST })

      const { data } = await axios.post(
        `http://localhost:4000/api/v1/product/${id}/review`,
        {
          rating,
          comment
        },
        { headers: { 'content-type': 'application/json' }, withCredentials: true }
      )
      dispatch({ type: REVIEW_SUCCESS, payload: data })
    } catch (error: any) {
      dispatch({ type: REVIEW_FAIL, payload: error.response.data.message })
    }
  }

//-------------admin

export const deleteReview: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (productId: string, reviewId: string) => async dispatch => {
    try {
      dispatch({ type: START_REQUEST })

      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/admin/product/${productId}/reviews/${reviewId}`,
        { withCredentials: true }
      )
      dispatch({ type: SET_SUCCESS_STATUS, payload: data.message })
    } catch (error: any) {
      dispatch({ type: SET_ERROR_STATUS, payload: error.response.data.message })
    }
  }

export const getAdminProducts: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  () => async dispatch => {
    try {
      dispatch({ type: ADMIN_PRODUCTS_REQUEST })
      let url = 'http://localhost:4000/api/v1/admin/products'
      const { data } = await axios.get(url, { withCredentials: true })
      dispatch({ type: ADMIN_PRODUCTS_SUCCESS, payload: data })
    } catch (error: any) {
      dispatch({ type: ADMIN_PRODUCTS_FAIL, payload: error.response.data.message })
    }
  }

export const newProduct: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  productData => async dispatch => {
    try {
      dispatch({ type: NEW_PRODUCT_REQUEST })

      const { data } = await axios.post(
        `http://localhost:4000/api/v1/admin/product/new`,
        productData,
        { headers: { 'content-type': 'multipart/form-data' }, withCredentials: true }
      )
      dispatch({ type: NEW_PRODUCT_SUCCESS, payload: data })
    } catch (error: any) {
      dispatch({ type: NEW_PRODUCT_FAIL, payload: error.response.data.message })
    }
  }

export const updateProduct: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (id, productData) => async dispatch => {
    try {
      dispatch({ type: START_REQUEST })

      const { data } = await axios.put(
        `http://localhost:4000/api/v1/admin/product/${id}`,
        productData,
        { headers: { 'content-type': 'multipart/form-data' }, withCredentials: true }
      )
      dispatch({ type: SET_SUCCESS_STATUS, payload: data.message })
    } catch (error: any) {
      dispatch({ type: SET_ERROR_STATUS, payload: error.response.data.message })
    }
  }

export const deleteProduct: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (id: string) => async dispatch => {
    try {
      dispatch({ type: START_REQUEST })

      const { data } = await axios.delete(`http://localhost:4000/api/v1/admin/product/${id}`, {
        headers: { 'content-type': 'application/json' },
        withCredentials: true
      })
      dispatch({ type: SET_SUCCESS_STATUS, payload: data.message })
    } catch (error: any) {
      dispatch({ type: SET_ERROR_STATUS, payload: error.response.data.message })
    }
  }

export const getAdminOrders: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  () => async dispatch => {
    try {
      dispatch({ type: ADMIN_ORDERS_REQUEST })
      let url = 'http://localhost:4000/api/v1/admin/orders'
      const { data } = await axios.get(url, { withCredentials: true })
      dispatch({ type: ADMIN_ORDERS_SUCCESS, payload: data })
    } catch (error: any) {
      dispatch({ type: ADMIN_ORDERS_FAIL, payload: error.response.data.message })
    }
  }
