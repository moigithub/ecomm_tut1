import {
  ADMIN_ORDERS_FAIL,
  ADMIN_ORDERS_REQUEST,
  ADMIN_ORDERS_SUCCESS,
  CLEAR_ERRORS
} from './../constants/product'
import { AnyAction } from 'redux'
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  MY_ORDERS_FAIL,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS
} from '../constants/order'
import { CartItem, Shipping } from './cartReducers'

interface PaymentInfo {
  id: string
  status: string
}

interface User {
  _id: string
  name: string
}

export interface Order {
  _id: string
  shippingInfo: Shipping
  user: User
  orderItems: CartItem[]
  paymentInfo: PaymentInfo
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  paidAt: Date
  orderStatus: string
}

export interface OrderState {
  order: Order | null
  error: string | null
  loading: boolean
}

const initialState: OrderState = {
  order: null,
  error: null,
  loading: false
}

export const orderReducer = (state = initialState, action: AnyAction): OrderState => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        loading: true
      }
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload
      }
    case CREATE_ORDER_FAIL:
      return { ...state, loading: false, error: action.payload }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return { ...state }
  }
}

export interface MyOrdersState {
  orders: Order[] | []
  error: string | null
  loading: boolean
}
const myOrdersInitialState: MyOrdersState = {
  orders: [],
  error: null,
  loading: false
}
export const myOrdersReducer = (state = myOrdersInitialState, action: AnyAction): MyOrdersState => {
  switch (action.type) {
    case MY_ORDERS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case MY_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload
      }
    case MY_ORDERS_FAIL:
      return { ...state, loading: false, error: action.payload }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return { ...state }
  }
}

interface AdminOrdersState {
  loading: boolean
  orders: Order[]
  error?: string | null
  totalAmount: number
}
const adminOrdersInitialState: AdminOrdersState = {
  loading: false,
  orders: [],
  error: null,
  totalAmount: 0
}
export const adminOrdersReducer = (
  state = adminOrdersInitialState,
  action: AnyAction
): AdminOrdersState => {
  switch (action.type) {
    case ADMIN_ORDERS_REQUEST:
      return {
        loading: true,
        orders: [],
        error: null,
        totalAmount: 0
      }
    case ADMIN_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        totalAmount: action.payload.totalAmount,
        orders: action.payload.orders.slice()
      }
    case ADMIN_ORDERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

const orderDetailInitialState: OrderState = {
  order: null,
  error: null,
  loading: false
}

export const orderDetailReducer = (
  state = orderDetailInitialState,
  action: AnyAction
): OrderState => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload
      }
    case ORDER_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return { ...state }
  }
}
