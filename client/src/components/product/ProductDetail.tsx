import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import type {} from 'redux-thunk/extend-redux'
import { useParams } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'
import { addCartItem } from '../../actions/cartActions'
import { getProductDetails, clearError, newReview } from '../../actions/productActions'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'
import { REVIEW_RESET } from '../../constants/product.js'

export const ProductDetails = () => {
  const { id } = useParams()
  const { loading, product, error } = useSelector((state: RootState) => state.productDetails)
  const { user } = useSelector((state: RootState) => state.auth)
  const { error: reviewError, success } = useSelector((state: RootState) => state.newReview)
  const dispatch = useDispatch()
  const alert = useAlert()
  const [count, setCount] = useState(1)
  const [rating, setRating] = useState(0)
  const [hoverStar, setRatingHover] = useState(0)
  const [comment, setComment] = useState('')

  useEffect(() => {
    dispatch(getProductDetails(id))
  }, [dispatch, id])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearError()) //FIXME: prod details dont have error key
    }

    if (reviewError) {
      alert.error(reviewError)
      dispatch({ type: REVIEW_RESET })

      dispatch(clearError())
    }

    if (success) {
      alert.success('Review submitted successfully')
      dispatch({ type: REVIEW_RESET })
    }
  }, [error, success, reviewError])

  const decreaseQty = () => {
    if (count > 1) {
      setCount(c => c - 1)
    }
  }

  const increaseQty = () => {
    const currentStock = product?.stock || 0
    if (count < currentStock) {
      setCount(c => c + 1)
    }
  }

  const addToCart = () => {
    dispatch(addCartItem(id, count))
  }

  const setCurrentRatings = (star: number) => () => {
    setRating(star)
  }

  const submitReviewHandler = () => {
    dispatch(newReview(id, rating, comment))
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <MetaData title='Home'></MetaData>
      <div className='row f-flex justify-content-around'>
        <div className='col-12 col-lg-5 img-fluid' id='product_image'>
          <Carousel pause='hover'>
            {product?.images?.map(image => (
              <Carousel.Item key={image.public_id}>
                <img
                  src={'http://localhost:4000/' + image.url}
                  alt={product?.name}
                  className='d-block w-100'
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        <div className='col-12 col-lg-5 mt-5'>
          <h3>{product?.name}</h3>
          <p id='product_id'>{product?._id}</p>
          <hr />
          <div className='rating-outer'>
            <div
              className='rating-inner'
              style={{ width: `${((product?.ratings || 0) / 5) * 100}%` }}
            ></div>
          </div>

          <span id='no_of_reviews'>({product?.numOfReviews} reviews)</span>
          <hr />
          <p id='product_price'></p>
          <div className='stockCounter d-inline'>
            <span className='btn btn-danger minus' onClick={decreaseQty}>
              -
            </span>
            <input type='text' className='form-control count d-inline' value={count} readOnly />
            <span className='btn btn-primary plus' onClick={increaseQty}>
              +
            </span>
          </div>
          <button
            type='button'
            id='cart_btn'
            className='btn btn-primary d-inline ms-4'
            onClick={addToCart}
          >
            Add to cart
          </button>
          <hr />
          <p>
            Status
            <span
              id='stock_status'
              className={(product?.stock || 0) > 0 ? 'greenColor' : 'redColor'}
            >
              {(product?.stock || 0) > 0 ? 'In stock' : 'Out of Stock'}
            </span>
          </p>
          <hr />
          <h4 className='mt-2'>description:</h4>
          <p>{product?.description}</p>
          <hr />
          <p id='product_seller' className='mb-3'>
            Sold by: <strong>{product?.seller}</strong>
          </p>

          {user ? (
            <button
              id='review_btn'
              type='button'
              className='btn btn-primary mt-4'
              data-bs-toggle='modal'
              data-bs-target='#ratingModal'
            >
              Submit review
            </button>
          ) : (
            <div className='alert alert-danger mt-5'>Login to post review</div>
          )}

          <div className='row mt2 mb-5'></div>
          <div className='rating w-50'>
            <div
              className='modal fade'
              id='ratingModal'
              tabIndex={-1}
              aria-hidden='true'
              aria-labelledby='ratingModalLabel'
            >
              <div className='modal-dialog'>
                <div className='modal-content'>
                  <div className='modal-header'>
                    <h5 className='modal-title' id='ratingModalLabel'>
                      Submit review
                    </h5>
                    <button
                      type='button'
                      className='close'
                      data-bs-dismiss='modal'
                      aria-label='close'
                    >
                      <span aria-hidden='true'>&times;</span>
                    </button>
                  </div>
                  <div className='modal-body'>
                    <ul className='stars'>
                      <li
                        className={`star ${rating >= 1 ? 'orange' : ''} ${
                          hoverStar >= 1 ? 'yellow' : ''
                        }`}
                        onClick={setCurrentRatings(1)}
                        onMouseOver={() => setRatingHover(1)}
                        onMouseOut={() => setRatingHover(0)}
                      >
                        <i className='fa fa-star'></i>
                      </li>
                      <li
                        className={`star ${rating >= 2 ? 'orange' : ''} ${
                          hoverStar >= 2 ? 'yellow' : ''
                        }`}
                        onClick={setCurrentRatings(2)}
                        onMouseOver={() => setRatingHover(2)}
                        onMouseOut={() => setRatingHover(0)}
                      >
                        <i className='fa fa-star'></i>
                      </li>
                      <li
                        className={`star ${rating >= 3 ? 'orange' : ''} ${
                          hoverStar >= 3 ? 'yellow' : ''
                        }`}
                        onClick={setCurrentRatings(3)}
                        onMouseOver={() => setRatingHover(3)}
                        onMouseOut={() => setRatingHover(0)}
                      >
                        <i className='fa fa-star'></i>
                      </li>
                      <li
                        className={`star ${rating >= 4 ? 'orange' : ''} ${
                          hoverStar >= 4 ? 'yellow' : ''
                        }`}
                        onClick={setCurrentRatings(4)}
                        onMouseOver={() => setRatingHover(4)}
                        onMouseOut={() => setRatingHover(0)}
                      >
                        <i className='fa fa-star'></i>
                      </li>
                      <li
                        className={`star ${rating >= 5 ? 'orange' : ''} ${
                          hoverStar >= 5 ? 'yellow' : ''
                        }`}
                        onClick={setCurrentRatings(5)}
                        onMouseOver={() => setRatingHover(5)}
                        onMouseOut={() => setRatingHover(0)}
                      >
                        <i className='fa fa-star'></i>
                      </li>
                    </ul>

                    <textarea
                      name='review'
                      id='review'
                      className='form-control mt-3'
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                    ></textarea>
                    <button
                      className='btn my-3 float-right review-btn px-4 text-white'
                      aria-label='close'
                      onClick={submitReviewHandler}
                      data-bs-dismiss='modal'
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='reviews w-75'>
          <h3>Others reviews:</h3>
          <hr />
          {product?.reviews.map(review => (
            <div key={review._id} className='review-cart my-3'>
              <div className='rating-outer'>
                <div
                  className='rating-inner'
                  style={{ width: `${((review.rating || 0) / 5) * 100}%` }}
                ></div>
              </div>
              <p className='review_user'>by {review.name}</p>
              <p className='review_comment'>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
