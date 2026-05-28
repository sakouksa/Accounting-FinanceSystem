import { useEffect, useState } from 'react'
import { Layout } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

import Sidebar from './Sidebar'
import Header from './Header'
import { profileStore } from '../../store/profileStore'

const { Content } = Layout

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [menuItems, setMenuItems] = useState([])
  const navigate = useNavigate()
  const location = useLocation()

  const { profile, permission } = profileStore()

  const sidebarWidth = collapsed ? 60 : 220

  // =========================
  // PROTECT ROUTE
  // =========================
  const protectRoute = () => {
    if (!permission?.length) return
    if (location.pathname === '/profile') return

    const hasAccess = permission.some(p => {
      const route = p.web_route_key
      return (
        route &&
        ('/' + route === location.pathname ||
          route === location.pathname)
      )
    })

    if (!hasAccess) {
      const firstValid = permission.find(
        p =>
          p.web_route_key &&
          typeof p.web_route_key === 'string' &&
          !p.web_route_key.startsWith('http')
      )

      if (firstValid) {
        const route = firstValid.web_route_key.startsWith('/')
          ? firstValid.web_route_key
          : '/' + firstValid.web_route_key

        navigate(route)
      }
    }
  }

  // MENU RENDER
  const items_menu_left_tmp = []

  const renderMenuLeft = () => {
    if (!permission?.length) return

    const menu = items_menu_left_tmp
      .map(item => {
        const parentAllowed = permission.some(
          p =>
            '/' + p.web_route_key === item.key ||
            p.web_route_key === item.key
        )

        if (item.children) {
          const children = item.children.filter(child =>
            permission.some(
              p =>
                '/' + p.web_route_key === child.key ||
                p.web_route_key === child.key
            )
          )

          if (children.length > 0) {
            return { ...item, children }
          }
        }

        return parentAllowed ? item : null
      })
      .filter(Boolean)

    setItems(menu)
  }
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setCollapsed(true)
      } else {
        setCollapsed(false)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])
  // EFFECTS
  useEffect(() => {
    if (profile === null) {
      navigate('/login')
    }
  }, [profile])

  useEffect(() => {
    if (permission?.length) {
      renderMenuLeft()
      protectRoute()
    }
  }, [permission, location.pathname])

  return (
    <Layout className='min-h-screen'>
      <Sidebar collapsed={collapsed} isDarkMode={isDarkMode} />

      <Layout
        className='transition-all duration-200'
        style = {
          {
            marginLeft: sidebarWidth
          }
        }
      >
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isDarkMode={isDarkMode}
          toggleTheme={() => setIsDarkMode(!isDarkMode)}
        />

        <Content
          className={`p-6 transition-all duration-300 ${
            isDarkMode ? 'bg-[#0b0e14]' : 'bg-[#f8fafc]'
          }`}
          style={{ minHeight: 'calc(100vh - 70px)', overflowY: 'auto' }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout