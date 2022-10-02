import { Link } from 'react-router-dom'
import type { Product } from '../../reducers/productReducers'

export const ProductComp = ({ product, col }: { product: Product; col: number }) => {
  return (
    <div className={`col-sm-12 col-md-6 col-lg-${col} my-3`}>
      <div className='card p-3 rounded'>
        <img
          src={'http://localhost:4000/' + product.images?.[0]?.url}
          alt=''
          className='card-img-top mx-auto img-fluid'
        />
        <div className='card-body d-flex flex-column'>
          <h5 className='card-title'>
            <Link to={`/product/${product._id}`}>{product.name}</Link>
          </h5>
          <div className='ratings mt-auto'>
            <div className='rating-outer'>
              <div
                className='rating-inner'
                style={{ width: `${(product.ratings / 5) * 100}%` }}
              ></div>
            </div>
            <span id='no_of_reviews'>({product.numOfReviews} Reviews)</span>
          </div>
          <p className='card-text'>${product.price}</p>
          <Link to={`/product/${product._id}`} className='btn w-100'>
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
