import { Link } from 'react-router-dom'
import { MetaData } from '../layout/MetaData'

export const OrderSuccess = () => {
  return (
    <>
      <MetaData title='Order success'></MetaData>

      <div className='row justify-content-center'>
        <div className='col-6 mt-5 text-center'>
          <img
            src='https://freepngimg.com/thumb/success/6-2-success-png-img.png'
            alt=''
            width='200'
            height='200'
            className='my-5 img-fluid d-block mx-auto'
          />
          <h2>Your order has been placed successfully</h2>

          <Link to='/orders/me'>Go to Orders</Link>
        </div>
      </div>
    </>
  )
}
