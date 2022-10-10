import { createSlice } from '@reduxjs/toolkit'

export interface CartItem {
  _id: string
  product: string // id
  name: string
  price: number
  image: string
  stock: number
  quantity: number
}
export interface Shipping {
  address: string
  city: string
  postalCode: string
  phoneNo: string
  country: string
}
export interface CartState {
  cartItems: CartItem[]
  shipping: Shipping | null
}

const initialState: CartState = {
  cartItems: [],
  shipping: null
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCartItem: (state, action) => {
      console.log('updatecarditem slice', action.payload)
      const item = state.cartItems.find((product: CartItem) => product._id === action.payload._id)
      if (item) {
        console.log('updating card item')
        state.cartItems = state.cartItems.map((item: CartItem) =>
          item._id === action.payload._id ? action.payload : item
        )
      } else {
        console.log('adding card item')

        state.cartItems.push(action.payload)
      }
    },
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter((i: CartItem) => i._id !== action.payload)
    },
    saveShippingInfo: (state, action) => {
      state.shipping = action.payload
    }
  }
})

export const { updateCartItem, removeCartItem, saveShippingInfo } = cartSlice.actions

export default cartSlice.reducer
