import { Link } from 'react-router-dom'

export const CheckoutSteps = ({ step = 1 }) => {
  return (
    <div className='checkout-progress d-flex justify-content-center mt-5'>
      {step >= 1 ? (
        <Link to='/shipping' className='float-right'>
          <div className='triangle2-active'></div>
          <div className='step active-step'>Shipping</div>
          <div className='triangle-active'></div>
        </Link>
      ) : (
        <span>
          <div className='triangle2-incomplete'></div>
          <div className='step incomplete'>Shipping</div>
          <div className='triangle-incomplete'></div>
        </span>
      )}

      {step >= 2 ? (
        <Link to='/order/confirm' className='float-right'>
          <div className='triangle2-active'></div>
          <div className='step active-step'>Confim order</div>
          <div className='triangle-active'></div>
        </Link>
      ) : (
        <span>
          <div className='triangle2-incomplete'></div>
          <div className='step incomplete'>Confim order</div>
          <div className='triangle-incomplete'></div>
        </span>
      )}

      {step >= 3 ? (
        <Link to='/payment' className='float-right'>
          <div className='triangle2-active'></div>
          <div className='step active-step'>Payment</div>
          <div className='triangle-active'></div>
        </Link>
      ) : (
        <span>
          <div className='triangle2-incomplete'></div>
          <div className='step incomplete'>Payment</div>
          <div className='triangle-incomplete'></div>
        </span>
      )}
    </div>
  )
}
