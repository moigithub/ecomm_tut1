import { useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'
import { Sidebar } from './Sidebar'
import { Product } from '../../reducers/productReducers'
import { clearStatus } from '../../slices/appStateSlice'
import { deleteAdminProduct, setAdminProducts } from '../../slices/productSlice'
import { deleteProduct, getAdminProducts } from '../../services/productService'

export const AdminProductsList = () => {
  const { loading, adminProducts, error } = useSelector((state: RootState) => state.product)
  const {
    loading: appLoading,
    message,
    error: errorMessage
  } = useSelector((state: RootState) => state.appState)

  const dispatch = useDispatch()
  const alert = useAlert()

  useEffect(() => {
    const getData = async () => {
      dispatch(setAdminProducts(await getAdminProducts()))
    }
    getData()
  }, [dispatch, message])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearStatus())
    }
    if (message) {
      alert.success(message)
      dispatch(clearStatus())
    }
    if (errorMessage) {
      alert.error(errorMessage)
      dispatch(clearStatus())
    }
  }, [error, errorMessage, message])

  const handleDeleteProduct = async (product: Product) => {
    dispatch(deleteAdminProduct(await deleteProduct(product._id)))
  }

  if (loading || appLoading) {
    return <Loader />
  }

  const data = {
    columns: [
      {
        label: 'ID',
        field: 'id',
        sort: 'asc'
      },
      {
        label: 'Name',
        field: 'name',
        sort: 'asc'
      },
      {
        label: 'Price',
        field: 'price',
        sort: 'asc'
      },
      {
        label: 'Stock',
        field: 'stock',
        sort: 'asc'
      },
      {
        label: 'Actions',
        field: 'actions',
        sort: 'asc'
      }
    ],
    rows: adminProducts.map(product => {
      return {
        id: product._id,
        name: product.name,
        price: `$${product.price.toFixed(2)}`,
        stock: product.stock,
        actions: (
          <>
            <Link to={`/admin/products/${product._id}`} className='btn btn-primary py-1 px-2'>
              <i className='fa fa-pencil'></i>
            </Link>
            <button
              className='btn btn-danger py-1 px-2 ml-2'
              onClick={() => handleDeleteProduct(product)}
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
      <MetaData title='All products'></MetaData>
      <div className='row'>
        <div className='col-12 col-md-2'>
          <Sidebar></Sidebar>
        </div>
        <div className='col-12 col-md-10'>
          <h1 className='mt-5'>All Products</h1>

          <MDBDataTable data={data} className='px-3' bordered striped hover></MDBDataTable>
        </div>
      </div>
    </>
  )
}
