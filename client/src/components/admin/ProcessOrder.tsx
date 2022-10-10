import { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
// import { clearError, getProductDetails, updateProduct } from '../../actions/productActions'
import { RootState } from '../../store'
import { Sidebar } from './Sidebar'
import { useParams } from 'react-router-dom'
import { CLEAR_STATUS } from '../../constants/user'
import { Loader } from '../layout/Loader'
// import { orderDetails, updateOrder } from '../../actions/orderActions'
import { clearStatus } from '../../slices/appStateSlice'
import axios from 'axios'
import { setOrderDetail, updateAdminOrder } from '../../slices/orderSlice'

const categories = [
  'Electronics',
  'Cameras',
  'Laptop',
  'Accessories',
  'Headphones',
  'Food',
  'Books',
  'Clothes/Shoes',
  'Beauty/Health',
  'Sports',
  'Outdoor',
  'Home'
]

export const ProcessOrder = () => {
  const { id } = useParams()

  const { loading, order, error } = useSelector((state: RootState) => state.order)
  const { shipping } = useSelector((state: RootState) => state.cart)
  const {
    loading: appLoading,
    message,
    error: appError
  } = useSelector((state: RootState) => state.appState)

  const [status, setStatus] = useState(order?.orderStatus || 'processing')

  const dispatch = useDispatch()
  const alert = useAlert()
  const navigate = useNavigate()

  useEffect(() => {
    const orderDetails = async (id: string) => {
      const { data } = await axios.get('http://localhost:4000/api/v1/order/' + id, {
        headers: { 'content-type': 'application/json' },
        withCredentials: true
      })
      return data
    }
    dispatch(setOrderDetail(orderDetails(id as string)))
  }, [dispatch, id])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearStatus())
    }

    if (appError) {
      alert.error(appError)
      dispatch(clearStatus())
    }

    if (message) {
      navigate('/admin/orders')
      alert.success('Order updated successfully')
      dispatch(clearStatus())
    }
  }, [error, appError, message])

  const handleUpdateOrder = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    const order = { status }
    const updateOrder = async (id: string, productData: any) => {
      const { data } = await axios.put(`http://localhost:4000/api/v1/admin/order/${id}`, order, {
        headers: { 'content-type': 'application/json' },
        withCredentials: true
      })
      return data
    }

    dispatch(updateAdminOrder(updateOrder(id as string, order)))
  }

  if (loading || appLoading) {
    return <Loader />
  }

  const shippingDetails = `${shipping?.address}, ${shipping?.city}, ${shipping?.postalCode}, ${shipping?.country}`
  const isPaid = (order?.paymentInfo.status || '') === 'succeeded'
  const statusClass = order?.orderStatus.includes('delivered') ? 'greenColor' : 'redColor'

  return (
    <div className='row'>
      <div className='col-12 col-md-2'>
        <Sidebar></Sidebar>
      </div>
      <div className='col-12 col-md-10'>
        <div className='row d-flex justify-content-around'>
          <div className='col-12 col-lg-7 order-details'>
            <h1 className='my-5'>Order # {order?._id}</h1>
            <h4 className='mb-4'>Shipping Info</h4>
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
            <h4 className='mb-4'>Stripe Id</h4>
            <p>
              <b>{order?.paymentInfo.id}</b>
            </p>

            <h4 className='mb-4'>Order Status:</h4>

            <p className={statusClass}>{order?.orderStatus}</p>

            <h4 className='mb-4'>Order Items:</h4>
            <hr />
            <div className='cart-item my-1'>
              {order?.orderItems.map(item => (
                <div key={item._id} className='row my-5'>
                  <div className='col-4 col-lg-2'>
                    <img
                      src={'http://localhost:4000/' + item.image}
                      alt={item.name}
                      height='45'
                      width='65'
                    />
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

          <div className='col-12 col-lg-3 mt-5'>
            <h4 className='my-4'>Status</h4>

            <div className='form-group'>
              <select
                className='form-control'
                name='status'
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value='processing'>Processing</option>
                <option value='shipped'>Shipped</option>
                <option value='delivered'>Delivered</option>
              </select>
            </div>

            <button className='btn btn-primary w-100' onClick={handleUpdateOrder}>
              Update status
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
