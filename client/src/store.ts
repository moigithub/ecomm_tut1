import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  productDetailReducer,
  productReducer,
  newReviewReducer,
  adminProductReducer,
  newProductReducer,
  productReviewsReducer
} from './reducers/productReducers'
import { allUserReducer, authReducer, userDetailReducer } from './reducers/userReducers'
import { cartReducer } from './reducers/cartReducers'
import {
  adminOrdersReducer,
  myOrdersReducer,
  orderDetailReducer,
  orderReducer
} from './reducers/orderReducer'
import { appStateReducer } from './reducers/appStateReducer'

const reducers = combineReducers({
  products: productReducer,
  adminProducts: adminProductReducer,
  productDetails: productDetailReducer,
  productReviews: productReviewsReducer,
  auth: authReducer,
  appState: appStateReducer,
  cart: cartReducer,
  newOrder: orderReducer,
  myOrders: myOrdersReducer,
  adminOrders: adminOrdersReducer,
  orderDetails: orderDetailReducer,
  newReview: newReviewReducer,
  newProduct: newProductReducer,
  allUsers: allUserReducer,
  userDetail: userDetailReducer
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
