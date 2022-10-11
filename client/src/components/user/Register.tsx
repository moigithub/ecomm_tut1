import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'
import { clearStatus } from '../../slices/appStateSlice'
import { registerUser } from '../../slices/userSlice'
import { register } from '../../services/userService'

export const Register = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | ArrayBuffer | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)

  const { loading, isAuthenticated, error } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const alert = useAlert()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/`)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearStatus())
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    dispatch(registerUser(await register(name, email, password, avatar as File)))
  }

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0]
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result)
      }
    }

    if (file) {
      reader.readAsDataURL(file)
      setAvatar(file)
    }
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
            <h1 className='mb-3'>Register</h1>
            <div className='form-group'>
              <label htmlFor='name_field'>Name</label>
              <input
                type='text'
                id='name_field'
                className='form-control'
                value={name}
                onChange={handleName}
              />
            </div>

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

            <div className='form-group'>
              <label>Avatar</label>
              <div className='d-flex align-items-center'>
                <div>
                  <figure className='avatar mr-3 item-rtl'>
                    <img src={avatarPreview} alt='avatar' className='rounded-circle' />
                  </figure>
                </div>

                <input
                  type='file'
                  id='customFile'
                  className='custom-file-input'
                  accept='images/*'
                  onChange={handleAvatar}
                />
                <label htmlFor='customFile' className='custom-file-label'>
                  Choose Avatar
                </label>
              </div>
            </div>

            <Link to='/password/forgot' className='text-end mb-4'>
              Forgor Password?
            </Link>

            <button id='register_button' className='btn w-100 py-3' type='submit'>
              Register
            </button>

            <Link to='/login' className='text-end mt-3'>
              Login
            </Link>
          </form>
        </div>
      </div>
    </>
  )
}
