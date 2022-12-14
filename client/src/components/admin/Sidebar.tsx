import { Link } from 'react-router-dom'

export const Sidebar = () => {
  return (
    <div className='sidebar-wrapper'>
      <nav id='sidebar'>
        <ul className='list-unstyled components'>
          <li>
            <Link to='/dashboard'>
              <i className='fa fa-tachometer-alt'></i> Dashboard
            </Link>
          </li>
          <li>
            <a
              href='#collapseMenu'
              data-bs-toggle='collapse'
              aria-expanded='false'
              className='dropdown dropdown-toggle'
            >
              <i className='fa-brands fa-product-hunt'></i> Products
            </a>
            <div className='collapse' id='collapseMenu'>
              <ul className='list-unstyled'>
                <li>
                  <Link to='/admin/products'>
                    <i className='fa fa-clipboard'></i> All
                  </Link>
                </li>
                <li>
                  <Link to='/admin/products/new'>
                    <i className='fa fa-plus'></i> Create
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Link to='/admin/users'>
              <i className='fa fa-users'></i> Users
            </Link>
          </li>
          <li>
            <Link to='/admin/orders'>
              <i className='fa fa-shopping-basket'></i> Orders
            </Link>
          </li>
          <li>
            <Link to='/admin/reviews'>
              <i className='fa fa-star'></i> Reviews
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
