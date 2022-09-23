import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import type {} from 'redux-thunk/extend-redux'
import { Link, useParams } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { clearError } from '../../actions/productActions'
import { login } from '../../actions/userActions'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'

export const Login = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loading, user, isAuthenticated, error } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const alert = useAlert()

  const searchParams = queryString.parse(search)
  const redirect = (searchParams.redirect as string) || '/'

  useEffect(() => {
    if (isAuthenticated) {
      const prefix = redirect.startsWith('/') ? '' : '/'
      navigate(prefix + redirect, { replace: true })
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearError())
    }
  }, [error])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <MetaData title='Login'></MetaData>
      <div className='row wrapper'>
        <div className='col-10 col-lg-5'>
          <form className='shadow-lg d-flex flex-column' onSubmit={handleSubmit}>
            <h1 className='mb-3'>Login</h1>
            <div className='form-group'>
              <label htmlFor='email_field'>Email</label>
              <input
                type='text'
                id='email_field'
                className='form-control'
                value={email}
                onChange={handleEmail}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password_field'>Password</label>
              <input
                type='password'
                id='password_field'
                className='form-control'
                value={password}
                onChange={handlePassword}
              />
            </div>

            <Link to='/password/forgot' className='text-end mb-4'>
              Forgor Password?
            </Link>

            <button id='login_button' className='btn w-100 py-3' type='submit'>
              Login
            </button>
            <Link to='/register' className='text-end mt-3'>
              New User
            </Link>
          </form>
        </div>
      </div>
    </>
  )
}
