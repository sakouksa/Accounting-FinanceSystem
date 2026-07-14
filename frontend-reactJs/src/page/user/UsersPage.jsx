import React, { useEffect, useState } from 'react'
import {
  Button, Form, message, Modal, Table, Tag, Typography,
  Pagination, Space, Avatar, Tooltip
} from 'antd'
import {
  PlusOutlined, UserOutlined, MailOutlined, PhoneOutlined,
  ExclamationCircleFilled, UndoOutlined, KeyOutlined, DeleteOutlined
} from '@ant-design/icons'
import { CiEdit } from 'react-icons/ci'
import { MdDeleteForever } from 'react-icons/md'

import { request } from '../../util/request'
import config from '../../util/config'
import { dateClient } from '../../util/helper'
import MainPage from '../../components/layout/MainPage'
import { usePaginationStore } from '../../store/usePaginationStore'

import UserStatsCard from './components/UserStatsCard'
import UserFilter from './components/UserFilter'
import UserDrawer from './components/UserDrawer'
import PasswordDrawer from './components/PasswordDrawer'

const { Text } = Typography

function UsersPage () {
  const [userForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [validate, setValidate] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, deleted: 0 })

  const [state, setState] = useState({
    list: [],
    loading: false,
    drawerOpen: false,
    passwordDrawerOpen: false,
    selectedUserId: null,
    branches: [],
    defaultRoles: [],
    permissionsList: {},
    roleType: 'default',
    customPermissions: [],
    customSelectedModules: {}
  })

  const { pagination, setPagination, resetPagination } = usePaginationStore()

  useEffect(() => {
    loadMetaData()
    getList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Build blank permission list from raw permissions object
  const getInitialPermissions = (rawPermissions) =>
    Object.keys(rawPermissions).map(key => ({
      key,
      name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      actions: { create: false, read: false, update: false, delete: false }
    }))

  const loadMetaData = async () => {
    try {
      const [rolesRes, branchesRes, permissionsRes] = await Promise.all([
        request('default-roles', 'GET'),
        request('branches-list', 'GET'),
        request('users/all-permissions', 'GET')
      ])
      const roles = rolesRes?.roles || []
      const branchesData = Array.isArray(branchesRes) ? branchesRes : branchesRes?.data || []
      const rawPermissions = permissionsRes?.permissions || {}
      setState(pre => ({
        ...pre,
        defaultRoles: roles,
        branches: branchesData,
        permissionsList: rawPermissions,
        customPermissions: getInitialPermissions(rawPermissions)
      }))
    } catch (err) {
      console.error('loadMetaData error:', err)
    }
  }

  const getList = async (currentFilter = pagination) => {
    setState(pre => ({ ...pre, loading: true }))
    let q = `?page=${currentFilter.page}&limit=${currentFilter.limit}`
    if (currentFilter.txt_search) q += '&txt_search=' + encodeURIComponent(currentFilter.txt_search)
    if (currentFilter.status)    q += '&status=' + currentFilter.status
    if (currentFilter.role_id)   q += '&role_id=' + currentFilter.role_id
    if (currentFilter.branch_id) q += '&branch_id=' + currentFilter.branch_id

    const res = await request('users' + q, 'get')
    if (res && !res.errors) {
      const listData = res.list || []
      setState(pre => ({ ...pre, list: listData, loading: false }))
      setPagination({ total: res.total || listData.length || 0 })
      setStats({
        total: res.total || listData.length,
        active:   listData.filter(u => u.status === 'active'   && !u.deleted_at).length,
        inactive: listData.filter(u => u.status === 'inactive' && !u.deleted_at).length,
        deleted:  listData.filter(u => u.deleted_at).length
      })
    } else {
      setState(pre => ({ ...pre, loading: false }))
      message.error(res?.message || 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យ!')
    }
  }

  const handleFilter = () => {
    setPagination({ page: 1 })
    getList({ ...pagination, page: 1 })
  }

  const handleReset = () => {
    resetPagination()
    getList({ page: 1, limit: 10, txt_search: '', status: null, role_id: null, branch_id: null })
  }

  const handleOpenDrawer = (user = null) => {
    setValidate({})
    if (user) {
      userForm.setFieldsValue({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        username: user.username,
        branch_id: user.branch_id,
        role_id: user.role_id,
        status: user.status
      })
      setState(pre => {
        const roleType = user.role_id ? 'default' : 'custom'
        let customPermissions = getInitialPermissions(pre.permissionsList)
        const customSelectedModules = {}

        // Load existing custom permissions when editing
        if (!user.role_id && Array.isArray(user.permissions)) {
          customPermissions = Object.keys(pre.permissionsList).map(key => {
            const acts = { create: false, read: false, update: false, delete: false }
            user.permissions.forEach(p => {
              if (p.module === key) {
                if (p.action === 'create') acts.create = true
                if (p.action === 'view' || p.action === 'read') acts.read = true
                if (p.action === 'update') acts.update = true
                if (p.action === 'delete') acts.delete = true
              }
            })
            return { key, name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), actions: acts }
          })
          customPermissions.forEach(f => {
            customSelectedModules[f.key] = Object.values(f.actions).some(v => v)
          })
        }

        return {
          ...pre,
          drawerOpen: true,
          selectedUserId: user.id,
          roleType,
          customPermissions,
          customSelectedModules
        }
      })
    } else {
      // Create new user — reset everything
      userForm.resetFields()
      userForm.setFieldsValue({ status: 'active', gender: 'male' })
      setState(pre => ({
        ...pre,
        drawerOpen: true,
        selectedUserId: null,
        roleType: 'default',
        customPermissions: getInitialPermissions(pre.permissionsList),
        customSelectedModules: {}
      }))
    }
  }

  const handleCloseDrawer = () => {
    setState(pre => ({ ...pre, drawerOpen: false }))
    userForm.resetFields()
  }

  const onFinishUser = async values => {
    setSubmitLoading(true)
    const url = state.selectedUserId ? `users/${state.selectedUserId}` : 'users'
    const method = state.selectedUserId ? 'put' : 'post'

    const payload = {
      ...values,
      role_type: state.roleType,
      ...(state.roleType === 'default'
        ? { role_id: values.role_id, permissions: [] }
        : {
            role_id: null,
            // Only send modules that have at least one action selected
            permissions: state.customPermissions
              .filter(m => state.customSelectedModules[m.key])
              .map(m => {
                const actions = []
                if (m.actions.create) actions.push('create')
                if (m.actions.read)   actions.push('read')
                if (m.actions.update) actions.push('update')
                if (m.actions.delete) actions.push('delete')
                return { module: m.key, actions }
              })
          })
    }

    const res = await request(url, method, payload)
    setSubmitLoading(false)
    if (res && !res.errors) {
      message.success(state.selectedUserId ? 'កែប្រែអ្នកប្រើប្រាស់ជោគជ័យ!' : 'បង្កើតអ្នកប្រើប្រាស់ជោគជ័យ!')
      handleCloseDrawer()
      getList()
    } else {
      setValidate(res?.errors || {})
      message.error(res?.message || 'ប្រតិបត្តិការបរាជ័យ!')
    }
  }

  const handleDelete = id => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុបបណ្តោះអាសន្ន',
      icon: <ExclamationCircleFilled style={{ color: '#faad14' }} />,
      content: 'តើអ្នកពិតជាចង់លុបអ្នកប្រើប្រាស់នេះជាបណ្តោះអាសន្នមែនដែរឬទេ?',
      okText: 'លុប', okType: 'danger', cancelText: 'បោះបង់', centered: true,
      onOk: async () => {
        const res = await request(`users/${id}`, 'delete')
        if (res && !res.errors) { message.success('លុបបណ្តោះអាសន្នបានជោគជ័យ!'); getList() }
        else message.error(res?.message || 'មានបញ្ហាក្នុងការលុប!')
      }
    })
  }

  const handleRestore = async id => {
    const res = await request(`users/${id}/restore`, 'post')
    if (res && !res.errors) { message.success('ស្តារអ្នកប្រើប្រាស់ឡើងវិញបានជោគជ័យ!'); getList() }
    else message.error(res?.message || 'មានបញ្ហាក្នុងការស្តារ!')
  }

  const handleForceDelete = id => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុបជាអចិន្ត្រៃយ៍',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: 'ការលុបនេះមិនអាចស្តារឡើងវិញបានទេ!',
      okText: 'លុបជាអចិន្ត្រៃយ៍', okType: 'danger', cancelText: 'បោះបង់', centered: true,
      onOk: async () => {
        const res = await request(`users/${id}/force`, 'delete')
        if (res && !res.errors) { message.success('លុបជាអចិន្ត្រៃយ៍បានជោគជ័យ!'); getList() }
        else message.error(res?.message || 'មានបញ្ហាក្នុងការលុប!')
      }
    })
  }

  const toggleStatus = async record => {
    const newStatus = record.status === 'active' ? 'inactive' : 'active'
    const res = await request(`users/${record.id}/status`, 'patch', { status: newStatus })
    if (res && !res.errors) { message.success('ប្តូរស្ថានភាពជោគជ័យ!'); getList() }
    else message.error(res?.message || 'បរាជ័យក្នុងការប្តូរស្ថានភាព!')
  }

  const openPasswordDrawer = id => {
    setState(pre => ({ ...pre, selectedUserId: id, passwordDrawerOpen: true }))
    passwordForm.resetFields()
  }

  const handleClosePasswordDrawer = () => {
    setState(pre => ({ ...pre, passwordDrawerOpen: false }))
    passwordForm.resetFields()
  }

  const onFinishPassword = async values => {
    setPasswordLoading(true)
    const res = await request(`users/${state.selectedUserId}/change-password`, 'put', { password: values.password })
    setPasswordLoading(false)
    if (res && !res.errors) { message.success('ប្តូរលេខសម្ងាត់ជោគជ័យ!'); handleClosePasswordDrawer() }
    else message.error(res?.message || 'បរាជ័យក្នុងការប្តូរលេខសម្ងាត់!')
  }

  // Called from PermissionSelector when any checkbox changes
  const handlePermissionChange = (customPermissions, customSelectedModules) => {
    setState(pre => ({ ...pre, customPermissions, customSelectedModules }))
  }

  const setRoleType = roleType => setState(pre => ({ ...pre, roleType }))

  const columns = [
    {
      title: 'អ្នកប្រើប្រាស់',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            size={36}
            icon={<UserOutlined />}
            src={record.profile_image ? config.image_path + record.profile_image : undefined}
            style={{ backgroundColor: record.deleted_at ? '#d9d9d9' : '#4f46e5', flexShrink: 0 }}
          />
          <div>
            <div className="font-semibold text-gray-800 text-sm leading-tight">{text}</div>
            <div className="text-xs text-gray-400">@{record.username}</div>
          </div>
        </div>
      )
    },
    {
      title: 'ទំនាក់ទំនង',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => (
        <div className="text-xs text-gray-600 space-y-0.5">
          <div className="flex items-center gap-1"><MailOutlined className="text-gray-400" /> {text}</div>
          {record.phone && <div className="flex items-center gap-1"><PhoneOutlined className="text-gray-400" /> {record.phone}</div>}
        </div>
      )
    },
    {
      title: 'ភេទ',
      dataIndex: 'gender',
      key: 'gender',
      render: text => <span className="text-sm text-gray-600">{text === 'male' ? 'ប្រុស' : text === 'female' ? 'ស្រី' : '—'}</span>
    },
    {
      title: 'តួនាទី',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => (
        <Tag color={record.role_id ? 'blue' : 'purple'} className="rounded px-2">
          {record.role_id ? role?.name : 'Custom'}
        </Tag>
      )
    },
    {
      title: 'សាខា',
      dataIndex: 'branch',
      key: 'branch',
      render: branch => <span className="text-sm text-gray-700">{branch?.name || '—'}</span>
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (text, record) => {
        if (record.deleted_at) return <Tag color="red">បានលុប</Tag>
        return (
          <Tooltip title="ចុចដើម្បីប្តូរស្ថានភាព">
            <Tag
              color={text === 'active' ? 'success' : 'warning'}
              className="cursor-pointer"
              onClick={() => toggleStatus(record)}
            >
              {text === 'active' ? 'សកម្ម' : 'អសកម្ម'}
            </Tag>
          </Tooltip>
        )
      }
    },
    {
      title: 'ថ្ងៃបង្កើត',
      dataIndex: 'created_at',
      key: 'created_at',
      render: text => <span className="text-xs text-gray-400">{dateClient(text)}</span>
    },
    {
      title: 'សកម្មភាព',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size={4}>
          {record.deleted_at ? (
            <>
              <Tooltip title="ស្តារឡើងវិញ">
                <Button type="text" size="small" icon={<UndoOutlined style={{ color: '#16a34a' }} />} onClick={() => handleRestore(record.id)} />
              </Tooltip>
              <Tooltip title="លុបជាអចិន្ត្រៃយ៍">
                <Button type="text" size="small" danger icon={<MdDeleteForever style={{ fontSize: 16 }} />} onClick={() => handleForceDelete(record.id)} />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="កែប្រែ">
                <Button type="text" size="small" icon={<CiEdit style={{ fontSize: 16, color: '#4f46e5' }} />} onClick={() => handleOpenDrawer(record)} />
              </Tooltip>
              <Tooltip title="ប្តូរលេខសម្ងាត់">
                <Button type="text" size="small" icon={<KeyOutlined style={{ color: '#d97706' }} />} onClick={() => openPasswordDrawer(record.id)} />
              </Tooltip>
              <Tooltip title="លុប">
                <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ]

  return (
    <MainPage loading={state.loading}>
      <div className="space-y-4">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white px-5 py-4 rounded-xl border border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-800 m-0">គ្រប់គ្រងអ្នកប្រើប្រាស់</h2>
            <Text type="secondary" className="text-xs">គ្រប់គ្រងអ្នកប្រើប្រាស់ តួនាទី និងសិទ្ធិ</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenDrawer()}
            className="rounded-lg bg-indigo-600 border-0 hover:bg-indigo-700 font-medium"
          >
            + បង្កើតអ្នកប្រើប្រាស់
          </Button>
        </div>

        {/* Stats Cards */}
        <UserStatsCard stats={stats} />

        {/* Filters */}
        <UserFilter
          pagination={pagination}
          setPagination={setPagination}
          defaultRoles={state.defaultRoles}
          branches={state.branches}
          onFilter={handleFilter}
          onReset={handleReset}
        />

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Table
            dataSource={state.list}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="middle"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-100 gap-3">
            <span className="text-sm text-gray-500">សរុប {pagination.total || 0} ជួរ</span>
            <Pagination
              current={pagination.page}
              pageSize={pagination.limit}
              total={pagination.total}
              onChange={(page, pageSize) => {
                setPagination({ page, limit: pageSize })
                getList({ ...pagination, page, limit: pageSize })
              }}
              showSizeChanger
              size="small"
            />
          </div>
        </div>

      </div>

      {/* User Add / Edit Drawer */}
      <UserDrawer
        open={state.drawerOpen}
        onClose={handleCloseDrawer}
        form={userForm}
        onFinish={onFinishUser}
        validate={validate}
        loading={submitLoading}
        selectedUserId={state.selectedUserId}
        branches={state.branches}
        defaultRoles={state.defaultRoles}
        roleType={state.roleType}
        setRoleType={setRoleType}
        customPermissions={state.customPermissions}
        customSelectedModules={state.customSelectedModules}
        onPermissionChange={handlePermissionChange}
      />

      {/* Password Reset Drawer */}
      <PasswordDrawer
        open={state.passwordDrawerOpen}
        onClose={handleClosePasswordDrawer}
        form={passwordForm}
        onFinish={onFinishPassword}
        loading={passwordLoading}
      />
    </MainPage>
  )
}

export default UsersPage
