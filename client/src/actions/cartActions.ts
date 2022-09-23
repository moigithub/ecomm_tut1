import axios from 'axios'
import { ActionCreator, Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { ADD_TO_CART, REMOVE_FROM_CART, SAVE_SHIPPING_INFO } from '../constants/cart'
import { RootState } from '../store'

export const addCartItem: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (id: string, quantity: number) => async (dispatch, getState) => {
    try {
      // dispatch({ type: PRODUCT_DETAIL_REQUEST })

      const { data } = await axios.get(`http://localhost:4000/api/v1/product/${id}`, {
        withCredentials: true
      })
      dispatch({
        type: ADD_TO_CART,
        payload: {
          _id: id,
          name: data.product.name,
          price: data.product.price,
          image: data.product.images[0].url,
          stock: data.product.stock,
          quantity
        }
      })

      localStorage.setItem('cart', JSON.stringify(getState().cart.cartItems))
    } catch (error: any) {
      // dispatch({ type: PRODUCT_DETAIL_FAIL, payload: error.response.data.message })
    }
  }

export const removeCartItem: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  (id: string) => async (dispatch, getState) => {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: id
    })

    localStorage.setItem('cart', JSON.stringify(getState().cart.cartItems))
  }

export const saveShippingInfo: ActionCreator<ThunkAction<Promise<any>, RootState, any, Action>> =
  data => async (dispatch, getState) => {
    dispatch({
      type: SAVE_SHIPPING_INFO,
      payload: data
    })

    localStorage.setItem('shipping', JSON.stringify(getState().cart.shipping))
  }
