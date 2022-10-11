import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'
import { Sidebar } from './Sidebar'
import { clearStatus, setSuccess } from '../../slices/appStateSlice'
import { setAdminUserDetail, updateAdminUser } from '../../slices/userSlice'
import { getUserDetail, updateUser } from '../../services/userService'

export const UpdateUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { loading, selectedUser, error } = useSelector((state: RootState) => state.user)
  const { message } = useSelector((state: RootState) => state.appState)
  console.log('user', selectedUser)
  const [name, setName] = useState(selectedUser?.name || '')
  const [email, setEmail] = useState(selectedUser?.email || '')
  const [role, setRole] = useState(selectedUser?.role || 'user')

  const dispatch = useDispatch()
  const alert = useAlert()

  useEffect(() => {
    const getData = async () => {
      dispatch(setAdminUserDetail(await getUserDetail(id as string)))
    }
    getData()
  }, [dispatch, id])

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name)
      setEmail(selectedUser.email)
      setRole(selectedUser.role || 'user')
    }
  }, [selectedUser])

  useEffect(() => {
    if (message) {
      alert.success(message)
      dispatch(clearStatus())
      navigate(`/admin/users`)
    }
  }, [message])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearStatus())
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    dispatch(updateAdminUser(await updateUser(id as string, name, email, role)))
    dispatch(setSuccess('Updated user successfully'))
  }

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <MetaData title='Update Profile'></MetaData>
      <div className='row'>
        <div className='col-12 col-md-2'>
          <Sidebar />
        </div>
        <div className='col-12 col-md-10'>
          <div className='row wrapper'>
            <div className='col-10 col-lg-5'>
              <form className='shadow-lg d-flex flex-column' onSubmit={handleSubmit}>
                <h1 className='mt-2 mb-5'>Update User</h1>

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
                  <select
                    id='role_field'
                    className='form-control'
                    value={role}
                    onChange={handleRoleChange}
                  >
                    <option value='user'>User</option>
                    <option value='admin'>Admin</option>
                  </select>
                </div>

                <button className='btn btn-primary mt-4 mb-3' type='submit'>
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
