import { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
import { clearError, deleteReview, getProductReviews } from '../../actions/productActions'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'
import { MDBDataTable } from 'mdbreact'

import { useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Review } from '../../reducers/productReducers'
import { CLEAR_STATUS } from '../../constants/user'

export const AdminProductReviews = () => {
  const { loading, reviews, error } = useSelector((state: RootState) => state.productReviews)
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

  const handleDeleteReview = (review: Review) => {
    dispatch(deleteReview(productId, review._id))
    dispatch(getProductReviews(productId))
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
    rows: reviews.map(review => {
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
    dispatch(getProductReviews(productId))
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
                <button type='submit' className='btn btn-primary w-100 py-2'>
                  Search
                </button>
              </form>
            </div>
          </div>

          <div className='col-12 col-md-10'>
            <h1 className='mt-5'>All Product reviews</h1>
            {reviews.length > 0 ? (
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
