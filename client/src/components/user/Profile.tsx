import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import type {} from 'redux-thunk/extend-redux'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { clearError } from '../../actions/productActions'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'
import { clearStatus } from '../../slices/appStateSlice'

export const Profile = () => {
  const navigate = useNavigate()
  const { loading, user, isAuthenticated, error } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const alert = useAlert()

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate(`/`)
  //   }
  // }, [isAuthenticated])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearStatus())
    }
  }, [error])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <MetaData title='Profile'></MetaData>
      <h2 className='mt-5 ms-5'>My Profile</h2>
      <div className='row justify-content-around mt5 user-info'>
        <div className='col-12 col-md-3'>
          <figure className='avatar avatar-profile'>
            <img
              src={'http://localhost:4000/' + user?.avatar?.url}
              alt='avatar profile'
              className='rounded-circle img-fluid'
            />
          </figure>
          <Link to='/me/edit' id='edit_profile' className='btn btn-primary w-100 my-5'>
            Edit Profile
          </Link>
        </div>
        <div className='col-12 col-md-5'>
          <h4>Full name</h4>
          <p>{user?.name}</p>
          <h4>Email</h4>
          <p>{user?.email}</p>
          <h4>Joined on</h4>
          <p>{String(user?.createdAt).slice(0, 10)}</p>

          <Link to='/orders/me' className='btn btn-danger w-100 mt-5'>
            My orders
          </Link>
          <Link to='/password/update' className='btn btn-primary w-100 mt-5'>
            Change password
          </Link>
        </div>
      </div>
    </>
  )
}
