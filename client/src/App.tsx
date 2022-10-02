import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { Home } from './components/Home'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'

import { ProtectedRoute } from './components/protectedRoute'

import { ForgotPassword } from './components/user/ForgotPassword'
import { Cart } from './components/cart/Cart'
import { Shipping } from './components/cart/Shipping'
import { ConfirmOrder } from './components/cart/ConfirmOrder'
import { Payment } from './components/cart/Payment'
import store from './store'
import { loadUser } from './actions/userActions'
import './App.css'
import { OrderSuccess } from './components/cart/OrderSuccess'
import { ProductDetails } from './components/product/ProductDetail'
import { Login } from './components/user/Login'
import { Profile } from './components/user/Profile'
import { Register } from './components/user/Register'
import { UpdatePassword } from './components/user/UpdatePassword'
import { UpdateProfile } from './components/user/UpdateProfile'
import { OrderList } from './components/order/OrderList'
import { OrderDetails } from './components/order/OrderDetails'
import { Dashboard } from './components/admin/Dashboard'
import { AdminProductsList } from './components/admin/AdminProductsList'
import { NewProduct } from './components/admin/NewProduct'
import { UpdateProduct } from './components/admin/UpdateProduct'
import { AdminOrderList } from './components/admin/AdminOrderList'
import { ProcessOrder } from './components/admin/ProcessOrder'
import { AdminUserList } from './components/admin/AdminUserList'
import { UpdateUser } from './components/admin/UpdateUser'
import { AdminProductReviews } from './components/admin/AdminProductReviews'

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  transition: transitions.SCALE
}

function App() {
  const [stripeApiKey, setStripeApiKey] = useState('')

  useEffect(() => {
    if (store.getState().auth.user) {
      store.dispatch(loadUser())
    }

    async function getStripeApiKey() {
      const { data } = await axios.get('http://localhost:4000/api/v1/stripeapi', {
        withCredentials: true
      })
      console.log('stripe key', data)
      setStripeApiKey(data.stripe)
    }

    getStripeApiKey()
  }, [])

  return (
    <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...options}>
        <BrowserRouter>
          <div className='App'>
            <Header></Header>
            <div className='container'>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/search/:keyword' element={<Home />} />
                <Route path='/product/:id' element={<ProductDetails />} />
                <Route path='/login' element={<Login />} />
                <Route path='/cart' element={<Cart />} />

                <Route element={<ProtectedRoute />}>
                  <Route path='/me' element={<Profile />} />
                  <Route path='/me/edit' element={<UpdateProfile />} />
                  <Route path='/password/update' element={<UpdatePassword />} />
                  <Route path='/shipping' element={<Shipping />} />
                  <Route path='/order/confirm' element={<ConfirmOrder />} />
                  <Route path='/orders/me' element={<OrderList />} />
                  <Route path='/order/:id' element={<OrderDetails />} />
                  <Route path='/success' element={<OrderSuccess />} />
                  {stripeApiKey && (
                    <Route
                      path='/payment'
                      element={
                        <Elements stripe={loadStripe(stripeApiKey)}>
                          <Payment />
                        </Elements>
                      }
                    />
                  )}
                </Route>
                <Route path='/register' element={<Register />} />
                <Route path='/password/forgot' element={<ForgotPassword />} />
              </Routes>
            </div>
            <Routes>
              <Route element={<ProtectedRoute isAdmin />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/admin/products' element={<AdminProductsList />} />
                <Route path='/admin/products/new' element={<NewProduct />} />
                <Route path='/admin/products/:id' element={<UpdateProduct />} />
                <Route path='/admin/order/:id' element={<ProcessOrder />} />
                <Route path='/admin/orders' element={<AdminOrderList />} />
                <Route path='/admin/users' element={<AdminUserList />} />
                <Route path='/admin/reviews' element={<AdminProductReviews />} />
                <Route path='/admin/user/:id' element={<UpdateUser />} />
              </Route>
            </Routes>
          </div>
          <Footer></Footer>
        </BrowserRouter>{' '}
      </AlertProvider>
    </Provider>
  )
}

export default App
