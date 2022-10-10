import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { MetaData } from '../layout/MetaData'
import type {} from 'redux-thunk/extend-redux'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { useNavigate } from 'react-router-dom'
import { CLEAR_STATUS } from '../../constants/user'
import { forgotPassword } from '../../slices/userSlice'
import axios from 'axios'
import { clearStatus } from '../../slices/appStateSlice'
// import { forgotPassword } from '../../actions/userActions'

export const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const { message } = useSelector((state: RootState) => state.appState)
  const dispatch = useDispatch()
  const alert = useAlert()

  useEffect(() => {
    if (message) {
      alert.success(message)
      dispatch(clearStatus())
      navigate('/me')
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const forgotPwd = async (email: string) => {
      let url = `http://localhost:4000/api/v1/forgotPassword`

      const { data } = await axios.post(
        url,
        { email },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      )
      dispatch(forgotPassword(data))
    }
    forgotPwd(email)
  }

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  return (
    <>
      <MetaData title='Forgot password'></MetaData>
      <div className='row wrapper'>
        <div className='col-10 col-lg-5'>
          <form className='shadow-lg d-flex flex-column' onSubmit={handleSubmit}>
            <h1 className='mb-3'>Forgot password</h1>

            <div className='form-group'>
              <label htmlFor='email_field'>Email</label>
              <input
                type='email'
                id='email_field'
                className='form-control'
                value={email}
                onChange={handleEmail}
              />
            </div>

            <button id='forgot_password_button' className='btn w-100 py-3' type='submit'>
              Send Email
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
