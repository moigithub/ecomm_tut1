import { useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
import { MDBDataTable } from 'mdbreact'
import { Link } from 'react-router-dom'
import { RootState } from '../../store'
import { Loader } from '../layout/Loader'
import { MetaData } from '../layout/MetaData'
import { Sidebar } from './Sidebar'
import { User } from '../../reducers/userReducers'
import { clearStatus } from '../../slices/appStateSlice'
import { deleteAdminUser, setAdminUsers } from '../../slices/userSlice'
import { deleteUser, getUsers } from '../../services/userService'

export const AdminUserList = () => {
  const { loading, users, error } = useSelector((state: RootState) => state.user)
  const {
    loading: appLoading,
    message,
    error: errorMessage
  } = useSelector((state: RootState) => state.appState)

  const dispatch = useDispatch()
  const alert = useAlert()

  useEffect(() => {
    const loadAllUsers = async () => {
      dispatch(setAdminUsers(await getUsers()))
    }
    loadAllUsers()
  }, [dispatch, message])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearStatus())
    }
    if (message) {
      alert.success(message)
      dispatch(clearStatus())
    }
    if (errorMessage) {
      alert.error(errorMessage)
      dispatch(clearStatus())
    }
  }, [error, errorMessage, message])

  const handleDeleteUser = async (user: User) => {
    dispatch(deleteAdminUser(await deleteUser(user._id)))
  }

  if (loading || appLoading) {
    return <Loader />
  }

  const data = {
    columns: [
      {
        label: 'User ID',
        field: 'id',
        sort: 'asc'
      },
      {
        label: 'Name',
        field: 'name',
        sort: 'asc'
      },
      {
        label: 'Email',
        field: 'email',
        sort: 'asc'
      },
      {
        label: 'Role',
        field: 'role',
        sort: 'asc'
      },
      {
        label: 'Actions',
        field: 'actions',
        sort: 'asc'
      }
    ],
    rows: users.map(user => {
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        actions: (
          <>
            <Link to={`/admin/user/${user._id}`} className='btn btn-primary py-1 px-2'>
              <i className='fa fa-eye'></i>
            </Link>
            <button
              className='btn btn-danger py-1 px-2 ms-2'
              onClick={() => handleDeleteUser(user)}
            >
              <i className='fa fa-trash'></i>
            </button>
          </>
        )
      }
    })
  }

  return (
    <>
      <MetaData title='All users'></MetaData>
      <div className='row'>
        <div className='col-12 col-md-2'>
          <Sidebar></Sidebar>
        </div>
        <div className='col-12 col-md-10'>
          <h1 className='mt-5'>All Users</h1>

          <MDBDataTable data={data} className='px-3' bordered striped hover></MDBDataTable>
        </div>
      </div>
    </>
  )
}
