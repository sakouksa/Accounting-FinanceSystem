import { Outlet } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'

/**
 * ProtectedRoutes Component
 *
 * ប្រើសម្រាប់ routes ទាំងឡាយដែលត្រូវការ MainLayout
 * (ឧ. Sidebar, Header, Footer...)
 */
const ProtectedRoutes = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

export default ProtectedRoutes
