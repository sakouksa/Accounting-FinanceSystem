import React from 'react'
import { Layout, Input, Button, Dropdown, Avatar, Badge, Divider } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  MoonOutlined,
  SunOutlined,
  PlusOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined
} from '@ant-design/icons'

import { profileStore } from '../../store/profileStore'
import { useNavigate } from 'react-router-dom'
import config from '../../util/config'

const { Header: AntHeader } = Layout

const Header = ({ collapsed, setCollapsed, isDarkMode, toggleTheme }) => {
  const navigate = useNavigate()

  const { profile, logout } = profileStore()

  const user = profile || {}

  const handleLogout = () => {
    logout()
    sessionStorage.clear()
    navigate('/login')
  }

  const dropdownContent = (
    <div
      className={`shadow-xl rounded-xl border min-w-[220px] ${
        isDarkMode
          ? 'bg-[#161b26] border-[#232e45]'
          : 'bg-white border-[#f1f5f9]'
      }`}
    >
      {/* USER INFO */}
      <div className='p-4'>
        <div
          className={`text-sm font-bold ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}
        >
          {user.full_name || 'No Name'}
        </div>
        <div className='text-xs text-slate-400'>{user.email || '-'}</div>
      </div>

      <Divider className='my-0 opacity-50' />

      {/* MENU */}
      <div className='p-2 flex flex-col gap-1'>
        <Button
          type='text'
          block
          icon={<SettingOutlined />}
          className={`flex items-center h-10 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <span className='ml-2 text-left flex-1'>Settings</span>
        </Button>

        <Button
          type='text'
          block
          icon={<BellOutlined />}
          className={`flex items-center h-10 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <span className='ml-2 text-left flex-1'>Notifications</span>

          <Badge count={4} size='small' className='ml-auto' />
        </Button>
      </div>

      <Divider className='my-0 opacity-50' />

      {/* LOGOUT */}
      <div className='p-2'>
        <Button
          danger
          block
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className='flex items-center h-10'
        >
          <span className='ml-2 text-left flex-1 font-medium'>Log out</span>
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
        <div className='hidden md:block max-w-[320px] w-full'>
          <Input
            placeholder='Search anything...'
            prefix={<SearchOutlined className='text-slate-400' />}
            suffix={
              <span className='text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 border border-slate-200'>
                ⌘K
              </span>
            }
            className={`h-9 rounded-xl border-none ${
              isDarkMode ? 'bg-[#161b26] text-white' : 'bg-[#f8fafc]'
            }`}
          />
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-1 mx-2'>
          {/* <Button
            type='text'
            icon={
              isDarkMode ? (
                <SunOutlined className='text-yellow-400' />
              ) : (
                <MoonOutlined />
              )
            }
            onClick={toggleTheme}
            className='text-slate-500'
          /> */}
          <Badge count={4} size='small' offset={[-2, 4]} color='#ef4444'>
            <Button
              type='text'
              icon={<BellOutlined className='text-slate-500 text-lg' />}
            />
          </Badge>
        </div>

        {/* User Profile Dropdown */}
        <Dropdown
          dropdownRender={() => dropdownContent}
          placement='bottomRight'
          trigger={['click']}
          arrow
        >
          <div className='flex items-center gap-3 cursor-pointer p-1 hover:bg-slate-50 rounded-lg transition-all'>
            <Avatar
              size={36}
              className = "ring-2 ring-[rgb(16,185,129)] ring-offset-2 ring-offset-white"
              src={
                user?.profile_image
                  ? config.image_path + user.profile_image
                  : null
              }
            >
              {!user?.profile_image &&
                (user?.full_name ? user.full_name.charAt(0) : 'U')}
            </Avatar>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  )
}

export default Header
