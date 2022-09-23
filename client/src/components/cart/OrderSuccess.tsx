import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import type {} from 'redux-thunk/extend-redux'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Product } from '../../reducers/productReducers'
import { RootState } from '../../store'
import { MetaData } from '../layout/MetaData'
import { addCartItem, removeCartItem, saveShippingInfo } from '../../actions/cartActions'
import { CartItem } from '../../reducers/cartReducers'
import { countries } from 'countries-list'
import { CheckoutSteps } from './CheckoutSteps'

export const OrderSuccess = () => {
  const navigate = useNavigate()
  const alert = useAlert()
  const dispatch = useDispatch()
  const { shipping } = useSelector((state: RootState) => state.cart)

  return (
    <>
      <MetaData title='Order success'></MetaData>

      <div className='row justify-content-center'>
        <div className='col-6 mt-5 text-center'>
          <img
            src='https://freepngimg.com/thumb/success/6-2-success-png-img.png'
            alt=''
            width='200'
            height='200'
            className='my-5 img-fluid d-block mx-auto'
          />
          <h2>Your order has been placed successfully</h2>

          <Link to='/orders/me'>Go to Orders</Link>
        </div>
      </div>
    </>
  )
}
