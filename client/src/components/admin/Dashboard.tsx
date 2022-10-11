import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getOrders } from '../../services/orderService'
import { getAdminProducts } from '../../services/productService'
import { getUsers } from '../../services/userService'
import { setAdminOrders } from '../../slices/orderSlice'
import { setAdminProducts } from '../../slices/productSlice'
import { setAdminUsers } from '../../slices/userSlice'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { Sidebar } from './Sidebar'

export const Dashboard = () => {
  const dispatch = useDispatch()
  const { users } = useSelector((state: RootState) => state.user)
  const { adminProducts } = useSelector((state: RootState) => state.product)
  const { loading, orders, totalAmount } = useSelector((state: RootState) => state.order)
  let outOfStock = adminProducts.reduce(
    (total, product) => total + (product.stock === 0 ? 1 : 0),
    0
  )

  useEffect(() => {
    const getData = async () => {
      dispatch(setAdminOrders(await getOrders()))
      dispatch(setAdminProducts(await getAdminProducts()))
      dispatch(setAdminUsers(await getUsers()))
    }

    getData()
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  return (
    <div className='row'>
      <div className='col-12 col-md-2'>
        <Sidebar></Sidebar>
      </div>
      <div className='col-12 col-md-10'>
        <h1 className='my-4'>Dashboard</h1>
        <div className='row pr-4'>
          <div className='col-xl-12 col-sm-12 mb-3'>
            <div className='card text-white bg-primary o-hidden h-100'>
              <div className='card-body'>
                <div className='text-center card-font-size'>
                  Total Amount
                  <br />
                  <b>${totalAmount}</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='row pr-4'>
          <div className='col-xl-3 col-sm-6 mb-3'>
            <div className='card text-white bg-success o-hidden h-100'>
              <div className='card-body'>
                <div className='text-center card-font-size'>
                  Products
                  <br />
                  <b>{adminProducts.length}</b>
                </div>
              </div>
              <Link to='/admin/products' className='card-footer text-white clearfix small z-1'>
                <span className='float-left'>View details</span>
                <span className='float-right'>
                  <i className='fa fa-angle-right'></i>
                </span>
              </Link>
            </div>
          </div>

          <div className='col-xl-3 col-sm-6 mb-3'>
            <div className='card text-white bg-danger o-hidden h-100'>
              <div className='card-body'>
                <div className='text-center card-font-size'>
                  Orders
                  <br />
                  <b>{orders.length}</b>
                </div>
              </div>
              <Link to='/admin/orders' className='card-footer text-white clearfix small z-1'>
                <span className='float-left'>View details</span>
                <span className='float-right'>
                  <i className='fa fa-angle-right'></i>
                </span>
              </Link>
            </div>
          </div>

          <div className='col-xl-3 col-sm-6 mb-3'>
            <div className='card text-white bg-info o-hidden h-100'>
              <div className='card-body'>
                <div className='text-center card-font-size'>
                  Users
                  <br />
                  <b>{users.length}</b>
                </div>
              </div>
              <Link to='/admin/users' className='card-footer text-white clearfix small z-1'>
                <span className='float-left'>View details</span>
                <span className='float-right'>
                  <i className='fa fa-angle-right'></i>
                </span>
              </Link>
            </div>
          </div>

          <div className='col-xl-3 col-sm-6 mb-3'>
            <div className='card text-white bg-warning o-hidden h-100'>
              <div className='card-body'>
                <div className='text-center card-font-size'>
                  Out of stock
                  <br />
                  <b>{outOfStock}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
