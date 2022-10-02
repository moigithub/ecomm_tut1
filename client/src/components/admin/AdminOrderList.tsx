import { useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
import { clearError, getAdminOrders } from '../../actions/productActions'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'
import { MDBDataTable } from 'mdbreact'

import { Link, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { CLEAR_STATUS } from '../../constants/user'
import { Order } from '../../reducers/orderReducer'
import { deleteOrder } from '../../actions/orderActions'

export const AdminOrderList = () => {
  const { loading, orders, error } = useSelector((state: RootState) => state.adminOrders)
  const {
    loading: appLoading,
    message,
    error: errorMessage
  } = useSelector((state: RootState) => state.appState)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const alert = useAlert()

  useEffect(() => {
    dispatch(getAdminOrders())
  }, [dispatch, message])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearError())
    }
    if (message) {
      alert.success(message)
      dispatch({ type: CLEAR_STATUS })
    }
    if (errorMessage) {
      alert.error(errorMessage)
      dispatch({ type: CLEAR_STATUS })
    }
  }, [error, errorMessage, message])

  const handleDeleteOrder = (order: Order) => {
    dispatch(deleteOrder(order._id))
  }

  if (loading || appLoading) {
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
        label: 'Nº of Items',
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
      const statusStyle = order.orderStatus.includes('Delivered')
        ? { color: 'green' }
        : { color: 'red' }

      return {
        id: order._id,
        numOfItems: order.orderItems.length,
        amount: `$${order.totalPrice.toFixed(2)}`,
        status: <p style={statusStyle}>{order.orderStatus}</p>,

        actions: (
          <>
            <Link to={`/admin/order/${order._id}`} className='btn btn-primary py-1 px-2'>
              <i className='fa fa-eye'></i>
            </Link>
            <button
              className='btn btn-danger py-1 px-2 ms-2'
              onClick={() => handleDeleteOrder(order)}
            >
              <i className='fa fa-trash'></i>
            </button>
          </>
        )
      }
    })
  }

  return (
    <>
      <MetaData title='All orders'></MetaData>
      <div className='row'>
        <div className='col-12 col-md-2'>
          <Sidebar></Sidebar>
        </div>
        <div className='col-12 col-md-10'>
          <h1 className='mt-5'>All Orders</h1>

          <MDBDataTable data={data} className='px-3' bordered striped hover></MDBDataTable>
        </div>
      </div>
    </>
  )
}
