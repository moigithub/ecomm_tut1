import { Outlet } from 'react-router-dom'

export const Container = () => {
  return (
    <div className='container'>
      <Outlet></Outlet>
    </div>
  )
}
