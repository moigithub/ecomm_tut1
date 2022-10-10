// import axios from 'axios'
// import { ActionCreator, Action } from 'redux'
// import { ThunkAction } from 'redux-thunk'
// import {
//   CREATE_ORDER_REQUEST,
//   CREATE_ORDER_SUCCESS,
//   CREATE_ORDER_FAIL,
//   MY_ORDERS_FAIL,
//   MY_ORDERS_REQUEST,
//   MY_ORDERS_SUCCESS,
//   ORDER_DETAILS_FAIL,
//   ORDER_DETAILS_REQUEST,
//   ORDER_DETAILS_SUCCESS
// } from '../constants/order'
// import { ADMIN_ORDERS_REQUEST, ADMIN_ORDERS_SUCCESS, ADMIN_ORDERS_FAIL } from '../constants/product'
// import { START_REQUEST, SET_SUCCESS_STATUS, SET_ERROR_STATUS } from '../constants/user'
// import { Order } from '../reducers/orderReducer'
// import { RootState } from '../store'

// export const createOrder: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
//   (order: Order) => async (dispatch, getState) => {
//     dispatch({
//       type: CREATE_ORDER_REQUEST
//     })
//     try {
//       const { data } = await axios.post('http://localhost:4000/api/v1/order/new', order, {
//         headers: { 'content-type': 'application/json' },
//         withCredentials: true
//       })
//       dispatch({
//         type: CREATE_ORDER_SUCCESS,
//         payload: data
//       })
//     } catch (error: any) {
//       dispatch({
//         type: CREATE_ORDER_FAIL,
//         payload: error.response.data.message
//       })
//     }
//   }

// export const updateOrder: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
//   (id, order: Order) => async dispatch => {
//     try {
//       dispatch({ type: START_REQUEST })

//       const { data } = await axios.put(`http://localhost:4000/api/v1/admin/order/${id}`, order, {
//         headers: { 'content-type': 'application/json' },
//         withCredentials: true
//       })
//       dispatch({ type: SET_SUCCESS_STATUS, payload: data.message })
//     } catch (error: any) {
//       dispatch({ type: SET_ERROR_STATUS, payload: error.response.data.message })
//     }
//   }

// export const deleteOrder: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
//   id => async dispatch => {
//     try {
//       dispatch({ type: START_REQUEST })

//       const { data } = await axios.delete(`http://localhost:4000/api/v1/admin/order/${id}`, {
//         withCredentials: true
//       })
//       dispatch({ type: SET_SUCCESS_STATUS, payload: data.message })
//     } catch (error: any) {
//       dispatch({ type: SET_ERROR_STATUS, payload: error.response.data.message })
//     }
//   }

// export const myOrders: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
//   () => async (dispatch, getState) => {
//     dispatch({
//       type: MY_ORDERS_REQUEST
//     })
//     try {
//       const { data } = await axios.get('http://localhost:4000/api/v1/orders/me', {
//         headers: { 'content-type': 'application/json' },
//         withCredentials: true
//       })
//       dispatch({
//         type: MY_ORDERS_SUCCESS,
//         payload: data.orders
//       })
//     } catch (error: any) {
//       dispatch({
//         type: MY_ORDERS_FAIL,
//         payload: error.response.data.message
//       })
//     }
//   }

// export const getAdminOrders: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
//   () => async dispatch => {
//     try {
//       dispatch({ type: ADMIN_ORDERS_REQUEST })
//       let url = 'http://localhost:4000/api/v1/admin/orders'
//       const { data } = await axios.get(url, { withCredentials: true })
//       dispatch({ type: ADMIN_ORDERS_SUCCESS, payload: data })
//     } catch (error: any) {
//       dispatch({ type: ADMIN_ORDERS_FAIL, payload: error.response.data.message })
//     }
//   }

// export const orderDetails: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
//   (id: string) => async (dispatch, getState) => {
//     dispatch({
//       type: ORDER_DETAILS_REQUEST
//     })
//     try {
//       const { data } = await axios.get('http://localhost:4000/api/v1/order/' + id, {
//         headers: { 'content-type': 'application/json' },
//         withCredentials: true
//       })
//       dispatch({
//         type: ORDER_DETAILS_SUCCESS,
//         payload: data.order
//       })
//     } catch (error: any) {
//       dispatch({
//         type: ORDER_DETAILS_FAIL,
//         payload: error.response.data.message
//       })
//     }
//   }
