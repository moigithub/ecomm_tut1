import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom'

import { clearStatus, setSuccess } from '../../slices/appStateSlice'
import { updatePwd } from '../../services/userService'
import { updatePassword } from '../../slices/userSlice'
import { RootState } from '../../store'
import { MetaData } from '../layout/MetaData'

export const NewPassword = () => {
  const navigate = useNavigate()
  const [confirmPassword, setConfirmPassword] = useState('')
  const [password, setPassword] = useState('')

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(updatePassword(await updatePwd(confirmPassword, password)))
    dispatch(setSuccess('Password updated successfully'))
  }

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  return (
    <>
      <MetaData title='New password reset'></MetaData>
      <div className='row wrapper'>
        <div className='col-10 col-lg-5'>
          <form className='shadow-lg d-flex flex-column' onSubmit={handleSubmit}>
            <h1 className='mb-3'>New password</h1>

            <div className='form-group'>
              <label htmlFor='old_password_field'>Password</label>
              <input
                type='password'
                id='password_field'
                className='form-control'
                value={password}
                onChange={handlePassword}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='confirm_password_field'>Confirm Password</label>
              <input
                type='password'
                id='confirm_password_field'
                className='form-control'
                value={confirmPassword}
                onChange={handleConfirmPassword}
              />
            </div>

            <button id='new_password_button' className='btn w-100 py-3' type='submit'>
              Set password
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
