import React from 'react'
import { Layout, Button, Dropdown, Avatar, Divider } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  EditOutlined
} from '@ant-design/icons'

import { profileStore } from '../../store/profileStore'
import { useNavigate } from 'react-router-dom'
import config from '../../util/config'
import { useLogout } from '../../hooks/useLogout'

const { Header: AntHeader } = Layout

const Header = ({ collapsed, setCollapsed, isDarkMode }) => {
  const navigate = useNavigate()
  const { profile } = profileStore()
  const user = profile || {}
  const logout = useLogout()

  // មុខងារសម្រាប់ Dropdown Menu ដែលរចនាឡើងវិញ
  const dropdownContent = (
    <div
      className={`shadow-2xl rounded-2xl border min-w-[240px] overflow-hidden ${
        isDarkMode
          ? 'bg-[#161b26] border-[#232e45]'
          : 'bg-white border-slate-100'
      }`}
    >
      {/* User Info Header */}
      <div className={`p-4 ${isDarkMode ? 'bg-[#1c222e]' : 'bg-slate-50'}`}>
        <div
          className={`text-sm font-bold truncate ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}
        >
          {user.full_name || 'មិនមានឈ្មោះ'}
        </div>
        <div className='text-xs text-slate-400 truncate'>
          {user.email || '—'}
        </div>
      </div>

      <div className='p-2 flex flex-col gap-1'>
        <Button
          type='text'
          block
          icon={<UserOutlined />}
          onClick={() => navigate('/profiles')}
          className={`flex items-center h-10 hover:bg-indigo-50 hover:text-indigo-600 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <span className='ml-3 text-left flex-1 font-medium'>
            ព័ត៌មានផ្ទាល់ខ្លួន
          </span>
        </Button>

        <Button
          type='text'
          block
          icon={<EditOutlined />}
          onClick={() => navigate('/profile-settings')}
          className={`flex items-center h-10 hover:bg-indigo-50 hover:text-indigo-600 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <span className='ml-3 text-left flex-1 font-medium'>កែប្រែគណនី</span>
        </Button>
      </div>

      <Divider className='my-0' />

      <div className='p-2'>
        <Button
          danger
          block
          icon={<LogoutOutlined />}
          onClick={logout}
          className='h-10 font-semibold'
        >
          ចាកចេញ (Logout)
        </Button>
      </div>
    </div>
  )

  return (
    <AntHeader
      className={`sticky top-0 z-[1000] h-[64px] px-6 flex items-center justify-between border-b transition-all ${
        isDarkMode
          ? 'bg-[#0b0e14] border-[#232e45]'
          : 'bg-white border-[#f1f5f9]'
      }`}
    >
      <div className='flex items-center gap-4 flex-1'>
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className={isDarkMode ? 'text-white' : 'text-slate-600'}
        />
      </div>

      <div className='flex items-center gap-3'>
        <Dropdown
          dropdownRender={() => dropdownContent}
          placement='bottomRight'
          trigger={['click']}
        >
          <div className='flex items-center gap-3 cursor-pointer p-1 pr-3 hover:bg-slate-100 rounded-full transition-all'>
            <Avatar
              size={38}
              className='ring-2 ring-indigo-500 ring-offset-2'
              src={
                user?.profile_image
                  ? config.image_path + user.profile_image
                  : null
              }
            >
              {!user?.profile_image &&
                (user?.full_name
                  ? user.full_name.charAt(0).toUpperCase()
                  : 'U')}
            </Avatar>
            <span
              className={`font-semibold hidden md:block ${
                isDarkMode ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              {user.full_name ? user.full_name.split(' ')[0] : 'អ្នកប្រើប្រាស់'}
            </span>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  )
}

export default Header
