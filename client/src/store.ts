import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productDetailReducer, productReducer, newReviewReducer } from './reducers/productReducers'
import { appStateReducer, authReducer } from './reducers/userReducers'
import { cartReducer } from './reducers/cartReducers'
import { myOrdersReducer, orderDetailReducer, orderReducer } from './reducers/orderReducer'

const reducers = combineReducers({
  products: productReducer,
  productDetails: productDetailReducer,
  auth: authReducer,
  appState: appStateReducer,
  cart: cartReducer,
  newOrder: orderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailReducer,
  newReview: newReviewReducer
})
let initialState = {
  cart: {
    cartItems: JSON.parse(localStorage.getItem('cart') || '[]') || [],
    shipping: JSON.parse(localStorage.getItem('shipping') || '{}') || {}
  }
}

const middleware = [thunk]
const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
