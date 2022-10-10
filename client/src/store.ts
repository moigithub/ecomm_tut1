// import { combineReducers, applyMiddleware } from 'redux'
// import thunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
// import { composeWithDevTools } from 'redux-devtools-extension'

// import { allUserReducer, authReducer, userDetailReducer } from './reducers/userReducers'

// import {
//   adminOrdersReducer,
//   myOrdersReducer,
//   orderDetailReducer,
//   orderReducer
// } from './reducers/orderReducer'
import appStateReducer from './slices/appStateSlice'
import cartReducer from './slices/cartSlice'
import productReducer from './slices/productSlice'
import orderReducer from './slices/orderSlice'
import userReducer from './slices/userSlice'

// const reducers = combineReducers({
//   products: productReducer,
//   adminProducts: adminProductReducer,
//   productDetails: productDetailReducer,
//   productReviews: productReviewsReducer,
//   auth: authReducer,
//   appState: appStateReducer,
//   cart: cartReducer,
//   newOrder: orderReducer,
//   myOrders: myOrdersReducer,
//   adminOrders: adminOrdersReducer,
//   orderDetails: orderDetailReducer,
//   newReview: newReviewReducer,
//   newProduct: newProductReducer,
//   allUsers: allUserReducer,
//   userDetail: userDetailReducer
// })
let initialState = {
  cart: {
    cartItems: JSON.parse(localStorage.getItem('cart') || '[]') || [],
    shipping: JSON.parse(localStorage.getItem('shipping') || '{}') || {}
  }
}

// const middleware = [thunk]
const store = configureStore({
  devTools: true,
  preloadedState: initialState,
  reducer: {
    appState: appStateReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,

    user: userReducer
    // myOrders: myOrdersReducer,
    // adminOrders: adminOrdersReducer,
    // orderDetails: orderDetailReducer,

    // allUsers: allUserReducer,
    // userDetail: userDetailReducer
  }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
