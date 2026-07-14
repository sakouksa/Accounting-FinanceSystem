import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Layout } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

import Sidebar, { items_menu_left_tmp } from './Sidebar'
import Header from './Header'
import { profileStore } from '../../store/profileStore'
import { usePageLoading } from '../../hooks/usePageLoading.js'
import MainPage from './MainPage'

const { Content } = Layout

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const { profile, permissions } = profileStore()
  const permission = Array.isArray(permissions) ? permissions : []
  const pageLoading = usePageLoading([profile, permissions])

  const sidebarWidth = collapsed ? 70 : 240

  const hasAccessToKey = useCallback((itemOrKey) => {
    const isString = typeof itemOrKey === 'string'
    const menuKey = isString ? itemOrKey : itemOrKey?.key
    const itemPermission = isString ? null : itemOrKey?.permission

    // អនុញ្ញាត Profile Pages
    if (menuKey === '/' || 
        menuKey === '/profiles' || 
        menuKey === '/profile-settings') return true

    if (!permission || permission.length === 0) return false

    // 1. If the item defines an explicit permission check, evaluate it directly against DB codes
    if (itemPermission) {
      let cleanRequired = itemPermission.replace(/\./g, '_').toLowerCase()
      cleanRequired = cleanRequired.replace('_read', '_view')
      cleanRequired = cleanRequired.replace('_edit', '_update')

      return permission.some(p => {
        const dbCode = (p.code || '').toLowerCase()
        return dbCode === cleanRequired || dbCode === itemPermission.toLowerCase()
      })
    }

    // 2. Fall back to key matching
    const cleanMenuKey = menuKey
      .replace(/^\//, '')
      .replace(/-/g, '_')
      .toLowerCase()

    return permission.some(p => {
      const dbRoute = p.route_key || p.web_route_key || p.code || p.name || 
                     (typeof p === 'string' ? p : '')
      if (!dbRoute) return false

      const cleanRouteKey = dbRoute
        .toLowerCase()
        .replace(/\.(index|view|show|list)$/, '')
        .replace(/[-.]/g, '_')

      // Special case
      if ((cleanRouteKey === 'coa' || cleanRouteKey === 'accounting_core') && 
          cleanMenuKey === 'chart_of_accounts') {
        return true
      }

      return (
        cleanRouteKey === cleanMenuKey ||
        cleanRouteKey.includes(cleanMenuKey) ||
        cleanMenuKey.includes(cleanRouteKey)
      )
    })
  }, [permission])

  const menuItems = useMemo(() => {
    if (!profile) return []

    // Special handling for Profile pages
    const isProfilePage = location.pathname === '/profiles' || 
                          location.pathname === '/profile-settings'

    let filteredMenu = items_menu_left_tmp
      .map(group => {
        if (!group.children) return null

        const filteredChildren = group.children
          .map(item => {
            if (item.children) {
              const subChildren = item.children.filter(child => 
                hasAccessToKey(child)
              )
              return subChildren.length > 0 ? { ...item, children: subChildren } : null
            }
            return hasAccessToKey(item) ? item : null
          })
          .filter(Boolean)

        return filteredChildren.length > 0 ? { ...group, children: filteredChildren } : null
      })
      .filter(Boolean)

    if (isProfilePage && filteredMenu.length === 0) {
      filteredMenu = items_menu_left_tmp
    }

    return filteredMenu;
  }, [profile, location.pathname, hasAccessToKey])

  // Debug
  useEffect(() => {
    console.log('=== MainLayout Debug ===')
    console.log('Path:', location.pathname)
    console.log('Permissions count:', permission.length)
    console.log('Menu Items count:', menuItems.length)
  }, [location.pathname, permission.length, menuItems.length])

  // Responsive
  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 992)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Redirect if not logged in
  useEffect(() => {
    if (!pageLoading && profile === null) {
      navigate('/login')
    }
  }, [profile, pageLoading, navigate])

  return (
    <MainPage loading={pageLoading}>
      <Layout className='min-h-screen'>
        <Sidebar
          collapsed={collapsed}
          isDarkMode={isDarkMode}
          menuItems={menuItems}
        />

        <Layout
          className='transition-all duration-200'
          style={{ marginLeft: window.innerWidth < 992 ? 70 : sidebarWidth }}
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
    </MainPage>
  )
}

export default MainLayout
