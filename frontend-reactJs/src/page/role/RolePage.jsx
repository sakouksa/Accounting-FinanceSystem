import React, { useEffect, useState } from 'react'
import {
  Button, Form, message, Modal, Table, Tag,
  Typography, Pagination, Space
} from 'antd'
import {
  PlusOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'

import { request } from '../../util/request'
import { dateClient } from '../../util/helper'
import { usePaginationStore } from '../../store/usePaginationStore'
import MainPage from '../../components/layout/MainPage'

import RoleStatsCard from './components/RoleStatsCard'
import RoleFilters from './components/RoleFilters'
import RoleDrawer from './components/RoleDrawer'
import PermissionDrawer from './components/PermissionDrawer'

const { Text } = Typography

function RolePage () {
  const [stats, setStats] = useState([])
  const [roleForm] = Form.useForm()
  const [validate, setValidate] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)
  const [permissionLoading, setPermissionLoading] = useState(false)

  const [state, setState] = useState({
    list: [],
    permissionsList: [],
    loading: false,
    open: false,
    openPermissionModal: false,
    selectedRole: null
  })

  const { pagination, setPagination, resetPagination } = usePaginationStore()

  useEffect(() => {
    getList()
    getStats()
    getAllPermissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getStats = async () => {
    const res = await request('roles/stats', 'get')
    setStats(res?.stats || [])
  }

  const getList = async (currentFilter = pagination) => {
    setState(pre => ({ ...pre, loading: true }))
    let q = `?page=${currentFilter.page}&limit=${currentFilter.limit}`
    if (currentFilter.txt_search?.trim()) q += '&txt_search=' + encodeURIComponent(currentFilter.txt_search)
    if (currentFilter.status) q += '&status=' + currentFilter.status

    const res = await request('roles' + q, 'get')
    if (res?.status === 500) {
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ!')
      setState(pre => ({ ...pre, loading: false }))
      return
    }
    const data = res?.data ? res.data : res
    if (data?.list) {
      setState(pre => ({ ...pre, list: data.list, loading: false }))
      setPagination({ total: data.total || data.list.length || 0 })
    } else {
      setState(pre => ({ ...pre, loading: false, list: [] }))
      if (res?.errors?.message) message.error(res.errors.message)
    }
  }

  const getAllPermissions = async () => {
    const res = await request('permissions/all', 'get')
    if (res?.list) {
      const grouped = res.list.reduce((acc, perm) => {
        ;(acc[perm.module] = acc[perm.module] || []).push(perm)
        return acc
      }, {})
      setState(pre => ({ ...pre, permissionsList: grouped }))
    }
  }

  const handleOpenDrawer = () => setState(pre => ({ ...pre, open: true }))

  const handleCloseDrawer = () => {
    setState(pre => ({ ...pre, open: false }))
    roleForm.resetFields()
    setValidate({})
  }

  const handleOpenPermissionDrawer = role =>
    setState(pre => ({ ...pre, openPermissionModal: true, selectedRole: role }))

  const handleClosePermissionDrawer = () =>
    setState(pre => ({ ...pre, openPermissionModal: false, selectedRole: null }))

  const onFinish = async item => {
    setSubmitLoading(true)
    const isEdit = !!roleForm.getFieldValue('id')
    const url = isEdit ? `roles/${roleForm.getFieldValue('id')}` : 'roles'
    const method = isEdit ? 'put' : 'post'
    const res = await request(url, method, item)
    setSubmitLoading(false)
    if (res && !res.errors) {
      message.success(res.message || 'ជោគជ័យ!')
      handleCloseDrawer()
      await Promise.all([getList(pagination), getStats()])
    } else {
      setValidate(res?.errors || {})
      message.error(res?.message || 'ប្រតិបត្តិការបរាជ័យ!')
    }
  }

  const onFinishPermissions = async values => {
    setPermissionLoading(true)
    const res = await request(`role-permissions/${state.selectedRole?.id}/sync`, 'post', {
      permissions: values.permissions || []
    })
    setPermissionLoading(false)
    if (res && !res.errors) {
      message.success(res.message || 'ផ្តល់សិទ្ធិបានជោគជ័យ!')
      handleClosePermissionDrawer()
      getList()
    } else {
      message.error('បរាជ័យក្នុងការផ្តល់សិទ្ធិ!')
    }
  }

  const handleDelete = data => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុប',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: 'តើអ្នកពិតជាចង់លុបតួនាទីនេះមែនដែរឬទេ?',
      okText: 'លុបចេញ', okType: 'danger', cancelText: 'បោះបង់', centered: true,
      onOk: async () => {
        const res = await request(`roles/${data.id}`, 'delete')
        if (res && !res.error) { message.success(res.message || 'លុបបានជោគជ័យ!'); getList() }
        else message.error(res?.message || 'មានបញ្ហាក្នុងការលុប!')
      }
    })
  }

  const handleEdit = data => {
    roleForm.setFieldsValue({
      id: data.id,
      name: data.name,
      code: data.code,
      description: data.description,
      status: data.status
    })
    setState(p => ({ ...p, open: true }))
  }

  const handleFilter = () => {
    setPagination({ page: 1 })
    getList({ ...pagination, page: 1 })
  }

  const handleReset = () => {
    resetPagination()
    getList({ page: 1, limit: 10, txt_search: '', status: null })
  }

  const handlePageChange = (page, pageSize) => {
    setPagination({ page, limit: pageSize })
    getList({ ...pagination, page, limit: pageSize })
  }

  const columns = [
    {
      title: 'ឈ្មោះ',
      dataIndex: 'name',
      key: 'name',
      render: val => <span className="font-semibold text-gray-800">{val}</span>
    },
    {
      title: 'កូដ',
      dataIndex: 'code',
      key: 'code',
      render: val => <code className="bg-gray-100 text-indigo-600 px-2 py-0.5 rounded text-xs font-mono">{val}</code>
    },
    {
      title: 'ការពិពណ៌នា',
      dataIndex: 'description',
      key: 'description',
      render: val => val
        ? <span className="text-gray-500 text-sm">{val}</span>
        : <span className="text-gray-300 text-sm">—</span>
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: val => (
        <Tag color={val === 'active' ? 'success' : 'error'}>
          {val === 'active' ? 'សកម្ម' : 'អសកម្ម'}
        </Tag>
      )
    },
    {
      title: 'ថ្ងៃបង្កើត',
      dataIndex: 'created_at',
      key: 'created_at',
      render: val => <span className="text-xs text-gray-400">{dateClient(val)}</span>
    },
    {
      title: 'សកម្មភាព',
      key: 'action',
      align: 'center',
      render: data => (
        <Space size={4}>
          <Button
            type="default"
            size="small"
            onClick={() => handleOpenPermissionDrawer(data)}
            className="rounded bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 text-xs font-medium px-2"
          >
            សិទ្ធិ
          </Button>
          <Button
            type="text"
            size="small"
            icon={<CiEdit style={{ fontSize: 17, color: '#4f46e5' }} />}
            onClick={() => handleEdit(data)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<MdDelete style={{ fontSize: 16 }} />}
            onClick={() => handleDelete(data)}
          />
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
            <h2 className="text-lg font-bold text-gray-800 m-0">គ្រប់គ្រងតួនាទី</h2>
            <Text type="secondary" className="text-xs">កំណត់តួនាទីអ្នកប្រើប្រាស់ និងការគ្រប់គ្រងសិទ្ធិ</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenDrawer}
            className="rounded-lg bg-indigo-600 border-0 hover:bg-indigo-700 font-medium"
          >
            + បង្កើតតួនាទី
          </Button>
        </div>

        {/* Stats */}
        <RoleStatsCard stats={stats} />

        {/* Filters */}
        <RoleFilters
          pagination={pagination}
          setPagination={setPagination}
          onFilter={handleFilter}
          onReset={handleReset}
        />

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Table
            dataSource={state.list}
            rowKey="id"
            columns={columns}
            pagination={false}
            size="middle"
            scroll={{ x: 700 }}
          />
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-100 gap-3">
            <span className="text-sm text-gray-500">
              សរុប <b className="text-gray-700">{pagination.total || 0}</b> ជួរ
            </span>
            <Pagination
              current={pagination.page}
              pageSize={pagination.limit}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['10', '20', '50', '100']}
              size="small"
            />
          </div>
        </div>

      </div>

      {/* Role Add/Edit Drawer */}
      <RoleDrawer
        open={state.open}
        onClose={handleCloseDrawer}
        form={roleForm}
        onFinish={onFinish}
        validate={validate}
        loading={submitLoading}
      />

      {/* Permission Assignment Drawer */}
      <PermissionDrawer
        open={state.openPermissionModal}
        onClose={handleClosePermissionDrawer}
        permissionsList={state.permissionsList}
        onFinish={onFinishPermissions}
        role={state.selectedRole}
        loading={permissionLoading}
      />
    </MainPage>
  )
}

export default RolePage
