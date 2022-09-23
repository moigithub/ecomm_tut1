import { Fragment, useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
import { clearError } from '../../actions/productActions'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'
import { orderDetails } from '../../actions/orderActions'
import { Link, useParams } from 'react-router-dom'

export const OrderDetails = () => {
  const { id } = useParams()
  const { loading, order, error } = useSelector((state: RootState) => state.orderDetails)
  const { shipping } = useSelector((state: RootState) => state.cart)

  const dispatch = useDispatch()
  const alert = useAlert()

  useEffect(() => {
    dispatch(orderDetails(id))
  }, [dispatch])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearError())
    }
  }, [error])

  if (loading) {
    return <Loader />
  }

  const shippingDetails = `${shipping?.address}, ${shipping?.city}, ${shipping?.postalCode}, ${shipping?.country}`
  const isPaid = (order?.paymentInfo.status || '') === 'succeeded'
  const statusClass = order?.orderStatus.includes('Delivered') ? 'greenColor' : 'redColor'

  return (
    <>
      <MetaData title='Order details'></MetaData>

      <div className='row d-flex justify-content-between'>
        <div className='col-12 col-lg-8 mt-5 order-details'>
          <h1 className='my-5'>order #{order?._id}</h1>

          <h4 className='mb-4'>Shipping info</h4>
          <p>
            <b>Name:</b> {order?.user.name}
          </p>
          <p>
            <b>Phone:</b> {shipping?.phoneNo}
          </p>
          <p className='mb-4'>
            <b>Address:</b> {shippingDetails}
          </p>
          <p>
            <b>Amount:</b> ${order?.totalPrice}
          </p>

          <hr />

          <h4 className='mb-4'>Payment</h4>
          <p className={isPaid ? 'greenColor' : 'redColor'}>
            <b>{isPaid ? 'PAID' : 'NOT PAID'}</b>
          </p>

          <h4 className='mb-4'>Order Status:</h4>

          <p className={statusClass}>{order?.orderStatus}</p>

          <h4 className='mb-4'>Order Items:</h4>
          <hr />

          <div className='cart-item my-1'>
            {order?.orderItems.map(item => (
              <div key={item._id} className='row my-5'>
                <div className='col-4 col-lg-2'>
                  <img src={item.image} alt={item.name} height='45' width='65' />
                </div>

                <div className='col-5 col-lg-5'>
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                </div>

                <div className='col-4 col-lg-2 mt-4 mt-lg-0'>
                  <p>${item.price}</p>
                </div>

                <div className='col-4 col-lg-3 mt-4 mt-lg-0'>
                  <p>{item.quantity} piece(s)</p>
                </div>
              </div>
            ))}
          </div>
          <hr />
        </div>
      </div>
    </>
  )
}
