import { useEffect, useId, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import type {} from 'redux-thunk/extend-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { MetaData } from '../layout/MetaData'
import {
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js'
import { CheckoutSteps } from './CheckoutSteps'
import { StripeCardElementOptions, StripeCardNumberElement } from '@stripe/stripe-js'
import axios from 'axios'
import { newOrder } from '../../slices/orderSlice'
// import { createOrder } from '../../actions/orderActions'

export const Payment = () => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const alert = useAlert()
  const dispatch = useDispatch()
  const { cartItems, shipping } = useSelector((state: RootState) => state.cart)
  const { user } = useSelector((state: RootState) => state.user)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (elements == null) {
      return
    }

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo') as string)
    const paymentData = { amount: Math.round(orderInfo.totalPrice * 100) }

    try {
      const res = await axios.post('http://localhost:4000/api/v1/payment/process', paymentData, {
        headers: { 'content-type': 'application/json' },
        withCredentials: true
      })

      const clientSecret = res.data.client_secret
      const result = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement) as StripeCardNumberElement,
          billing_details: {
            name: user?.name,
            email: user?.email
          }
        }
      })

      if (result?.error) {
        alert.error(result.error.message)
      } else {
        if (result?.paymentIntent.status === 'succeeded') {
          const order = {
            // _id: useId(),
            orderItems: cartItems.map(item => ({
              name: item.name,
              quantity: item.quantity,
              image: item.image,
              price: item.price,
              product: item._id
            })),
            shippingInfo: {
              address: shipping?.address,
              city: shipping?.city,
              phone: shipping?.phoneNo,
              postalCode: shipping?.postalCode,
              country: shipping?.country
            },
            itemsPrice: orderInfo.itemsPrice,
            taxPrice: orderInfo.taxPrice,
            shippingPrice: orderInfo.shippingPrice,
            totalPrice: orderInfo.totalPrice,
            paymentInfo: { id: result.paymentIntent.id, status: result.paymentIntent.status }
            // orderStatus: 'Pending'
          }
          const { data } = await axios.post('http://localhost:4000/api/v1/order/new', order, {
            headers: { 'content-type': 'application/json' },
            withCredentials: true
          })
          dispatch(newOrder(data.order))
          navigate('/success')
        }
      }
    } catch (error: any) {
      alert.error(error.response.data.message)
    }
  }

  const options: StripeCardElementOptions = {
    iconStyle: 'solid',
    style: {
      base: {
        fontSize: '16px'
      },
      invalid: {
        color: '#9e2146'
      }
    }
  }

  return (
    <>
      <MetaData title='Cart'></MetaData>
      <CheckoutSteps step={3} />
      <div className='row wrapper'>
        <div className='col-10 col-lg-5'>
          <form className='shadow-lg' onSubmit={handleSubmit}>
            <h1 className='mb-4'>Card Info</h1>
            <div className='form-group'>
              <label htmlFor='card_num_field'>Card Number</label>
              <CardNumberElement id='card_num_field' className='form-control' options={options} />
            </div>
            <div className='form-group'>
              <label htmlFor='card_exp_field'>Card Expiration</label>
              <CardExpiryElement id='card_exp_field' className='form-control' options={options} />
            </div>
            <div className='form-group'>
              <label htmlFor='card_cvc_field'>CVC</label>
              <CardCvcElement id='card_cvc_field' className='form-control' options={options} />
            </div>
            <button
              type='submit'
              id='pay_btn'
              className='btn w-100 py-3'
              disabled={!stripe || !elements}
            >
              Pay
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
