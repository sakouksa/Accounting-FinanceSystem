import React, { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Typography,
  Avatar,
  Divider,
  Tag,
  Space,
  message
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
  CameraOutlined,
  IdcardOutlined,
  CalendarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useLocation, useNavigate, Link } from 'react-router-dom'

const { Title, Text } = Typography
const { Option } = Select

const UserProfileSetting = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const userData = {
    user_id: 101,
    role_id: 2,
    full_name: 'សាក់ ឧស្សាហ៍',
    gender: 'Male',
    phone: '012 345 678',
    email: 'oussa.account@example.com',
    username: 'oussa_admin',
    password: '*************', // លាក់ទុក
    status: 'Active',
    remember_token: 'tkn_882199',
    created_at: '2024-01-10 08:30:00',
    updated_at: '2024-05-07 14:20:00'
  }

  // មុខងារទាញយកអក្សរដំបូងនៃឈ្មោះ (ឧទាហរណ៍៖ "ស" ពី "សាក់")
  const getInitial = name =>
    name ? name.charAt(0).toUpperCase() : <UserOutlined />

  const onFinish = values => {
    setLoading(true)
    // បញ្ជូន values ទៅកាន់ Backend តាមរយៈ user_id
    console.log('កែសម្រួល User ID:', userData.user_id, 'ទិន្នន័យថ្មី:', values)

    setTimeout(() => {
      message.success('ព័ត៌មានត្រូវបានរក្សាទុកដោយជោគជ័យ!')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className='p-6 bg-gray-50 min-h-screen flex justify-center items-start'>
      <Card className='w-full max-w-4xl shadow-sm rounded-lg border-none'>
        <Row gutter={[40, 32]}>
          {/* ផ្នែកខាងឆ្វេង៖ រូបភាពអក្សរតំណាង និងព័ត៌មានប្រព័ន្ធ */}
          <Col xs={24} md={8} className='text-center border-r border-gray-100'>
            <div className='relative inline-block mb-4'>
              <Avatar
                size={110}
                className='bg-indigo-600 text-white text-4xl flex items-center justify-center border-4 border-white shadow-sm'
              >
                {getInitial(userData.full_name)}
              </Avatar>
              <Button
                type='primary'
                shape='circle'
                size='small'
                icon={<CameraOutlined />}
                className='absolute bottom-1 right-1 border-2 border-white shadow-md'
              />
            </div>

            <Title level={4} className='mb-0'>
              {userData.full_name}
            </Title>
            <Text type='secondary' className='block mb-3'>
              @{userData.username}
            </Text>

            <Tag
              color={userData.status === 'Active' ? 'green' : 'red'}
              icon={<CheckCircleOutlined />}
            >
              {userData.status}
            </Tag>

            <div className='mt-8 text-left bg-gray-50 p-4 rounded-lg'>
              <Space
                direction='vertical'
                size={12}
                className='w-full text-[13px]'
              >
                <div>
                  <Text type='secondary'>
                    <IdcardOutlined /> លេខសម្គាល់ (ID):
                  </Text>
                  <Text strong className='float-right'>
                    {userData.user_id}
                  </Text>
                </div>
                <div>
                  <Text type='secondary'>
                    <CalendarOutlined /> ថ្ងៃបង្កើត:
                  </Text>
                  <Text strong className='float-right'>
                    {userData.created_at.split(' ')[0]}
                  </Text>
                </div>
              </Space>
            </div>
          </Col>

          {/* ផ្នែកខាងស្តាំ៖ Form កែប្រែទិន្នន័យតាម Field Database */}
          <Col xs={24} md={16}>
            <Title level={4} className='mb-6'>
              គ្រប់គ្រងកម្រងព័ត៌មាន
            </Title>

            <Form
              form={form}
              layout='vertical'
              initialValues={userData}
              onFinish={onFinish}
              requiredMark={false}
            >
              <Row gutter={20}>
                <Col span={24}>
                  <Form.Item
                    label='ឈ្មោះពេញ (full_name)'
                    name='full_name'
                    rules={[{ required: true }]}
                  >
                    <Input placeholder='បញ្ចូលឈ្មោះពេញ' />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label='អ៊ីមែល (email)'
                    name='email'
                    rules={[{ type: 'email' }]}
                  >
                    <Input
                      prefix={<MailOutlined className='text-gray-400' />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='លេខទូរស័ព្ទ (phone)' name='phone'>
                    <Input
                      prefix={<PhoneOutlined className='text-gray-400' />}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label='ឈ្មោះប្រើប្រាស់ (username)' name='username'>
                    <Input disabled className='bg-gray-50 font-mono' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='ភេទ (gender)' name='gender'>
                    <Select>
                      <Option value='Male'>ប្រុស (Male)</Option>
                      <Option value='Female'>ស្រី (Female)</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label='តួនាទី (role_id)' name='role_id'>
                    <Select disabled>
                      <Option value={1}>Admin</Option>
                      <Option value={2}>Accountant</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='ស្ថានភាព (status)' name='status'>
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <div className='flex justify-between items-center bg-yellow-50 p-4 rounded-lg'>
                <Text type='secondary' className='text-[12px]'>
                  កែប្រែចុងក្រោយ៖ {userData.updated_at}
                </Text>
                <Button
                  type='primary'
                  htmlType='submit'
                  icon={<SaveOutlined />}
                  loading={loading}
                  className='bg-indigo-600 px-10 h-[40px] rounded-md'
                >
                  រក្សាទុក
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default UserProfileSetting
