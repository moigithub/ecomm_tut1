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

export const Shipping = () => {
  const navigate = useNavigate()
  const alert = useAlert()
  const dispatch = useDispatch()
  const { shipping } = useSelector((state: RootState) => state.cart)
  const [address, setAddress] = useState(shipping?.address ?? '')
  const [city, setCity] = useState(shipping?.city ?? '')
  const [postalCode, setPostalCode] = useState(shipping?.postalCode ?? '')
  const [phoneNo, setPhoneNo] = useState(shipping?.phoneNo ?? '')
  const [country, setCountry] = useState(shipping?.country ?? '')

  const countriesList = Object.entries(countries)
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      address,
      city,
      postalCode,
      phoneNo,
      country
    }
    dispatch(saveShippingInfo(data))
    navigate('/order/confirm')
  }

  return (
    <>
      <MetaData title='Shipping'></MetaData>

      <CheckoutSteps step={1} />
      <div className='row wrapper'>
        <div className='col-10 col-lg-5'>
          <form className='shadow-lg' onSubmit={submitHandler}>
            <h1 className='mb-4'>Shipping Info</h1>
            <div className='form-group'>
              <label htmlFor='address_field'>Address</label>
              <input
                type='text'
                id='address_field'
                className='form-control'
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='city_field'>City</label>
              <input
                type='text'
                id='city_field'
                className='form-control'
                value={city}
                onChange={e => setCity(e.target.value)}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='postalCode_field'>Postal Code</label>
              <input
                type='text'
                id='postalCode_field'
                className='form-control'
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='phoneNo_field'>Phone number</label>
              <input
                type='text'
                id='phoneNo_field'
                className='form-control'
                value={phoneNo}
                onChange={e => setPhoneNo(e.target.value)}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='country_field'>Country</label>
              <select
                id='country_field'
                className='form-control'
                value={country}
                onChange={e => setCountry(e.target.value)}
                required
              >
                <option value='' disabled>
                  Select a country
                </option>
                {countriesList.map(country => (
                  <option key={country[0]} value={country[0]}>
                    {country[1].name}
                  </option>
                ))}
              </select>
            </div>
            <button type='submit' id='shipping_btn' className='btn w-100 py-3'>
              Continue
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
