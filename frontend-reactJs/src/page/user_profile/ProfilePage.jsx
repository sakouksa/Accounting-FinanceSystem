import React from 'react'
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
  Space
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
const { Text } = Typography
import { Typography } from 'antd'
import { useLocation, useNavigate, Link } from 'react-router-dom'

const ProfileAccountingPage = () => {
  const user = {
    user_id: 101,
    full_name: 'សាក់ ឧស្សាហ៍',
    role_name: 'Senior Accountant',
    email: 'oussa.sak@finance.com',
    phone: '096 123 4567',
    status: 'Active',
    avatar_initial: 'ស'
  }

  const financeStats = [
    {
      label: 'Total Income',
      value: '$45,200',
      icon: <ArrowUpOutlined />,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Total Expense',
      value: '$12,850',
      icon: <ArrowDownOutlined />,
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
    {
      label: 'Current Balance',
      value: '$32,350',
      icon: <WalletOutlined />,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50'
    },
    {
      label: 'Transactions',
      value: '1,240',
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

  const auditData = [
    { key: '1', action: 'កត់ត្រាចំណូល', target: 'Inv-0024', time: '14:20 PM' },
    { key: '2', action: 'កែប្រែចំណាយ', target: 'Exp-0012', time: '10:15 AM' },
    {
      key: '3',
      action: 'បង្កើតរបាយការណ៍',
      target: 'Q1_Report',
      time: 'ម្សិលមិញ'
    }
  ]

  return (
    <div className='p-5 bg-gray-50 min-h-screen'>
      <div className='max-w-[1200px] mx-auto space-y-5'>
        <Card className='rounded-xl border-none shadow-sm overflow-hidden'>
          <div className='flex flex-col md:flex-row items-center gap-6 p-2'>
            <Avatar
              size={90}
              className='bg-indigo-600 text-2xl font-bold shadow-sm'
            >
              {user.avatar_initial}
            </Avatar>
            <div className='flex-1 text-center md:text-left'>
              <Space align='center'>
                <h1 className='text-2xl font-bold m-0'>{user.full_name}</h1>
                <Tag color='green' className='rounded-md border-none'>
                  សកម្ម
                </Tag>
              </Space>
              <p className='text-slate-500 m-0'>
                {user.role_name} • ផ្នែកគណនេយ្យ
              </p>
              <div className='mt-3 flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 text-xs'>
                <span>
                  <MailOutlined /> {user.email}
                </span>
                <span>
                  <PhoneOutlined /> {user.phone}
                </span>
                <span>ID: {user.user_id}</span>
              </div>
            </div>
            <Link to='/settings'>
              <Button
                type='primary'
                ghost
                icon={<EditOutlined />}
                className='rounded-lg'
              >កែប្រែព័ត៌មាន</Button>
            </Link>
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          {financeStats.map((item, index) => (
            <Col xs={12} lg={6} key={index}>
              <Card
                className='rounded-xl border-none shadow-sm'
                bodyStyle={{ padding: '20px' }}
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

        <Row gutter={[16, 16]}>
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
                dataSource={auditData}
                pagination={false}
                size='small'
              />
            </Card>
          </Col>

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
                    <span className='font-bold'>75%</span>
                  </div>
                  <Progress
                    percent={75}
                    strokeColor='#6366f1'
                    showInfo={false}
                    size='small'
                  />
                </div>
                <div>
                  <div className='flex justify-between text-xs mb-2'>
                    <span>ប្រាក់បៀវត្សបុគ្គលិក</span>
                    <span className='font-bold'>92%</span>
                  </div>
                  <Progress
                    percent={92}
                    strokeColor='#10b981'
                    showInfo={false}
                    size='small'
                  />
                </div>
                <Divider className='my-3' />
                <div className='bg-indigo-50 p-3 rounded-lg'>
                  <h4 className='text-xs font-bold text-indigo-700 mb-2'>
                    <SafetyCertificateOutlined /> សិទ្ធិប្រើប្រាស់ប្រព័ន្ធ
                  </h4>
                  <div className='flex flex-wrap gap-1'>
                    {['កត់ត្រាទិន្នន័យ', 'មើលរបាយការណ៍', 'អនុម័តការទូទាត់'].map(
                      p => (
                        <Tag
                          key={p}
                          className='text-[10px] bg-white border-indigo-100'
                        >
                          {p}
                        </Tag>
                      )
                    )}
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
