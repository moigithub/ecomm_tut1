import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'

import type {} from 'redux-thunk/extend-redux'

import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
// import { clearError } from '../../actions/productActions'
// import { updateUser } from '../../actions/userActions'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'
import { clearStatus, setError, setSuccess } from '../../slices/appStateSlice'
import { updateAdminUser } from '../../slices/userSlice'
import axios from 'axios'

export const UpdateProfile = () => {
  const navigate = useNavigate()
  const { loading, user, isAuthenticated, error } = useSelector((state: RootState) => state.user)
  const { message } = useSelector((state: RootState) => state.appState)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [role, setRole] = useState(user?.role ?? 'user')
  const [avatarPreview, setAvatarPreview] = useState<string | ArrayBuffer | null>(
    'http://localhost:4000/' + user?.avatar?.url || null
  )
  const [avatar, setAvatar] = useState<File | null>(null)

  const dispatch = useDispatch()
  const alert = useAlert()

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate(`/`)
  //   }
  // }, [isAuthenticated])

  useEffect(() => {
    if (message) {
      alert.success(message)
      dispatch(clearStatus())
      navigate(`/me`)
    }
  }, [message])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearStatus())
    }
  }, [error])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const updateUser = async (id: string, name: string, email: string, role: string) => {
      let url = `http://localhost:4000/api/v1/admin/user/${id}`

      const formData = new FormData()
      formData.set('name', name)
      formData.set('email', email)
      formData.set('role', role)

      if (avatar) {
        formData.set('avatar', avatar)
      }

      try {
        const { data } = await axios.put(url, formData, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })

        dispatch(updateAdminUser(data.user))
        dispatch(setSuccess('Update successfully'))
      } catch (error: any) {
        dispatch(setError(error.response.data.message))
      }
    }
    updateUser(user?._id as string, name, email, role)
  }

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const handleRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value)
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
      <MetaData title='Update Profile'></MetaData>
      <div className='row wrapper'>
        <div className='col-10 col-lg-5'>
          <form className='shadow-lg d-flex flex-column' onSubmit={handleSubmit}>
            <h1 className='mb-3'>Update Profile</h1>
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
                type='email'
                id='email_field'
                className='form-control'
                value={email}
                onChange={handleEmail}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='role_field'>Role</label>
              <input
                type='text'
                id='role_field'
                className='form-control'
                value={role}
                onChange={handleRole}
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

            <button className='btn w-100 mt-4 mb-3' type='submit'>
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
