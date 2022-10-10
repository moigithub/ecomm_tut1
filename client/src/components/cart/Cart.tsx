import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import type {} from 'redux-thunk/extend-redux'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Product } from '../../reducers/productReducers'
import { RootState } from '../../store'
import { MetaData } from '../layout/MetaData'
// import { addCartItem, removeCartItem } from '../../actions/cartActions'
import { CartItem } from '../../reducers/cartReducers'
import axios from 'axios'
import { removeCartItem, updateCartItem } from '../../slices/cartSlice'

export const Cart = () => {
  const navigate = useNavigate()
  const alert = useAlert()
  const dispatch = useDispatch()
  const { cartItems } = useSelector((state: RootState) => state.cart)

  const getProduct = async (id: string, quantity: number) => {
    const { data } = await axios.get(`http://localhost:4000/api/v1/product/${id}`, {
      withCredentials: true
    })
    return {
      _id: id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.stock,
      quantity
    }
  }
  const decreaseQty = async (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return

    const newQty = cartItem.quantity - 1
    dispatch(updateCartItem(await getProduct(cartItem._id, newQty)))
  }

  const increaseQty = async (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return

    const newQty = cartItem.quantity + 1
    dispatch(updateCartItem(await getProduct(cartItem._id, newQty)))
  }

  const removeItem = (cartItem: CartItem) => {
    dispatch(removeCartItem(cartItem._id))
  }

  const handleCheckout = () => {
    navigate('/login?redirect=shipping')
  }

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0)

  return (
    <>
      <MetaData title='Cart'></MetaData>
      {cartItems.length === 0 ? (
        <h2 className='mt-5'>Cart is empty</h2>
      ) : (
        <>
          <h2 className='mt-5'>Cart: {cartItems.length} items</h2>

          <div className='row d-flex justify-content-between'>
            <div className='col-12 col-lg-8'>
              {cartItems.map(item => (
                <div key={item._id} className='cart-item'>
                  <div className='row'>
                    <div className='col-4 col-lg-3'>
                      <img
                        src={'http://localhost:4000/' + item.image}
                        alt=''
                        height='90'
                        width='115'
                      />
                    </div>
                    <div className='col-5 col-lg-3'>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </div>
                    <div className='col-4 col-lg-2 mt-4 mt-lg-0'>
                      <p id='cart_item_price'>{item.price}</p>
                    </div>
                    <div className='col-4 col-lg-3 mt-4 mt-lg-0'>
                      <div className='stockCounter d-inline'>
                        <span className='btn btn-danger minus' onClick={() => decreaseQty(item)}>
                          -
                        </span>
                        <input
                          type='text'
                          className='form-control count d-inline'
                          value={item.quantity}
                          readOnly
                        />
                        <span className='btn btn-primary plus' onClick={() => increaseQty(item)}>
                          +
                        </span>
                      </div>
                    </div>

                    <div className='col-4 col-lg-1 mt-4 mt-lg-0'>
                      <i
                        id='delete_cart_item'
                        className='fa fa-trash btn btn-danger'
                        onClick={() => removeItem(item)}
                      ></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='col-12 col-lg-3 my-4'>
            <div id='order_summary'>
              <h4>Order summary</h4>
              <hr />
              <p>
                Subtotal:<span className='order-summary-values'>{cartItemsCount} units</span>
              </p>
              <p>
                Est.total:<span className='order-summary-values'>${totalPrice.toFixed(2)}</span>
              </p>
              <hr />
              <button id='checkout_btn' className='btn btn-primary w-100' onClick={handleCheckout}>
                Check out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
