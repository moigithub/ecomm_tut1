import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import type {} from 'redux-thunk/extend-redux'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
// import { clearError } from '../../actions/productActions'
// import { registerUser } from '../../actions/userActions'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'
import { clearStatus } from '../../slices/appStateSlice'
import axios from 'axios'
import { registerUser } from '../../slices/userSlice'

export const Register = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | ArrayBuffer | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)

  const { loading, user, isAuthenticated, error } = useSelector((state: RootState) => state.user)
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const register = async (name: string, email: string, password: string, avatar: File) => {
      let url = `http://localhost:4000/api/v1/register`

      const formData = new FormData()
      formData.set('name', name)
      formData.set('email', email)
      formData.set('password', password)
      formData.set('avatar', avatar)
      const { data } = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      })
      dispatch(registerUser(data.user))
    }
    register(name, email, password, avatar as File)
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
