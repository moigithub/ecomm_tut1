import { AnyAction } from 'redux'
import { ADD_TO_CART, REMOVE_FROM_CART, SAVE_SHIPPING_INFO } from '../constants/cart'
import { Product } from './productReducers'

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

export const cartReducer = (state = initialState, action: AnyAction): CartState => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload
      const hasItem = state.cartItems.find((product: CartItem) => product._id === item._id)

      if (hasItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((i: CartItem) => (i._id === item._id ? item : i))
        }
      } else {
        return { ...state, cartItems: [...state.cartItems, item] }
      }
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter((i: CartItem) => i._id !== action.payload)
      }
    case SAVE_SHIPPING_INFO:
      return { ...state, shipping: action.payload }
    default:
      return { ...state }
  }
}
