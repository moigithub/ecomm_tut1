import { useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
// import { clearError } from '../../actions/productActions'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'
import { MDBDataTable } from 'mdbreact'
// import { myOrders } from '../../actions/orderActions'
import { Link } from 'react-router-dom'
import { clearStatus } from '../../slices/appStateSlice'
import axios from 'axios'
import { setOrders } from '../../slices/orderSlice'

export const OrderList = () => {
  const { loading, orders, error } = useSelector((state: RootState) => state.order)
  const dispatch = useDispatch()
  const alert = useAlert()

  useEffect(() => {
    const getOrders = async () => {
      const { data } = await axios.get('http://localhost:4000/api/v1/orders/me', {
        headers: { 'content-type': 'application/json' },
        withCredentials: true
      })
      console.log('orders', data)
      dispatch(setOrders(data))
    }
    getOrders()
  }, [dispatch])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearStatus())
    }
  }, [error])

  if (loading) {
    return <Loader />
  }

  const data = {
    columns: [
      {
        label: 'Order ID',
        field: 'id',
        sort: 'asc'
      },
      {
        label: 'Nº items',
        field: 'numOfItems',
        sort: 'asc'
      },
      {
        label: 'Amount',
        field: 'amount',
        sort: 'asc'
      },
      {
        label: 'Status',
        field: 'status',
        sort: 'asc'
      },
      {
        label: 'Actions',
        field: 'actions',
        sort: 'asc'
      }
    ],
    rows: orders.map(order => {
      const statusStyle = order.orderStatus?.includes('Delivered')
        ? { color: 'green' }
        : { color: 'red' }

      return {
        id: order._id,
        numOfItems: order.orderItems.length,
        amount: `$${order.totalPrice.toFixed(2)}`,
        status: <p style={statusStyle}>{order.orderStatus}</p>,
        actions: (
          <Link to={`/order/${order._id}`}>
            <i className='fa fa-eye'></i>
          </Link>
        )
      }
    })
  }

  return (
    <>
      <MetaData title='Home'></MetaData>

      <h1 className='mt-5'>My Orders</h1>

      <MDBDataTable data={data} className='px-3' bordered striped hover></MDBDataTable>
    </>
  )
}
