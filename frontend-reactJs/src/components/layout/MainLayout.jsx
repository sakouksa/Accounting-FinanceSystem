import { useEffect, useState } from 'react'
import { Layout } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

// Import ម៉ឺនុយដើមពី Sidebar
import Sidebar, { items_menu_left_tmp } from './Sidebar'
import Header from './Header'
import { profileStore } from '../../store/profileStore'
import { usePageLoading } from '../../hooks/usePageLoading.js'
import MainPage from './MainPage'

const { Content } = Layout

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [menuItems, setMenuItems] = useState([]) // បោះទៅឱ្យ Sidebar
  const navigate = useNavigate()
  const location = useLocation()
  
  // ទាញយក profile និង permissions ពី Zustand Store
  const { profile, permissions } = profileStore()
  
  // បង្កើត Variable ការពារករណី permissions មកជា undefined ឬ null
  const permission = permissions || []
  const pageLoading = usePageLoading([profile, permissions])

  const sidebarWidth = collapsed ? 70 : 240

  // ==========================================
  // មុខងារផ្ទៀងផ្ទាត់សិទ្ធិ (Core Logic Matching)
  // ==========================================
  const hasAccessToKey = (menuKey) => {
    if (menuKey === '/') return true // ទំព័រ Dashboard គឺអនុញ្ញាតជានិច្ច
    if (!permission || permission.length === 0) return false

    // ១. សម្អាត URL Key របស់ម៉ឺនុយ (ដក / ចេញ និងប្ដូរ - ទៅជា _)
    const cleanMenuKey = menuKey.replace(/^\//, '').replace(/-/g, '_').toLowerCase()

    return permission.some(p => {
      // ២. ស្វែងរក Property ណាដែលមានតម្លៃ
      const dbRoute = p.route_key || p.web_route_key || p.code || p.name || (typeof p === 'string' ? p : '')
      if (!dbRoute) return false
      
      // ៣. សម្អាតទម្រង់សិទ្ធិពី DB (ដកកន្ទុយ .index, .view ចេញ និងប្ដូរ - ឬ . ទៅជា _)
      const cleanRouteKey = dbRoute
        .toLowerCase()
        .replace(/\.(index|view|show|list)$/, '')
        .replace(/[-.]/g, '_')

      // ៤. ករណីពិសេស៖ ឈ្មោះកាត់ក្នុង DB ដូចជា 'coa' ស្មើនឹង 'chart_of_accounts'
      if ((cleanRouteKey === 'coa' || cleanRouteKey === 'accounting_core') && cleanMenuKey === 'chart_of_accounts') {
        return true
      }

      // ៥. ផ្ទៀងផ្ទាត់លក្ខខណ្ឌបើពាក្យទាំងពីរដូចគ្នា ឬពាក់ព័ន្ធគ្នា
      return cleanRouteKey === cleanMenuKey || cleanRouteKey.includes(cleanMenuKey) || cleanMenuKey.includes(cleanRouteKey)
    })
  }

  // ==========================================
  // PROTECT ROUTE (ការពារសុវត្ថិភាព URL)
  // ==========================================
  const protectRoute = () => {
    if (!permission || permission.length === 0) return
    if (
      location.pathname === '/' ||
      location.pathname === '/profiles' ||
      location.pathname === '/profile-settings'
    ) return

    const hasAccess = hasAccessToKey(location.pathname)

    if (!hasAccess) {
      const firstValid = permission.find(p => p.route_key || p.web_route_key || p.code || p.name)
      if (firstValid) {
        let route = (firstValid.route_key || firstValid.web_route_key || firstValid.code || firstValid.name)
          .replace('.index', '')
          .replace('_', '-')
        if (route === 'coa') route = 'chart-of-accounts'
        navigate(route.startsWith('/') ? route : '/' + route)
      } else {
        navigate('/')
      }
    }
  }

  // ==========================================
  // MENU RENDER (លាងសម្អាតរចនាសម្ព័ន្ធ ៣ កម្រិត)
  // ==========================================
  const renderMenuLeft = () => {
    if (!permission || permission.length === 0) {
      setMenuItems([]);
      return;
    }

    // ច្រោះ (Filter) ម៉ឺនុយដើមតាមកម្រិតនីមួយៗ
    const filteredMenu = items_menu_left_tmp.map(group => {
      if (!group.children) return null

      // កម្រិតទី ២ (Parent Item ដូចជា "accounting_core")
      const filteredChildren = group.children.map(item => {
        
        // កម្រិតទី ៣ (Sub-menu items ដូចជា "/chart-of-accounts")
        if (item.children) {
          const subChildren = item.children.filter(child => hasAccessToKey(child.key))
          
          // បើកូនៗថ្នាក់ទី ៣ មានសិទ្ធិ ទើបបង្ហាញម៉ឺនុយមេវា
          if (subChildren.length > 0) {
            return { ...item, children: subChildren }
          }
          return null
        }

        // ករណីម៉ឺនុយទោលគ្មានកូន (Dashboard "/")
        return hasAccessToKey(item.key) ? item : null
      }).filter(Boolean)

      // បើនៅក្នុង Group មានម៉ឺនុយសល់ ទើបបង្ហាញ Group
      if (filteredChildren.length > 0) {
        return { ...group, children: filteredChildren }
      }
      return null
    }).filter(Boolean)

    setMenuItems(filteredMenu)
  }

  // Responsive Screen (Mobile & Desktop)
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

  // ការពារ Race Condition
  useEffect(() => {
    if (!pageLoading && profile === null) {
      navigate('/login')
    }
  }, [profile, pageLoading])

  // ដំណើរការឡើងវិញរាល់ពេលប្តូរទំព័រ ឬទិន្នន័យសិទ្ធិប្រែប្រួល
  useEffect(() => {
    renderMenuLeft()
    protectRoute()
  }, [permissions, location.pathname]) 

  return (
    <MainPage loading={pageLoading}>
      <Layout className='min-h-screen'>
        {/* បោះផ្ញើបញ្ជីម៉ឺនុយដែលបានលាងសម្អាតរួចទៅឱ្យ Sidebar Component */}
        <Sidebar collapsed={collapsed} isDarkMode={isDarkMode} menuItems={menuItems} />

        <Layout className='transition-all duration-200' style={{ marginLeft: window.innerWidth < 992 ? 70 : sidebarWidth }}>
          <Header
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
          />

          <Content
            className={`p-6 transition-all duration-300 ${isDarkMode ? 'bg-[#0b0e14]' : 'bg-[#f8fafc]'}`}
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