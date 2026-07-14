import React, { useEffect, useState, useCallback } from 'react'
import {
  Button, message, Table, Tag, Typography, Pagination, Input, Select,
  Space, Checkbox, Card, Row, Col, Drawer, Spin
} from 'antd'
import {
  SearchOutlined, ReloadOutlined, FilterOutlined,
  CheckCircleOutlined, SafetyCertificateOutlined
} from '@ant-design/icons'
import { RiSave3Fill } from 'react-icons/ri'
import { request } from '../../util/request'
import { usePaginationStore } from '../../store/usePaginationStore'
import MainPage from '../../components/layout/MainPage'

const { Text, Title: AntTitle } = Typography

function RolePermissionPage () {
  const [state, setState] = useState({
    list: [], groupedPermissions: {}, loading: false
  })
  const [drawer, setDrawer] = useState({
    open: false, role: null, assignedIds: [], saving: false, loading: false
  })
  const { pagination, setPagination, resetPagination } = usePaginationStore()

  const getList = useCallback(async (filters = pagination) => {
    setState(p => ({ ...p, loading: true }))
    let q = `?page=${filters.page}&limit=${filters.limit}`
    if (filters.txt_search) q += `&txt_search=${encodeURIComponent(filters.txt_search)}`
    if (filters.status) q += `&status=${filters.status}`

    const res = await request('role-permissions' + q, 'get')
    if (res && !res.errors) {
      setState(p => ({
        ...p, list: res.list || [], loading: false,
        groupedPermissions: res.grouped_permissions || {}
      }))
      setPagination({ total: res.total || 0 })
    } else {
      setState(p => ({ ...p, loading: false }))
      message.error(res?.errors?.message || 'ទាញទិន្នន័យបរាជ័យ')
    }
  }, [pagination])

  useEffect(() => { getList() }, [])

  const openDrawer = async (role) => {
    setDrawer(p => ({ ...p, open: true, role, loading: true, assignedIds: [] }))
    const res = await request(`role-permissions/${role.id}`, 'get')
    if (res && res.data) {
      setDrawer(p => ({ ...p, assignedIds: res.data.map(p2 => p2.id), loading: false }))
    } else {
      setDrawer(p => ({ ...p, loading: false }))
    }
  }

  const closeDrawer = () => {
    setDrawer({ open: false, role: null, assignedIds: [], saving: false, loading: false })
  }

  const handleToggle = (permId, checked) => {
    setDrawer(p => ({
      ...p,
      assignedIds: checked
        ? [...p.assignedIds, permId]
        : p.assignedIds.filter(id => id !== permId)
    }))
  }

  const handleToggleModule = (perms, checked) => {
    const ids = perms.map(p2 => p2.id)
    setDrawer(p => ({
      ...p,
      assignedIds: checked
        ? [...new Set([...p.assignedIds, ...ids])]
        : p.assignedIds.filter(id => !ids.includes(id))
    }))
  }

  const handleSave = async () => {
    setDrawer(p => ({ ...p, saving: true }))
    const res = await request(`role-permissions/${drawer.role.id}/sync`, 'post', {
      permissions: drawer.assignedIds
    })
    if (res && !res.errors) {
      message.success(res.message || 'បានកំណត់សិទ្ធិដោយជោគជ័យ!')
      closeDrawer()
      getList()
    } else {
      message.error(res?.errors?.message || 'បរាជ័យ!')
    }
    setDrawer(p => ({ ...p, saving: false }))
  }

  const handleFilter = () => { setPagination({ page: 1 }); getList({ ...pagination, page: 1 }) }
  const handleReset = () => { resetPagination(); getList({ page: 1, limit: 20, txt_search: '', status: null }) }
  const handlePageChange = (page, pageSize) => { setPagination({ page, limit: pageSize }); getList({ ...pagination, page, limit: pageSize }) }

  return (
    <MainPage loading={state.loading}>
      <div>
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
            <div>
              <h2 className='text-xl font-bold text-gray-900 m-0 flex flex-col md:flex-row md:items-center gap-2'>
                សិទ្ធិតាមតួនាទី (Role Permissions)
                <span className='text-sm font-normal text-indigo-600 px-3 py-1 rounded-full w-fit'>
                  តួនាទីសរុប: {pagination.total || 0}
                </span>
              </h2>
              <Text type='secondary' className='text-sm'>កំណត់សិទ្ធិអ្នកប្រើប្រាស់តាមតួនាទីនីមួយៗ</Text>
            </div>
          </div>

          <div className='border-t border-gray-100 pt-6'>
            <div className='flex flex-wrap justify-between items-center gap-4'>
              <Input
                allowClear value={pagination.txt_search || ''}
                onChange={e => setPagination({ txt_search: e.target.value })}
                placeholder='ស្វែងរកតួនាទី...' onPressEnter={handleFilter}
                prefix={<SearchOutlined className='text-gray-400 mr-2' />}
                style={{ width: 220 }}
              />
              <div className='flex flex-wrap items-center gap-3'>
                <Select allowClear placeholder='ស្ថានភាព' style={{ width: 140 }}
                  value={pagination.status || null}
                  onChange={v => setPagination({ status: v })}
                  options={[{ label: 'សកម្ម', value: 'active' }, { label: 'អសកម្ម', value: 'inactive' }]}
                />
                <Button type='default' onClick={handleReset} icon={<ReloadOutlined />}>កំណត់ឡើងវិញ</Button>
                <Button type='primary' onClick={handleFilter} icon={<FilterOutlined />}
                  className='bg-indigo-600 border-0'>តម្រងទិន្នន័យ</Button>
              </div>
            </div>
          </div>
        </div>

        <Table dataSource={state.list} rowKey='id' scroll={{ x: 800 }} pagination={false}
          columns={[
            { title: 'ឈ្មោះតួនាទី', dataIndex: 'name', key: 'name',
              render: (v) => <span className='font-semibold'>{v}</span> },
            { title: 'កូដ', dataIndex: 'code', key: 'code',
              render: v => <code className='bg-gray-50 px-2 py-1 rounded text-xs'>{v}</code> },
            { title: 'ស្ថានភាព', dataIndex: 'status', key: 'status', align: 'center',
              render: v => v === 'active' ? <Tag color='green'>សកម្ម</Tag> : <Tag color='red'>អសកម្ម</Tag> },
            { title: 'សិទ្ធិ', dataIndex: 'permissions_count', key: 'permissions_count', align: 'center',
              render: v => <Tag color='purple' className='font-bold'>{v || 0} សិទ្ធិ</Tag> },
            { title: 'សកម្មភាព', key: 'action', align: 'center',
              render: data => (
                <Button type='primary' size='small' icon={<SafetyCertificateOutlined />}
                  className='bg-indigo-600 border-0' onClick={() => openDrawer(data)}>
                  កំណត់សិទ្ធិ
                </Button>
              )
            }
          ]}
        />

        <div className='flex justify-between items-center bg-white p-4 border border-gray-100 rounded-b-2xl shadow-sm mt-0.5'>
          <span className='text-gray-600 text-sm'>សរុប: <b className='text-indigo-600'>{pagination.total || 0}</b> ទិន្នន័យ</span>
          <Pagination current={pagination.page} pageSize={pagination.limit} total={pagination.total}
            onChange={handlePageChange} showSizeChanger pageSizeOptions={['10', '20', '50']}
            showTotal={(total, range) => `${range[0]}-${range[1]} នៃ ${total}`} />
        </div>

        {/* Permission Assignment Drawer */}
        <Drawer title={`កំណត់សិទ្ធិសម្រាប់: ${drawer.role?.name || ''}`}
          open={drawer.open} onClose={closeDrawer} width={720}
          footer={
            <div className='flex justify-end gap-3 p-2'>
              <Button onClick={closeDrawer}>បោះបង់</Button>
              <Button type='primary' icon={<RiSave3Fill />} loading={drawer.saving}
                className='bg-indigo-600 border-0' onClick={handleSave}>
                រក្សាទុកសិទ្ធិ ({drawer.assignedIds.length})
              </Button>
            </div>
          }
        >
          {drawer.loading ? (
            <div className='flex justify-center py-20'><Spin size='large' /></div>
          ) : (
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingRight: 8 }}>
              {Object.entries(state.groupedPermissions).map(([module, perms]) => {
                const allChecked = perms.every(p2 => drawer.assignedIds.includes(p2.id))
                const someChecked = perms.some(p2 => drawer.assignedIds.includes(p2.id))
                return (
                  <Card key={module} size='small' className='mb-4 rounded-xl border-gray-200'
                    title={
                      <Checkbox checked={allChecked} indeterminate={!allChecked && someChecked}
                        onChange={e => handleToggleModule(perms, e.target.checked)}>
                        <span className='font-bold text-indigo-700'>{module}</span>
                        <Tag color='blue' className='ml-2'>{perms.filter(p2 => drawer.assignedIds.includes(p2.id)).length}/{perms.length}</Tag>
                      </Checkbox>
                    }
                  >
                    <Row gutter={[12, 8]}>
                      {perms.map(perm => (
                        <Col span={12} key={perm.id}>
                          <Checkbox checked={drawer.assignedIds.includes(perm.id)}
                            onChange={e => handleToggle(perm.id, e.target.checked)}>
                            <span className='text-sm'>{perm.name}</span>
                            <Tag color={perm.action === 'view' ? 'cyan' : perm.action === 'create' ? 'green' :
                              perm.action === 'update' ? 'orange' : perm.action === 'delete' ? 'red' : 'purple'}
                              className='ml-1 text-xs'>{perm.action}</Tag>
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                )
              })}
            </div>
          )}
        </Drawer>
      </div>
    </MainPage>
  )
}

export default RolePermissionPage
