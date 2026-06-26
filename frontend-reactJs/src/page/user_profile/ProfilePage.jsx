import React, { useEffect, useState } from 'react'
import {
  Card,
  Avatar,
  Tag,
  Button,
  Row,
  Col,
  Table,
  Progress,
  Divider,
  Space,
  Typography,
  Spin,
  message
} from 'antd'
import {
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
  WalletOutlined,
  TransactionOutlined
} from '@ant-design/icons'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { profileStore } from '../../store/profileStore'
import { request } from '../../util/request'
import config from '../../util/config'

const { Text } = Typography

const ProfileAccountingPage = () => {
  const { profile, setProfile } = profileStore()

  const [loading, setLoading] = useState(false)

  // Audit log pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  const [dashboardData, setDashboardData] = useState({
    income: '$0.00',
    expense: '$0.00',
    balance: '$0.00',
    transactions: '0',
    auditLogs: [],
    opexPercent: 0,
    salaryPercent: 0,
    permissions: []
  })

  // Reload data when page changes
  useEffect(() => {
    fetchDashboardStats(pagination.current)
  }, [pagination.current])

  const fetchDashboardStats = async (page = 1) => {
    setLoading(true)

    // Request dashboard data with pagination
    const res = await request(
      `profile/dashboard-stats?page=${page}&per_page=${pagination.pageSize}`,
      'GET'
    )

    setLoading(false)

    if (res && !res.error) {
      if (res.user) {
        setProfile(res.user, res.permissions || []);
      }
      setDashboardData({
        income: res.income || '$0.00',
        expense: res.expense || '$0.00',
        balance: res.balance || '$0.00',
        transactions: res.transactions || '0',
        auditLogs: res.audit_logs || [],
        opexPercent: res.opex_percent || 0,
        salaryPercent: res.salary_percent || 0,
        permissions: res.permissions || ['កត់ត្រាទិន្នន័យ', 'មើលរបាយការណ៍']
      })

      // Update pagination info
      if (res.audit_logs_pagination) {
        setPagination(prev => ({
          ...prev,
          current: res.audit_logs_pagination.current_page,
          total: res.audit_logs_pagination.total
        }))
      }
    } else {
      message.error(res?.errors?.message || 'មិនអាចទាញយកទិន្នន័យស្ថិតិបានទេ')
    }
  }

  // Handle table page change
  const handleTableChange = newPagination => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current
    }))
  }

  const financeStats = [
    {
      label: 'Total Income',
      value: dashboardData.income,
      icon: <ArrowUpOutlined />,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Total Expense',
      value: dashboardData.expense,
      icon: <ArrowDownOutlined />,
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
    {
      label: 'Current Balance',
      value: dashboardData.balance,
      icon: <WalletOutlined />,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50'
    },
    {
      label: 'Transactions',
      value: dashboardData.transactions,
      icon: <TransactionOutlined />,
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    }
  ]

  const auditColumns = [
    {
      title: 'សកម្មភាព',
      dataIndex: 'action',
      key: 'action',
      render: text => <Text strong>{text}</Text>
    },
    { title: 'ទិន្នន័យ', dataIndex: 'target', key: 'target' },
    {
      title: 'កាលបរិច្ឆេទ',
      dataIndex: 'time',
      key: 'time',
      render: time => <span className='text-slate-400'>{time}</span>
    }
  ]

  const getStatusTag = status => {
    const statusMap = {
      active: { label: 'សកម្ម', color: 'success' },
      inactive: { label: 'មិនសកម្ម', color: 'error' },
      draft: { label: 'ព្រាង', color: 'warning' }
    }

    const current = statusMap[status?.toLowerCase()] || {
      label: status || '—',
      color: 'default'
    }

    return (
      <Tag color={current.color} className='rounded-md border-none'>
        {current.label}
      </Tag>
    )
  }

  return (
    <div className='p-5 bg-gray-50 min-h-screen'>
      <div className='max-w-[1200px] mx-auto space-y-5'>
        {/* Profile Card */}
        <Card className='rounded-xl border-none shadow-sm overflow-hidden'>
          <div className='flex flex-col md:flex-row items-center gap-6 p-2'>
            <Avatar
              size={90}
              className='bg-indigo-600 text-2xl font-bold shadow-sm flex items-center justify-center'
              src={
                profile?.profile_image
                  ? config.image_path + profile.profile_image
                  : null
              }
            >
              {!profile?.profile_image &&
                (profile?.full_name ? profile.full_name.charAt(0) : 'U')}
            </Avatar>

            <div className='flex-1 text-center md:text-left'>
              <Space align='center'>
                <h1 className='text-2xl font-bold m-0'>
                  {profile?.full_name || '—'}
                </h1>
                {getStatusTag(profile?.status || 'active')}
              </Space>

              <p className='text-slate-500 m-0'>
                {profile?.role?.name || 'Senior Accountant'} •{' '}
                {
                  profile?.branch?.name || 'មិនទាន់មានសាខា'
                }
              </p>

              <div className='mt-3 flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 text-xs'>
                <span>
                  <MailOutlined /> {profile?.email || '—'}
                </span>

                <span>
                  <PhoneOutlined /> {profile?.phone || '—'}
                </span>

                <span>ID: {profile?.id || '—'}</span>
              </div>
            </div>

            <Link Link to='/profile-settings'>
              <Button
                type='primary'
                ghost
                icon={<EditOutlined />}
                className='rounded-lg'
              >
                កែប្រែព័ត៌មាន
              </Button>
            </Link>
          </div>
        </Card>

        {/* Finance Stats */}
        <Row gutter={[16, 16]}>
          {financeStats.map((item, index) => (
            <Col xs={12} lg={6} key={index}>
              <Card
                className='rounded-xl border-none shadow-sm'
                styles={{ body: { padding: '20px' } }}
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='text-slate-400 text-[11px] font-bold uppercase mb-1'>
                      {item.label}
                    </p>

                    <h2 className='text-xl font-bold m-0'>{item.value}</h2>
                  </div>

                  <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                    {item.icon}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Audit Logs & Budget */}
        <Row gutter={[16, 16]}>
          {/* Audit Log Table */}
          <Col xs={24} lg={15}>
            <Card
              title={
                <span className='text-sm font-bold'>
                  <HistoryOutlined /> សកម្មភាពថ្មីៗ (Audit Logs)
                </span>
              }
              className='rounded-xl border-none shadow-sm h-full'
            >
              <Table
                columns={auditColumns}
                dataSource={dashboardData.auditLogs}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  size: 'small',
                  showSizeChanger: false
                }}
                onChange={handleTableChange}
                size='small'
                loading={loading}
                locale={{ emptyText: 'មិនទាន់មានសកម្មភាពនៅឡើយទេ' }}
                rowKey={(record, index) => index}
              />
            </Card>
          </Col>

          {/* Budget & Permissions */}
          <Col xs={24} lg={9}>
            <Card
              title={
                <span className='text-sm font-bold'>
                  ស្ថានភាពថវិកា (Budget)
                </span>
              }
              className='rounded-xl border-none shadow-sm h-full'
            >
              <div className='space-y-5'>
                <div>
                  <div className='flex justify-between text-xs mb-2'>
                    <span>ចំណាយរដ្ឋបាល (OPEX)</span>
                    <span className='font-bold'>
                      {dashboardData.opexPercent}%
                    </span>
                  </div>

                  <Progress
                    percent={dashboardData.opexPercent}
                    strokeColor='#6366f1'
                    showInfo={false}
                    size='small'
                  />
                </div>

                <div>
                  <div className='flex justify-between text-xs mb-2'>
                    <span>ប្រាក់បៀវត្សបុគ្គលិក</span>
                    <span className='font-bold'>
                      {dashboardData.salaryPercent}%
                    </span>
                  </div>

                  <Progress
                    percent={dashboardData.salaryPercent}
                    strokeColor='#10b981'
                    showInfo={false}
                    size='small'
                  />
                </div>

                <Divider className='my-3' />

                <div className='bg-indigo-50 p-3 rounded-lg'>
                  <h4 className='text-xs font-bold text-indigo-700 mb-2'>
                    <SafetyCertificateOutlined /> System Permissions
                  </h4>

                  <div className='flex flex-wrap gap-1'>
                    {dashboardData.permissions.map((p, index) => (
                      <Tag
                        key={index}
                        className='text-[10px] bg-white border-indigo-100 text-indigo-600'
                      >
                        {p}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ProfileAccountingPage
