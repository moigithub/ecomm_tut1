import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '../store'

interface props {
  children?: React.ReactElement | null
  isAdmin?: boolean
}
export const ProtectedRoute: React.FC<props> = ({ isAdmin = false, children }) => {
  const { loading, isAuthenticated, user } = useSelector((state: RootState) => state.user)

  if (loading) return null

  if (!isAuthenticated) {
    return <Navigate to='/login' replace></Navigate>
  }

  if (isAdmin && user?.role !== 'admin') {
    return <Navigate to='/' replace></Navigate>
  }

  return children ? children : <Outlet />
}
