import { useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { MetaData } from '../layout/MetaData'
import { CheckoutSteps } from './CheckoutSteps'

export const ConfirmOrder = () => {
  const navigate = useNavigate()
  const alert = useAlert()
  const { shipping, cartItems } = useSelector((state: RootState) => state.cart)
  const { user } = useSelector((state: RootState) => state.user)

  const handlePayment = (e: React.MouseEvent<HTMLButtonElement>) => {
    const data = {
      itemsPrice: subTotalPrice.toFixed(2),
      shippingPrice,
      taxPrice,
      totalPrice
    }
    sessionStorage.setItem('orderInfo', JSON.stringify(data))
    navigate('/payment')
  }

  const subTotalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0)
  const shippingPrice = subTotalPrice > 200 ? 0 : 200
  const taxPrice = subTotalPrice * 0.05
  const totalPrice = subTotalPrice + shippingPrice + taxPrice

  return (
    <>
      <MetaData title='Confirm order'></MetaData>

      <CheckoutSteps step={2} />

      <div className='row d-flex justify-content-between'>
        <div className='col-12 col-lg-8 mt-5 order-confirm'>
          <h4 className='mb-3'></h4>
          <p>
            <b>Name:</b> {user?.name}
          </p>
          <p>
            <b>Phone:</b> {shipping?.phoneNo}
          </p>
          <p className='mb-4'>
            <b>Address:</b> {shipping?.address}, {shipping?.city}, {shipping?.postalCode},{' '}
            {shipping?.country}
          </p>

          <hr />
          <h4 className='mt-4'>Your cart items:</h4>

          <hr />
          {cartItems.map(item => (
            <div key={item._id} className='cart-item my-1'>
              <div className='row'>
                <div className='col-4 col-lg-2'>
                  <img src={item.image} alt={item.name} width='45' height='65' />
                </div>

                <div className='col-5 col-lg-6'>
                  <Link to={`/product/${item._id}`}>{item.name}</Link>
                </div>

                <div className='col-4 col-lg-4 mt-4 mt-lg-0'>
                  <p>
                    {item.quantity} x {item.price} = <b>${item.price * item.quantity}</b>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='col-12 col-lg-3 my-4'>
          <div id='order_summary'>
            <h4>Order summary</h4>
            <hr />
            <p>
              Subtotal:<span className='order-summary-values'>{subTotalPrice.toFixed(2)} </span>
            </p>
            <p>
              Shipping:<span className='order-summary-values'>{shippingPrice.toFixed(2)} </span>
            </p>
            <p>
              Tax:<span className='order-summary-values'>{taxPrice.toFixed(2)} </span>
            </p>

            <p>
              Total:<span className='order-summary-values'>${totalPrice.toFixed(2)}</span>
            </p>
            <hr />
            <button id='checkout_btn' className='btn btn-primary w-100' onClick={handlePayment}>
              Proceed to payment
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
