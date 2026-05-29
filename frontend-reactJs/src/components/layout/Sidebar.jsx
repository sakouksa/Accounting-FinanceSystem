import React, { useState } from 'react'
import { Layout, Menu, Avatar, Tooltip } from 'antd'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import {
  DashboardOutlined,
  BankOutlined,
  TransactionOutlined,
  WalletOutlined,
  TeamOutlined,
  FileProtectOutlined,
  AuditOutlined,
  SettingOutlined,
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  LogoutOutlined,
  ContainerOutlined,
  HistoryOutlined,
  SolutionOutlined,
  SafetyCertificateOutlined,
  LoginOutlined,
  KeyOutlined,
  LockOutlined
} from '@ant-design/icons'
import { BsCalculator, BsJournalText } from 'react-icons/bs'
import { MdOutlineAccountBalance, MdOutlinePayments } from 'react-icons/md'
import '../../assets/css/Sidebar.css'
import { BiChevronDown } from 'react-icons/bi'
import { profileStore } from '../../store/profileStore'
import config from '../../util/config'
const { Sider } = Layout

const getItem = (label, key, icon, children, type) => ({
  key,
  icon,
  children,
  label,
  type
})

const items_menu_left_tmp = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: 'ផ្ទាំងគ្រប់គ្រង'
  },
  {
    key: 'accounting_core',
    icon: <BankOutlined />,
    label: 'គណនេយ្យស្នូល',
    children: [
      {
        key: '/chart-of-accounts',
        icon: <ContainerOutlined />,
        label: 'តារាងគណនី'
      },
      {
        key: '/account-types',
        icon: <BarChartOutlined />,
        label: 'ប្រភេទគណនី'
      },
      {
        key: '/general-ledger',
        icon: <BsJournalText />,
        label: 'សៀវភៅធំ'
      },
      {
        key: '/journal-entries',
        icon: <TransactionOutlined />,
        label: 'បញ្ជី Journal'
      }
    ]
  },
  {
    key: 'sales_receivable',
    icon: <WalletOutlined />,
    label: 'ការលក់ និង ប្រាក់ត្រូវទទួល',
    children: [
      {
        key: '/customers',
        icon: <TeamOutlined />,
        label: 'អតិថិជន'
      },
      {
        key: '/accounts-receivable',
        icon: <ArrowDownOutlined />,
        label: 'ប្រាក់ត្រូវទទួល'
      },
      {
        key: '/customer-payments',
        icon: <MdOutlinePayments />,
        label: 'ការទូទាត់ពីអតិថិជន'
      }
    ]
  },

  {
    key: 'purchase_payable',
    icon: <WalletOutlined />,
    label: 'ការទិញ និង ប្រាក់ត្រូវបង់',
    children: [
      {
        key: '/suppliers',
        icon: <TeamOutlined />,
        label: 'អ្នកផ្គត់ផ្គង់'
      },
      {
        key: '/accounts-payable',
        icon: <ArrowUpOutlined />,
        label: 'ប្រាក់ត្រូវបង់'
      },
      {
        key: '/supplier-payments',
        icon: <MdOutlinePayments />,
        label: 'ការទូទាត់ទៅអ្នកផ្គត់ផ្គង់'
      }
    ]
  },

  {
    key: 'finance_management',
    icon: <MdOutlineAccountBalance />,
    label: 'ការគ្រប់គ្រងហិរញ្ញវត្ថុ',
    children: [
      {
        key: '/cash-flows',
        icon: <TransactionOutlined />,
        label: 'លំហូរសាច់ប្រាក់'
      },
      {
        key: '/budgets',
        icon: <WalletOutlined />,
        label: 'ថវិកា'
      },
      {
        key: '/financial-reports',
        icon: <BarChartOutlined />,
        label: 'របាយការណ៍ហិរញ្ញវត្ថុ'
      },
      {
        key: '/report-exports',
        icon: <AuditOutlined />,
        label: 'នាំចេញរបាយការណ៍'
      }
    ]
  },

  {
    key: 'organization',
    icon: <BankOutlined />,
    label: 'អង្គភាព និង ប្រព័ន្ធ',
    children: [
      {
        key: '/branches',
        icon: <BankOutlined />,
        label: 'សាខា'
      },
      {
        key: '/currencies',
        icon: <BsCalculator />,
        label: 'រូបិយប័ណ្ណ'
      },
      {
        key: '/payment-methods',
        icon: <TransactionOutlined />,
        label: 'វិធីសាស្ត្រទូទាត់'
      }
    ]
  },

  {
    key: 'security_access',
    icon: <LockOutlined />,
    label: 'សុវត្ថិភាព និង សិទ្ធិប្រើប្រាស់',
    children: [
      {
        key: '/users',
        icon: <TeamOutlined />,
        label: 'អ្នកប្រើប្រាស់'
      },
      {
        key: '/roles',
        icon: <SafetyCertificateOutlined />,
        label: 'តួនាទី'
      },
      {
        key: '/permissions',
        icon: <KeyOutlined />,
        label: 'សិទ្ធិ'
      },
      {
        key: '/role-permissions',
        icon: <FileProtectOutlined />,
        label: 'សិទ្ធិតាមតួនាទី'
      }
    ]
  },

  {
    key: 'audit_activity',
    icon: <HistoryOutlined />,
    label: 'កំណត់ហេតុ និង សកម្មភាព',
    children: [
      {
        key: '/audit-logs',
        icon: <HistoryOutlined />,
        label: 'Audit Logs'
      },
      {
        key: '/login-histories',
        icon: <LoginOutlined />,
        label: 'ប្រវត្តិការចូលប្រើ'
      }
    ]
  },

  {
    type: 'divider'
  },

  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'ការកំណត់ប្រព័ន្ធ'
  }
]

const Sidebar = ({ collapsed, isDarkMode }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, logout } = profileStore()

  const [openKeys, setOpenKeys] = useState([])

  const onOpenChange = keys => setOpenKeys(keys)

  // ================= USER =================
  const user = profile || {}

  const avatarUrl = user?.profile_image
    ? config.image_path + user.profile_image
    : null

  const userInitial = user?.full_name?.charAt(0)?.toUpperCase() || 'U'

  const handleMenuClick = e => {
    if (!e?.key) return
    if (e.key.includes('group')) return
    if (e.key === 'divider') return
    if (e.key.startsWith('/')) navigate(e.key)
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      theme={isDarkMode ? 'dark' : 'light'}
      className={`fixed h-screen left-0 top-0 z-[1001] border-r transition-all duration-300 flex flex-col ${
        isDarkMode
          ? 'border-[#232e45] bg-[#0b0e14]'
          : 'border-[#f1f5f9] bg-[#ffffff]'
      }`}
    >
      <div className='flex flex-col h-full justify-between'>
        <div>
          {/* LOGO SECTION */}
          <div className='h-[70px] flex items-center px-6 gap-3 mb-2'>
            <div className='w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 flex-shrink-0'>
              <BankOutlined className='text-xl' />
            </div>
            {!collapsed && (
              <div className='flex flex-col overflow-hidden'>
                <span
                  className={`font-black text-lg leading-none tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  FINANCE<span className='text-emerald-500'>PRO</span>
                </span>
                <span className='text-[10px] uppercase tracking-[2px] font-bold text-slate-400 mt-1'>
                  System
                </span>
              </div>
            )}
          </div>
          <Menu
            mode='inline'
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            selectedKeys={[location?.pathname]}
            items={items_menu_left_tmp}
            onClick={handleMenuClick}
            className='border-none px-3 custom-sidebar overflow-y-auto overflow-x-hidden'
            style={{
              background: 'transparent',
              maxHeight: 'calc(100vh - 160px)'
            }}
          />
        </div>

        <div
          className={`p-4 border-t flex-shrink-0 ${
            isDarkMode ? 'border-[#232e45]' : 'border-[#f1f5f9]'
          }`}
        >
          {collapsed ? (
            <div className='flex justify-center'>
              <Tooltip title='មើលព័ត៌មានផ្ទាល់ខ្លួន' placement='right'>
                <Link to='/profiles'>
                  <Avatar
                    className='bg-indigo-600 border-2 border-indigo-100 hover:scale-110 transition-transform cursor-pointer'
                    size={36}
                  >
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                </Link>
              </Tooltip>
            </div>
          ) : (
            <div className='flex items-center gap-1'>
              <Link
                to='/profiles'
                className={`flex flex-1 items-center gap-3 p-2 rounded-xl transition-all overflow-hidden ${
                  isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                }`}
              >
                <Avatar
                  size={40}
                  src={avatarUrl}
                  style={{
                    border: '2px solid rgb(16,185,129)',
                    backgroundColor: !avatarUrl ? 'rgb(16,185,129)' : undefined
                  }}
                >
                  {!avatarUrl && userInitial}
                </Avatar>
                {!collapsed && (
                  <div className='flex-1 min-w-0'>
                    <div className='text-sm font-bold truncate'>
                      {user.full_name || 'User'}
                    </div>
                    <div className='text-xs font-semibold uppercase'>
                      {user.role?.name || 'Accountant'}
                    </div>
                  </div>
                )}
              </Link>
              <Tooltip title='ចាកចេញ'>
                <button
                  onClick={logout}
                  className='text-red-400 hover:text-red-600 p-0 flex items-center justify-center'
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <LogoutOutlined style={{ fontSize: 14 }} />
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </Sider>
  )
}

export default Sidebar
