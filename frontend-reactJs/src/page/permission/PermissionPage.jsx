import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Pagination,
  Switch,
  Row,
  Col,
  Card
} from 'antd'

import { CiEdit } from 'react-icons/ci'
import { RiSave3Fill } from 'react-icons/ri'
import {
  SearchOutlined,
  ExclamationCircleFilled,
  ReloadOutlined,
  FilterOutlined,
  PlusOutlined,
  KeyOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'
import { MdDelete } from 'react-icons/md'
import { BiSolidEditAlt } from 'react-icons/bi'

import { request } from '../../util/request'
import { dateClient } from '../../util/helper'
import { usePaginationStore } from '../../store/usePaginationStore'
import MainPage from '../../components/layout/MainPage'

const { Text, Title: AntTitle } = Typography

function PermissionPage () {
  const [formRef] = Form.useForm()
  const [validate, setValidate] = useState({})
  const [modules, setModules] = useState([])
  const [state, setState] = useState({
    list: [],
    loading: false,
    open: false
  })

  const { pagination, setPagination, resetPagination } = usePaginationStore()

  useEffect(() => {
    getList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getList = async (currentFilter = pagination) => {
    setState(pre => ({ ...pre, loading: true }))

    let query_param = `?page=${currentFilter.page}&limit=${currentFilter.limit}`
    if (currentFilter.txt_search && currentFilter.txt_search.trim() !== '') {
      query_param += '&txt_search=' + encodeURIComponent(currentFilter.txt_search)
    }
    if (currentFilter.module) {
      query_param += '&module=' + encodeURIComponent(currentFilter.module)
    }
    if (currentFilter.action) {
      query_param += '&action=' + encodeURIComponent(currentFilter.action)
    }

    const res = await request('permissions' + query_param, 'get')

    if (res && res.status === 500) {
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ!')
      setState(pre => ({ ...pre, loading: false }))
      return
    }

    if (res && !res.errors) {
      setState(pre => ({
        ...pre,
        list: res.list || [],
        loading: false
      }))
      setPagination({ total: res.total || 0 })
      if (res.modules) {
        setModules(res.modules)
      }
    } else {
      setState(pre => ({ ...pre, loading: false }))
      if (res?.errors?.message) {
        message.error(res.errors.message)
      }
    }
  }

  const handleOpenModal = () => {
    setState(pre => ({ ...pre, open: true }))
  }

  const handleCloseModal = () => {
    setState(pre => ({ ...pre, open: false }))
    formRef.resetFields()
    setValidate({})
  }

  const onFinish = async item => {
    // Convert is_menu boolean to integer
    item.is_menu = item.is_menu ? 1 : 0

    let url = 'permissions'
    let method = 'post'

    if (formRef.getFieldValue('id')) {
      url += '/' + formRef.getFieldValue('id')
      method = 'put'
    }

    const res = await request(url, method, item)
    if (res && !res.errors) {
      message.success(res.message || 'ជោគជ័យ!')
      handleCloseModal()
      getList()
    } else {
      setValidate(res?.errors || {})
      message.error(res?.message || 'ប្រតិបត្តិការបរាជ័យ!')
    }
  }

  const handleDelete = async data => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុប',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: 'តើអ្នកពិតជាចង់លុបសិទ្ធិនេះមែនដែរឬទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request(`permissions/${data.id}`, 'delete')
        if (res && !res.error) {
          message.success(res.message || 'លុបបានជោគជ័យ!')
          getList()
        } else {
          message.error(res?.message || 'មានបញ្ហាក្នុងការលុប!')
        }
      }
    })
  }

  const handleEdit = data => {
    formRef.setFieldsValue({
      ...data,
      is_menu: data.is_menu === 1 || data.is_menu === true
    })
    setState(p => ({ ...p, open: true }))
  }

  const handleFilter = () => {
    setPagination({ page: 1 })
    getList({ ...pagination, page: 1 })
  }

  const handleReset = async () => {
    resetPagination()
    getList({ page: 1, limit: 20, txt_search: '', module: null, action: null })
  }

  const handlePageChange = (page, pageSize) => {
    setPagination({ page, limit: pageSize })
    getList({ ...pagination, page, limit: pageSize })
  }

  // Stats cards
  const totalPermissions = pagination.total || 0
  const menuPermissions = state.list.filter(p => p.is_menu === 1).length
  const uniqueModules = [...new Set(state.list.map(p => p.module))].length

  return (
    <>
      <MainPage loading={state.loading}>
        <div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
              <div>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white m-0 flex flex-col md:flex-row md:items-center gap-2'>
                  បញ្ជីគ្រប់គ្រងសិទ្ធិ (Permissions)
                  <span className='text-sm font-normal text-indigo-600 dark:text-indigo-400 dark:bg-indigo-900/30 px-3 py-1 rounded-full w-fit'>
                    សិទ្ធិសរុប: {totalPermissions}
                  </span>
                </h2>
                <Text type='secondary' className='text-sm dark:text-gray-400'>
                  គ្រប់គ្រងសិទ្ធិរបស់មុខងារនីមួយៗនៅក្នុងប្រព័ន្ធ
                </Text>
              </div>

              <div className='flex flex-wrap items-center gap-3 w-full md:w-auto justify-end'>
                <Button
                  type='primary'
                  onClick={handleOpenModal}
                  icon={<PlusOutlined />}
                  className='h-9 px-5 bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg font-medium shadow-sm flex items-center transition-all'
                >
                  បង្កើតថ្មី
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <Row gutter={[16, 16]} className='mb-6'>
              <Col xs={24} sm={8}>
                <Card
                  className='rounded-2xl border-none shadow-sm overflow-hidden relative hover:shadow-lg transition-all duration-300'
                  styles={{ body: { padding: 20 } }}
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <Text type='secondary' className='text-xs font-medium'>សិទ្ធិសរុប</Text>
                      <AntTitle level={3} className='m-0 mt-1 font-bold'>{totalPermissions}</AntTitle>
                    </div>
                    <div className='p-3 rounded-xl text-xl' style={{ color: '#6366f1', backgroundColor: '#6366f115' }}>
                      <KeyOutlined />
                    </div>
                  </div>
                  <div className='absolute bottom-0 left-0 h-1 w-full' style={{ background: 'linear-gradient(to right, #6366f1, transparent)' }} />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  className='rounded-2xl border-none shadow-sm overflow-hidden relative hover:shadow-lg transition-all duration-300'
                  styles={{ body: { padding: 20 } }}
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <Text type='secondary' className='text-xs font-medium'>បង្ហាញលើ Menu</Text>
                      <AntTitle level={3} className='m-0 mt-1 font-bold'>{menuPermissions}</AntTitle>
                    </div>
                    <div className='p-3 rounded-xl text-xl' style={{ color: '#10b981', backgroundColor: '#10b98115' }}>
                      <AppstoreOutlined />
                    </div>
                  </div>
                  <div className='absolute bottom-0 left-0 h-1 w-full' style={{ background: 'linear-gradient(to right, #10b981, transparent)' }} />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  className='rounded-2xl border-none shadow-sm overflow-hidden relative hover:shadow-lg transition-all duration-300'
                  styles={{ body: { padding: 20 } }}
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <Text type='secondary' className='text-xs font-medium'>ម៉ូឌុល</Text>
                      <AntTitle level={3} className='m-0 mt-1 font-bold'>{uniqueModules}</AntTitle>
                    </div>
                    <div className='p-3 rounded-xl text-xl' style={{ color: '#f59e0b', backgroundColor: '#f59e0b15' }}>
                      <AppstoreOutlined />
                    </div>
                  </div>
                  <div className='absolute bottom-0 left-0 h-1 w-full' style={{ background: 'linear-gradient(to right, #f59e0b, transparent)' }} />
                </Card>
              </Col>
            </Row>

            {/* Filter Section */}
            <div className='border-t border-gray-100 pt-6'>
              <div className='flex flex-wrap justify-between items-center gap-4'>
                <Input
                  allowClear
                  value={pagination.txt_search || ''}
                  onChange={e => setPagination({ txt_search: e.target.value })}
                  placeholder='ស្វែងរកសិទ្ធិ...'
                  onPressEnter={handleFilter}
                  prefix={<SearchOutlined className='text-gray-400 dark:text-gray-500 mr-2' />}
                  style={{ width: 220 }}
                />

                <div className='flex flex-wrap items-center gap-3'>
                  <Select
                    allowClear
                    placeholder='ម៉ូឌុល'
                    style={{ width: 160 }}
                    value={pagination.module || null}
                    onChange={value => setPagination({ module: value })}
                    options={modules.map(m => ({ label: m, value: m }))}
                  />

                  <Select
                    allowClear
                    placeholder='សកម្មភាព'
                    style={{ width: 130 }}
                    value={pagination.action || null}
                    onChange={value => setPagination({ action: value })}
                    options={[
                      { label: 'View', value: 'view' },
                      { label: 'Create', value: 'create' },
                      { label: 'Update', value: 'update' },
                      { label: 'Delete', value: 'delete' },
                      { label: 'Export', value: 'export' }
                    ]}
                  />

                  <div className='flex gap-2'>
                    <Button
                      type='default'
                      onClick={handleReset}
                      icon={<ReloadOutlined />}
                      className='px-3 flex items-center hover:text-indigo-600'
                    >
                      កំណត់ឡើងវិញ
                    </Button>
                    <Button
                      type='primary'
                      onClick={handleFilter}
                      icon={<FilterOutlined />}
                      className='px-3 flex items-center bg-indigo-600 border-0 hover:bg-indigo-700'
                    >
                      តម្រងទិន្នន័យ
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
          <Modal
            title={
              formRef.getFieldValue('id') ? 'កែប្រែសិទ្ធិ' : 'បង្កើតសិទ្ធិថ្មី'
            }
            open={state.open}
            onCancel={handleCloseModal}
            centered
            width={600}
            footer={null}
            mask={{ closable: false }}
          >
            <Form layout='vertical' onFinish={onFinish} form={formRef}>
              <Form.Item name='id' style={{ display: 'none' }}>
                <Input type='hidden' />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label='ម៉ូឌុល (Module)'
                    name='module'
                    {...validate.module}
                    rules={[{ required: true, message: 'សូមបញ្ចូលម៉ូឌុល!' }]}
                  >
                    <Input placeholder='ឧ. Finance, Security, Dashboard' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='សកម្មភាព (Action)'
                    name='action'
                    {...validate.action}
                    rules={[{ required: true, message: 'សូមបញ្ចូលសកម្មភាព!' }]}
                  >
                    <Select
                      placeholder='ជ្រើសរើorg សកម្មភាព'
                      options={[
                        { label: 'View', value: 'view' },
                        { label: 'Create', value: 'create' },
                        { label: 'Update', value: 'update' },
                        { label: 'Delete', value: 'delete' },
                        { label: 'Export', value: 'export' }
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label='ឈ្មោះសិទ្ធិ (Name)'
                name='name'
                {...validate.name}
                rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះសិទ្ធិ!' }]}
              >
                <Input placeholder='ឧ. គ្រប់គ្រងគណនី' />
              </Form.Item>

              <Form.Item
                label='កូដសិទ្ធិ (Code)'
                name='code'
                {...validate.code}
                rules={[{ required: true, message: 'សូមបញ្ចូលកូដសិទ្ធិ!' }]}
              >
                <Input placeholder='ឧ. accounts_view' />
              </Form.Item>

              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    label='Route Key'
                    name='route_key'
                    {...validate.route_key}
                  >
                    <Input placeholder='ឧ. /chart-of-accounts' />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label='បង្ហាញលើ Menu'
                    name='is_menu'
                    valuePropName='checked'
                    initialValue={false}
                  >
                    <Switch
                      checkedChildren='បង្ហាញ'
                      unCheckedChildren='លាក់'
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                  <Button onClick={handleCloseModal}>បោះបង់</Button>
                  <Button
                    type='primary'
                    htmlType='submit'
                    className='bg-indigo-600 border-0'
                    icon={
                      formRef.getFieldValue('id') ? (
                        <BiSolidEditAlt />
                      ) : (
                        <RiSave3Fill />
                      )
                    }
                  >
                    {formRef.getFieldValue('id')
                      ? 'ធ្វើបច្ចុប្បន្នភាព'
                      : 'រក្សាទុក'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          <Table
            dataSource={state.list}
            rowKey='id'
            scroll={{ x: 1100 }}
            pagination={false}
            columns={[
              {
                title: 'ម៉ូឌុល',
                dataIndex: 'module',
                key: 'module',
                width: 120,
                render: val => (
                  <Tag color='geekblue' className='font-medium'>{val}</Tag>
                )
              },
              { title: 'ឈ្មោះ', dataIndex: 'name', key: 'name' },
              {
                title: 'កូដ (Code)',
                dataIndex: 'code',
                key: 'code',
                render: val => (
                  <code className='bg-gray-50 px-2 py-1 rounded text-xs text-indigo-700'>{val}</code>
                )
              },
              {
                title: 'សកម្មភាព',
                dataIndex: 'action',
                key: 'action',
                width: 100,
                align: 'center',
                render: val => {
                  const colorMap = {
                    view: 'cyan', create: 'green', update: 'orange',
                    delete: 'red', export: 'purple'
                  }
                  return <Tag color={colorMap[val] || 'default'}>{val}</Tag>
                }
              },
              {
                title: 'Menu',
                dataIndex: 'is_menu',
                key: 'is_menu',
                width: 80,
                align: 'center',
                render: val =>
                  val === 1 ? (
                    <CheckCircleOutlined style={{ color: '#10b981', fontSize: 18 }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: '#d1d5db', fontSize: 18 }} />
                  )
              },
              {
                title: 'Route Key',
                dataIndex: 'route_key',
                key: 'route_key',
                render: val => val ? (
                  <code className='bg-gray-50 px-2 py-1 rounded text-xs'>{val}</code>
                ) : (
                  <span className='text-gray-400'>—</span>
                )
              },
              {
                title: 'ថ្ងៃបង្កើត',
                dataIndex: 'created_at',
                key: 'created_at',
                width: 130,
                render: val => (val ? dateClient(val) : '—')
              },
              {
                title: 'សកម្មភាព',
                key: 'actions',
                align: 'center',
                width: 100,
                render: data => (
                  <Space>
                    <Button
                      type='text'
                      onClick={() => handleEdit(data)}
                      icon={<CiEdit style={{ fontSize: 18, color: '#004EBC' }} />}
                    />
                    <Button
                      type='text'
                      danger
                      onClick={() => handleDelete(data)}
                      icon={<MdDelete style={{ fontSize: 18 }} />}
                    />
                  </Space>
                )
              }
            ]}
          />

          <div className='flex justify-between items-center bg-white p-4 border border-gray-100 rounded-b-2xl shadow-sm mt-0.5'>
            <span className='text-gray-600 text-sm'>
              សរុប: <b className='text-indigo-600'>{pagination.total || 0}</b>{' '}
              ទិន្នន័យ
            </span>
            <Pagination
              current={pagination.page}
              pageSize={pagination.limit}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['10', '20', '50', '100']}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} នៃ ${total}`
              }
              className='ant-pagination-custom'
            />
          </div>
        </div>
      </MainPage>
    </>
  )
}

export default PermissionPage
