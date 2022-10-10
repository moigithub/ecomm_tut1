import { createSlice } from '@reduxjs/toolkit'
import { CartItem, Shipping } from './cartSlice'

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
  orders: Order[]
  adminOrders: Order[]
  error: string | null
  loading: boolean
  totalAmount: number
}

const initialState: OrderState = {
  order: null,
  orders: [],
  adminOrders: [],
  error: null,
  loading: false,
  totalAmount: 0
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload.orders
      state.totalAmount = action.payload.totalAmount
    },
    newOrder: (state, action) => {
      state.order = action.payload
      state.orders.push(action.payload)
    },
    setOrderDetail: (state, action) => {
      state.order = action.payload
    },

    setAdminOrders: (state, action) => {
      state.adminOrders = action.payload
    },
    updateAdminOrder: (state, action) => {
      state.adminOrders = state.adminOrders.map(order =>
        order._id === action.payload._id ? action.payload : order
      )
    },
    deleteAdminOrder: (state, action) => {
      state.adminOrders = state.adminOrders.filter(order => order._id === action.payload)
    }
  }
})

export const {
  setOrders,
  newOrder,
  setOrderDetail,
  setAdminOrders,
  updateAdminOrder,
  deleteAdminOrder
} = orderSlice.actions

export default orderSlice.reducer
