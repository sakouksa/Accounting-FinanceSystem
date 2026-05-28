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
  Checkbox,
  Row,
  Col,
  Card
} from 'antd'
import {
  SearchOutlined,
  ExclamationCircleFilled,
  ReloadOutlined,
  FilterOutlined,
  PlusOutlined,
  DollarOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { CiEdit } from 'react-icons/ci'
import { RiSave3Fill } from 'react-icons/ri'

import { MdDelete } from 'react-icons/md'
import { BiSolidEditAlt } from 'react-icons/bi'

import { request } from '../../util/request'
import { dateClient } from '../../util/helper'
import { usePaginationStore } from '../../store/usePaginationStore'
import MainPage from '../../components/layout/MainPage'

const { Title: AntTitle, Text } = Typography
function RolePage () {
  const [stats, setStats] = useState([])
  const [formRef] = Form.useForm()
  const [validate, setValidate] = useState({})
  const iconMap = {
    SafetyOutlined: <SafetyOutlined />,
    CheckCircleOutlined: <CheckCircleOutlined />,
    CloseCircleOutlined: <CloseCircleOutlined />,
    CalendarOutlined: <CalendarOutlined />
  }
  const [state, setState] = useState({
    list: [],
    permissionsList: [],
    loading: false,
    open: false,
    openPermissionModal: false,
    selectedRoleId: null
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

    if (res && res.stats) {
      setStats(res.stats)
    } else {
      setStats([]) // fallback
    }
  }
  const getList = async (currentFilter = pagination) => {
    setState(pre => ({ ...pre, loading: true }))

    let query_param = `?page=${currentFilter.page}&limit=${currentFilter.limit}`
    if (currentFilter.txt_search !== '' && currentFilter.txt_search !== null) {
      query_param += '&txt_search=' + currentFilter.txt_search
    }
    if (currentFilter.status !== '' && currentFilter.status !== null) {
      query_param += '&status=' + currentFilter.status
    }

    const res = await request('roles' + query_param, 'get')
    if (res && res.status === 500) {
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ 500!')
      setState(pre => ({ ...pre, loading: false }))
      return
    }

    if (res && !res.errors) {
      setState(pre => ({
        ...pre,
        list: res.list || [],
        loading: false
      }))

      setPagination({
        total: res.total || res.list?.length || 0
      })
    } else {
      setState(pre => ({ ...pre, loading: false }))
      if (res.errors?.message) {
        message.error(res.errors.message)
      }
    }
  }

  const getAllPermissions = async () => {
    const res = await request('permissions', 'get')
    if (res && res.list) {
      const grouped = res.list.reduce((acc, perm) => {
        ;(acc[perm.group] = acc[perm.group] || []).push(perm)
        return acc
      }, {})
      setState(pre => ({ ...pre, permissionsList: grouped }))
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

  const handleOpenPermissionModal = async role => {
    setState(pre => ({
      ...pre,
      openPermissionModal: true,
      selectedRoleId: role.id
    }))

    const res = await request(`roles/${role.id}/permissions`, 'get')
    if (res && res.data) {
      const permIds = res.data.map(p => p.id)
      formRef.setFieldsValue({ permissions: permIds })
    } else {
      formRef.setFieldsValue({ permissions: [] })
    }
  }

  const handleClosePermissionModal = () => {
    setState(pre => ({
      ...pre,
      openPermissionModal: false,
      selectedRoleId: null
    }))
    formRef.resetFields()
  }

  const onFinish = async item => {
    let url = 'roles'
    let method = 'post'

    if (formRef.getFieldValue('id')) {
      url += '/' + formRef.getFieldValue('id')
      method = 'put' // ប្រើ put សម្រាប់ update ក្នុង laravel api resource
    }

    const res = await request(url, method, item)
    if (res && !res.errors) {
      message.success(res.message || 'ជោគជ័យ!')
      handleCloseModal()
      // FORCE refresh latest data card
      await Promise.all([getList(pagination), getStats()])
    } else {
      setValidate(res.errors || {})
      message.error(res?.message || 'ប្រតិបត្តិការបរាជ័យ!')
    }
  }

  const onFinishPermissions = async values => {
    const roleId = state.selectedRoleId
    const res = await request(`roles/${roleId}/assign-permissions`, 'post', {
      permissions: values.permissions || []
    })

    if (res && !res.errors) {
      message.success(res.message || 'ផ្តល់សិទ្ធិបានជោគជ័យ!')
      handleClosePermissionModal()
      getList()
    } else {
      message.error('បរាជ័យក្នុងការផ្តល់សិទ្ធិ!')
    }
  }

  const handleDelete = async data => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុប',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: 'តើអ្នកពិតជាចង់លុបតួនាទីនេះមែនដែរឬទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request(`roles/${data.id}`, 'delete')
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

  const handleReset = async () => {
    resetPagination()
    getList({ page: 1, limit: 10, txt_search: '', status: null })
  }

  const handlePageChange = (page, pageSize) => {
    setPagination({ page, limit: pageSize })
    getList({ ...pagination, page, limit: pageSize })
  }

  return (
    <>
      <MainPage loading={state.loading}>
        <div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
              <div>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white m-0 flex flex-col md:flex-row md:items-center gap-2'>
                  បញ្ជីគ្រប់គ្រងតួនាទី (Roles)
                  <span className='text-sm font-normal text-indigo-600 dark:text-indigo-400 dark:bg-indigo-900/30 px-3 py-1 rounded-full w-fit'>
                    តួនាទីសរុប: {pagination.total || 0}
                  </span>
                </h2>

                <Text type='secondary' className='text-sm dark:text-gray-400'>
                  គ្រប់គ្រងតួនាទី និងសិទ្ធិអ្នកប្រើប្រាស់នៅក្នុងប្រព័ន្ធ
                </Text>
              </div>

              <div className='flex flex-wrap items-center gap-3 w-full md:w-auto justify-end'>
                <Button
                  type='primary'
                  onClick={handleOpenModal}
                  icon={<PlusOutlined />}
                  className=' px-5 bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg font-medium shadow-sm flex items-center transition-all'
                >
                  បង្កើតថ្មី
                </Button>
              </div>
            </div>

            {/* Dynamic Stats Cards */}
            <Row gutter={[16, 16]}>
              {stats.map((item, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card
                    className='rounded-2xl border-none shadow-sm overflow-hidden relative hover:shadow-lg transition-all duration-300'
                    bodyStyle={{ padding: 20 }}
                  >
                    <div className='flex justify-between items-start'>
                      <div>
                        <Text type='secondary' className='text-xs font-medium'>
                          {item.title}
                        </Text>

                        <AntTitle level={3} className='m-0 mt-1 font-bold'>
                          {item.value}
                        </AntTitle>

                        <div
                          className={`text-xs mt-2 font-bold flex items-center gap-1 ${
                            item.isUp ? 'text-emerald-500' : 'text-red-500'
                          }`}
                        >
                          {item.isUp ? (
                            <ArrowUpOutlined />
                          ) : (
                            <ArrowDownOutlined />
                          )}

                          {item.percent}

                          <span className='text-gray-400 font-normal ml-1'>
                            vs last month
                          </span>
                        </div>
                      </div>

                      <div
                        className='p-3 rounded-xl bg-gray-50 text-xl'
                        style={{
                          color: item.color,
                          backgroundColor: `${item.color}15`
                        }}
                      >
                        {iconMap[item.icon]}
                      </div>
                    </div>

                    {/* Bottom Gradient */}
                    <div
                      className='absolute bottom-0 left-0 h-1 w-full'
                      style={{
                        background: `linear-gradient(to right, ${item.color}, transparent)`
                      }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            <div className='border-t border-gray-100 pt-6'>
              <div className='flex flex-wrap justify-between items-center gap-4'>
                <Input
                  allowClear
                  value={pagination.txt_search || ''}
                  onChange={e => setPagination({ txt_search: e.target.value })}
                  placeholder='ស្វែងរកតួនាទី...'
                  onPressEnter={handleFilter}
                  prefix={
                    <SearchOutlined className='text-gray-400 dark:text-gray-500 mr-2' />
                  }
                  style={{ width: 220 }}
                />

                <div className='flex flex-wrap items-center gap-3'>
                  <Select
                    allowClear
                    placeholder='ជ្រើសរើសស្ថានភាព'
                    style={{ width: 160 }}
                    value={pagination.status}
                    onChange={value => setPagination({ status: value })}
                    options={[
                      { label: 'សកម្ម', value: 'active' },
                      { label: 'អសកម្ម', value: 'inactive' }
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

          {/* Modal សម្រាប់បន្ថែម ឬកែប្រែ Role */}
          <Modal
            title={
              formRef.getFieldValue('id') ? 'កែប្រែតួនាទី' : 'បង្កើតតួនាទីថ្មី'
            }
            open={state.open}
            onCancel={handleCloseModal}
            centered
            width={600}
            footer={null}
            maskClosable={false}
          >
            <Form layout='vertical' onFinish={onFinish} form={formRef}>
              <Form.Item name='id' style={{ display: 'none' }}>
                <Input type='hidden' />
              </Form.Item>

              <Form.Item
                label='ឈ្មោះតួនាទី'
                name='name'
                {...validate.name}
                rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះតួនាទី!' }]}
              >
                <Input placeholder='បញ្ចូលឈ្មោះតួនាទី' />
              </Form.Item>

              <Form.Item
                label='កូដតួនាទី'
                name='code'
                {...validate.code}
                rules={[{ required: true, message: 'សូមបញ្ចូលកូដតួនាទី!' }]}
              >
                <Input placeholder='បញ្ចូលកូដតួនាទី' />
              </Form.Item>

              <Form.Item
                label='ការពិពណ៌នា'
                name='description'
                {...validate.description}
              >
                <Input.TextArea placeholder='បញ្ចូលការពិពណ៌នា' rows={2} />
              </Form.Item>

              <Form.Item label='ស្ថានភាព' name='status' initialValue='active'>
                <Select
                  placeholder='ជ្រើសរើសស្ថានភាព'
                  options={[
                    { label: 'សកម្ម', value: 'active' },
                    { label: 'អសកម្ម', value: 'inactive' }
                  ]}
                />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                  <Button onClick={handleCloseModal}>បោះបង់</Button>
                  <Button
                    type='primary'
                    style={{ color: '#fff' }}
                    htmlType='submit'
                    className='px-3 flex items-center bg-indigo-600 border-0'
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

          {/* Modal សម្រាប់កំណត់សិទ្ធិ (Permissions Assignment) */}
          <Modal
            title='កំណត់សិទ្ធិ (Permissions Assignment)'
            open={state.openPermissionModal}
            onCancel={handleClosePermissionModal}
            width={800}
            footer={null}
            centered
            maskClosable={false}
          >
            <Form
              layout='vertical'
              onFinish={onFinishPermissions}
              form={formRef}
            >
              <Form.Item name='permissions'>
                <div
                  style={{
                    maxHeight: '450px',
                    overflowY: 'auto',
                    paddingRight: '10px'
                  }}
                >
                  {Object.keys(state.permissionsList).map(groupName => (
                    <Card
                      size='small'
                      title={
                        <span style={{ textTransform: 'capitalize' }}>
                          {groupName}
                        </span>
                      }
                      key={groupName}
                      style={{ marginBottom: '16px' }}
                    >
                      <Checkbox.Group style={{ width: '100%' }}>
                        <Row gutter={[16, 12]}>
                          {state.permissionsList[groupName].map(perm => (
                            <Col span={12} key={perm.id}>
                              <Checkbox value={perm.id}>{perm.name}</Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    </Card>
                  ))}
                </div>
              </Form.Item>

              <Form.Item
                style={{ textAlign: 'right', marginBottom: 0, marginTop: 16 }}
              >
                <Space>
                  <Button onClick={handleClosePermissionModal}>បោះបង់</Button>
                  <Button
                    type='primary'
                    htmlType='submit'
                    icon={<RiSave3Fill />}
                  >
                    រក្សាទុកសិទ្ធិ
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          <Table
            dataSource={state.list}
            rowKey='id'
            scroll={{ x: 800 }}
            pagination={false}
            columns={[
              { title: 'ឈ្មោះ', dataIndex: 'name', key: 'name' },
              { title: 'កូដ', dataIndex: 'code', key: 'code' },
              {
                title: 'ការពិពណ៌នា',
                dataIndex: 'description',
                key: 'description'
              },
              {
                title: 'ស្ថានភាព',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: val =>
                  val === 'active' ? (
                    <Tag color='green'>សកម្ម</Tag>
                  ) : (
                    <Tag color='red'>អសកម្ម</Tag>
                  )
              },
              {
                title: 'ថ្ងៃបង្កើត',
                dataIndex: 'created_at',
                key: 'created_at',
                render: val => dateClient(val)
              },
              {
                title: 'សកម្មភាព',
                key: 'action',
                align: 'center',
                render: data => (
                  <Space>
                    <button
                      onClick={() => handleOpenPermissionModal(data)}
                      className='px-3 py-1 text-xs rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition'
                    >
                      សិទ្ធិ
                    </button>
                    <Button
                      type='text'
                      onClick={() => handleEdit(data)}
                      icon={
                        <CiEdit style={{ fontSize: 18, color: '#004EBC' }} />
                      }
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

export default RolePage
