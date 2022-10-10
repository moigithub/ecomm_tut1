import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import type {} from 'redux-thunk/extend-redux'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
// import { updatePassword } from '../../actions/userActions'
// import { CLEAR_STATUS } from '../../constants/user'
import { RootState } from '../../store'
import { MetaData } from '../layout/MetaData'
import { updatePassword } from '../../slices/userSlice'
import axios from 'axios'
import { clearStatus, setError, setSuccess } from '../../slices/appStateSlice'

export const UpdatePassword = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')

  const { message, error } = useSelector((state: RootState) => state.appState)
  const dispatch = useDispatch()
  const alert = useAlert()

  useEffect(() => {
    if (message) {
      alert.success(message)
      dispatch(clearStatus())
      navigate('/me')
    }

    if (error) {
      alert.error(error)
      dispatch(clearStatus())
    }
  }, [message, error])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const setPassword = async (oldPassword: string, password: string) => {
      let url = `http://localhost:4000/api/v1/password/update`

      try {
        const { data } = await axios.post(
          url,
          { oldPassword, password },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        )

        dispatch(updatePassword(data))
        dispatch(setSuccess('Password updated successfully'))
      } catch (error: any) {
        console.error('error', error.response.data.message)
        dispatch(setError(error.response.data.message))
      }
    }
    setPassword(oldPassword, password)
  }

  const handleOldPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value)
  }
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  return (
    <>
      <MetaData title='Change password'></MetaData>
      <div className='row wrapper'>
        <div className='col-10 col-lg-5'>
          <form className='shadow-lg d-flex flex-column' onSubmit={handleSubmit}>
            <h1 className='mb-3'>Update password</h1>

            <div className='form-group'>
              <label htmlFor='old_password_field'>Old Password</label>
              <input
                type='password'
                id='old_password_field'
                className='form-control'
                value={oldPassword}
                onChange={handleOldPassword}
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

            <button id='register_button' className='btn update-btn w-100 mt-4' type='submit'>
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
