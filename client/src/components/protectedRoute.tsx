import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '../store'

interface props {
  children?: React.ReactElement | null
}
export const ProtectedRoute: React.FC<props> = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state: RootState) => state.auth)

  if (loading) return null

  if (!isAuthenticated) {
    return <Navigate to='/login' replace></Navigate>
  }

  return children ? children : <Outlet />
}
