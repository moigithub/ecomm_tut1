import { Link } from 'react-router-dom'
import { Search } from './Search'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../actions/userActions'
import { RootState } from '../../store'

export const Header = () => {
  const { loading, user, isAuthenticated, error } = useSelector((state: RootState) => state.auth)
  const { cartItems } = useSelector((state: RootState) => state.cart)
  const navigate = useNavigate()
  const alert = useAlert()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    alert.info('Logout successful')
    navigate(`/`)
  }
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <nav className='navbar row'>
        <div className='col-12 col-md-3'>
          <div className='navbar-brand'>
            <Link to='/'>
              <img src='/images/shope_logo.png' alt='brand logo' />
            </Link>
          </div>
        </div>

        <div className='col-12 col-md-6 mt-2 mt-md-0'>
          <Search />
        </div>

        <div className='col-12 col-md-3 mt-4 mt-md-0 text-center'>
          <Link to='/cart' id='cart' className='ms-3'>
            Cart
          </Link>
          <span className='ms-1' id='cart_count'>
            {cartItemsCount}
          </span>

          {user ? (
            <div className='ms-4 dropdown d-inline'>
              <Link
                to='#'
                className='btn dropdown-toggle text-white mr-6'
                type='button'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                <figure className='avatar avatar-nav'>
                  <img
                    src={'http://localhost:4000/' + user.avatar?.url}
                    alt={user.name}
                    className='rounded-circle'
                  />
                </figure>
                <span>{user?.name || ''}</span>
              </Link>
              <div className='dropdown-menu'>
                {user?.role === 'admin' && (
                  <Link className='dropdown-item' to='/dashboard'>
                    Dashbboard
                  </Link>
                )}

                <Link className='dropdown-item' to='/orders/me'>
                  Orders
                </Link>
                <Link className='dropdown-item' to='/me'>
                  Profile
                </Link>

                <button className='dropdown-item text-danger' onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            !loading && (
              <Link to='/login' className='btn ms-4' id='login_btn'>
                Login
              </Link>
            )
          )}
        </div>
      </nav>
    </>
  )
}
