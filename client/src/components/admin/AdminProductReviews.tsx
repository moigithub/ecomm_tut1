import { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
// import { clearError, deleteReview, getProductReviews } from '../../actions/productActions'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'
import { MDBDataTable } from 'mdbreact'

import { useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Review } from '../../reducers/productReducers'
import { CLEAR_STATUS } from '../../constants/user'
import { clearStatus, setSuccess } from '../../slices/appStateSlice'
import { deleteProductReview, setProductReviews } from '../../slices/productSlice'
import axios from 'axios'

export const AdminProductReviews = () => {
  const { loading, productReviews, error } = useSelector((state: RootState) => state.product)
  const {
    loading: appLoading,
    message,
    error: errorMessage
  } = useSelector((state: RootState) => state.appState)
  const [productId, setProductId] = useState('')
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const alert = useAlert()

  // useEffect(() => {
  //   dispatch(getProductReviews())
  // }, [dispatch, message])

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

  const handleDeleteReview = (review: Review) => {
    const deleteReview = async (productId: string, reviewId: string) => {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/admin/product/${productId}/reviews/${reviewId}`,
        { withCredentials: true }
      )
      dispatch(deleteProductReview(reviewId))
      dispatch(setSuccess('Review deleted successfully'))
    }
    // dispatch(getProductReviews(productId))
    deleteReview(productId, review._id)
  }

  if (loading || appLoading) {
    return <Loader />
  }

  const data = {
    columns: [
      {
        label: 'Review ID',
        field: 'id',
        sort: 'asc'
      },
      {
        label: 'Rating',
        field: 'rating',
        sort: 'asc'
      },
      {
        label: 'Comment',
        field: 'comment',
        sort: 'asc'
      },
      {
        label: 'User',
        field: 'user',
        sort: 'asc'
      },
      {
        label: 'Actions',
        field: 'actions',
        sort: 'asc'
      }
    ],
    rows: productReviews.map(review => {
      return {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        user: review.user,
        actions: (
          <>
            <button
              className='btn btn-danger py-1 px-2 ml-2'
              onClick={() => handleDeleteReview(review)}
            >
              <i className='fa fa-trash'></i>
            </button>
          </>
        )
      }
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const getProductReviews = async (id: string) => {
      let url = `http://localhost:4000/api/v1/product/${id}/reviews`
      const { data } = await axios.get(url, { withCredentials: true })

      dispatch(setProductReviews(data.reviews))
    }
    getProductReviews(productId)
  }

  return (
    <>
      <MetaData title='All product reviews' />
      <div className='row'>
        <div className='col-12 col-md-2'>
          <Sidebar />
        </div>
        <div className='col-12 col-md-10'>
          <div className='row justify-content-center mt-5'>
            <div className='col-5'>
              <form onSubmit={handleSubmit}>
                <div className='form-group'>
                  <label htmlFor='productId_field'>Enter product ID</label>
                  <input
                    type='text'
                    id='productId_field'
                    className='form-control'
                    value={productId}
                    onChange={e => setProductId(e.target.value)}
                  />
                </div>
                <button type='submit' disabled={!productId} className='btn btn-primary w-100 py-2'>
                  Search
                </button>
              </form>
            </div>
          </div>

          <div className='col-12 col-md-10'>
            <h1 className='mt-5'>All Product reviews</h1>
            {productReviews.length > 0 ? (
              <MDBDataTable data={data} className='px-3' bordered striped hover></MDBDataTable>
            ) : (
              <p className='mt-5 text-center'>No reviews</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
