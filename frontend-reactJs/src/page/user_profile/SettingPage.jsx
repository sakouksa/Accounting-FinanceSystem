import React, { useState, useEffect } from 'react'
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
  Upload,
  message,
  Modal,
  Tabs
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
  CameraOutlined,
  IdcardOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  EyeOutlined,
  KeyOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { request } from '../../util/request'
import config from '../../util/config'
import { usePreviewStore } from '../../store/previewStore'
import { profileStore } from '../../store/profileStore'
import { dateClient } from '../../util/helper'
import MainPage from '../../components/layout/MainPage'

const { Title, Text } = Typography
const { Option } = Select

const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

const UserProfileSetting = () => {
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [userData, setUserData] = useState(null)
  const [activeTab, setActiveTab] = useState('1')

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const navigate = useNavigate()
  const { open, imgUrl, handleOpenPreview, handleClosePreview } =
    usePreviewStore()
  const { setProfile } = profileStore()

  useEffect(() => {
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    setFetching(true)
    const res = await request('profile/getProfile', 'GET')
    setFetching(false)

    if (res && !res.error) {
      setUserData(res.data)
      profileForm.setFieldsValue({
        full_name: res.data.full_name,
        email: res.data.email,
        phone: res.data.phone,
        username: res.data.username,
        gender: res.data.gender
      })
      if (res.data.profile_image) {
        setImagePreview(config.image_path + res.data.profile_image)
      }
    } else {
      message.error('មិនអាចទាញយកទិន្នន័យគណនីបានទេ!')
    }
  }

  const getInitial = name =>
    name ? name.charAt(0).toUpperCase() : <UserOutlined />

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj || file)
    }
    handleOpenPreview(file.url || file.preview)
  }

  const handleImageChange = async file => {
    if (file) {
      setImageFile(file)
      try {
        const base64Url = await getBase64(file)
        setImagePreview(base64Url)
      } catch (error) {
        message.error('មិនអាចបង្កើតរូបភាព Preview បានទេ!')
      }
    }
  }

  // ១. មុខងាររក្សាទុកព័ត៌មានទូទៅ (Profile Update)
  const onProfileFinish = async values => {
    setLoading(true)
    const formData = new FormData()
    formData.append('full_name', values.full_name)
    formData.append('email', values.email)
    formData.append('gender', values.gender || '')
    formData.append('phone', values.phone || '')

    if (imageFile) {
      formData.append('profile_image', imageFile)
    }

    const res = await request('profile/update', 'POST', formData)
    setLoading(false)

    if (res && !res.error) {
      message.success(
        res.message || 'ព័ត៌មានផ្ទាល់ខ្លួនត្រូវបានកែប្រែដោយជោគជ័យ!'
      )
      setImageFile(null)
      if (res.data) setProfile(res.data)
      getCurrentUser()
    } else {
      handleErrors(res)
    }
  }

  // ២. មុខងារប្តូរពាក្យសម្ងាត់ (Password Update)
  const onPasswordFinish = async values => {
    setLoading(true)
    const formData = new FormData()

    formData.append('full_name', userData.full_name)
    formData.append('email', userData.email)
    formData.append('gender', userData.gender || '')
    formData.append('phone', userData.phone || '')

    formData.append('current_password', values.current_password)
    formData.append('password', values.password)

    const res = await request('profile/update', 'POST', formData)
    setLoading(false)

    if (res && !res.error) {
      message.success('ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!')
      passwordForm.resetFields()
    } else {
      handleErrors(res)
    }
  }

  const handleErrors = res => {
    if (res && res.errors) {
      const errorMsg = Object.values(res.errors).flat().join(', ')
      message.error(errorMsg)
    } else {
      message.error(res?.message || 'ការកែប្រែទិន្នន័យមានកំហុសឆ្គង!')
    }
  }

  if (!userData && fetching) {
    return (
      <div className='p-6 text-center'>
        <Text type='secondary'>កំពុងទាញយកទិន្នន័យ...</Text>
      </div>
    )
  }

  return (
    <MainPage loading={loading}>
      <div className='p-6 bg-gray-50 min-h-screen flex flex-col justify-start items-center'>
        <div className='w-full max-w-5xl space-y-4'>
          {/* ប៊ូតុងត្រឡប់ក្រោយ */}
          <div className='flex justify-start'>
            <Button
              type='text'
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className='text-slate-600 hover:text-indigo-600 font-medium p-0 flex items-center gap-1'
            >
              ត្រឡប់ក្រោយ
            </Button>
          </div>

          <Row gutter={[24, 24]}>
            {/* ផ្នែកខាងឆ្វេង៖ រូបភាពព័ត៌មានសង្ខេប (Side Card) */}
            <Col xs={24} md={8}>
              <Card className='w-full shadow-sm rounded-lg border-none text-center sticky top-20'>
                <div className='relative inline-block mb-4 group'>
                  <div
                    className='absolute inset-0 bg-black/40 rounded-full z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer'
                    onClick={() => {
                      if (imageFile) handlePreview({ originFileObj: imageFile })
                      else if (imagePreview)
                        handlePreview({ url: imagePreview })
                    }}
                  >
                    <EyeOutlined className='text-white text-xl' />
                  </div>

                  <Avatar
                    size={110}
                    src={imagePreview}
                    className='bg-indigo-600 text-white text-4xl flex items-center justify-center border-4 border-white shadow-sm'
                  >
                    {!imagePreview && getInitial(userData?.full_name)}
                  </Avatar>

                  <Upload
                    accept='image/*'
                    showUploadList={false}
                    beforeUpload={file => {
                      handleImageChange(file)
                      return false
                    }}
                  >
                    <Button
                      type='primary'
                      shape='circle'
                      size='small'
                      icon={<CameraOutlined />}
                      className='absolute bottom-1 right-1 border-2 border-white shadow-md z-20 hover:scale-105 transition-transform'
                    />
                  </Upload>
                </div>

                <Title level={4} className='mb-0'>
                  {userData?.full_name || '—'}
                </Title>
                <Text type='secondary' className='block mb-3'>
                  @{userData?.username || '—'}
                </Text>

                <Tag
                  color={userData?.status === 'active' ? 'green' : 'red'}
                  icon={<CheckCircleOutlined />}
                  className='rounded-md border-none uppercase text-[11px] mb-4'
                >
                  {userData?.status || 'inactive'}
                </Tag>

                <Divider className='my-3' />

                <div className='text-left bg-gray-50 p-4 rounded-lg space-y-3 text-[13px]'>
                  <div>
                    <Text type='secondary'>
                      <IdcardOutlined /> លេខសម្គាល់ (ID):
                    </Text>
                    <Text strong className='float-right'>
                      {userData?.id || '—'}
                    </Text>
                  </div>
                  <div>
                    <Text type='secondary'>
                      <UserOutlined /> តួនាទី (Role ID):
                    </Text>
                    <Text strong className='float-right'>
                      {userData?.role_id || '—'}
                    </Text>
                  </div>
                  <div>
                    <Text type='secondary'>
                      <CalendarOutlined /> ថ្ងៃបង្កើត:
                    </Text>
                    <Text strong className='float-right'>
                      {userData?.created_at
                        ? dateClient(userData.created_at)
                        : '—'}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>

            {/* ផ្នែកខាងស្តាំ៖ Tabs បែងចែក Form ជា ២ Blog */}
            <Col xs={24} md={16}>
              <Card
                className='w-full shadow-sm rounded-lg border-none'
                styles={{ body: { padding: '24px' } }}
              >
                <Tabs
                  activeKey={activeTab}
                  onChange={key => setActiveTab(key)}
                  type='card'
                  items={[
                    {
                      key: '1',
                      label: (
                        <span className='px-2 flex items-center gap-2'>
                          <UserOutlined /> ព័ត៌មានផ្ទាល់ខ្លួន
                        </span>
                      ),
                      children: (
                        <Form
                          form={profileForm}
                          layout='vertical'
                          onFinish={onProfileFinish}
                          requiredMark={false}
                        >
                          <Title level={4} className='mb-6 text-slate-700'>
                            កែប្រែព័ត៌មានគណនី
                          </Title>
                          <Row gutter={16}>
                            <Col span={24}>
                              <Form.Item
                                label='ឈ្មោះពេញ (Full Name)'
                                name='full_name'
                                rules={[
                                  {
                                    required: true,
                                    message: 'សូមបញ្ចូលឈ្មោះពេញ!'
                                  }
                                ]}
                              >
                                <Input placeholder='បញ្ចូលឈ្មោះពេញ' />
                              </Form.Item>
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                label='អ៊ីមែល (Email)'
                                name='email'
                                rules={[
                                  {
                                    required: true,
                                    message: 'សូមបញ្ចូលអ៊ីមែល!'
                                  },
                                  {
                                    type: 'email',
                                    message: 'ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ!'
                                  }
                                ]}
                              >
                                <Input
                                  prefix={
                                    <MailOutlined className='text-gray-400' />
                                  }
                                />
                              </Form.Item>
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                label='លេខទូរស័ព្ទ (Phone)'
                                name='phone'
                              >
                                <Input
                                  prefix={
                                    <PhoneOutlined className='text-gray-400' />
                                  }
                                  placeholder='បញ្ចូលលេខទូរស័ព្ទ'
                                />
                              </Form.Item>
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                label='ឈ្មោះប្រើប្រាស់ (Username)'
                                name='username'
                              >
                                <Input
                                  disabled
                                  className='bg-gray-100 text-gray-500'
                                />
                              </Form.Item>
                            </Col>

                            <Col span={12}>
                              <Form.Item label='ភេទ (Gender)' name='gender'>
                                <Select placeholder='ជ្រើសរើសភេទ'>
                                  <Option value='male'>ប្រុស (Male)</Option>
                                  <Option value='female'>ស្រី (Female)</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Divider />
                          <div className='flex justify-between items-center bg-gray-50 p-4 rounded-lg'>
                            <Text type='secondary' className='text-[12px]'>
                              កែប្រែចុងក្រោយ៖{' '}
                              {userData?.updated_at
                                ? dateClient(userData.updated_at)
                                : '—'}
                            </Text>
                            <Button
                              type='primary'
                              htmlType='submit'
                              icon={<SaveOutlined />}
                              className='bg-indigo-600 hover:bg-indigo-700 px-8 h-[40px] rounded-md border-none'
                            >
                              រក្សាទុកព័ត៌មាន
                            </Button>
                          </div>
                        </Form>
                      )
                    },
                    {
                      key: '2',
                      label: (
                        <span className='px-2 flex items-center gap-2'>
                          <KeyOutlined /> ផ្លាស់ប្តូរពាក្យសម្ងាត់
                        </span>
                      ),
                      children: (
                        <Form
                          form={passwordForm}
                          layout='vertical'
                          onFinish={onPasswordFinish}
                          requiredMark={false}
                        >
                          <Title level={4} className='mb-6 text-slate-700'>
                            សុវត្ថិភាពគណនី
                          </Title>

                          <Row gutter={16}>
                            <Col span={24}>
                              <Form.Item
                                label='ពាក្យសម្ងាត់ចាស់ (Current Password)'
                                name='current_password'
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      'សូមបញ្ចូលពាក្យសម្ងាត់ចាស់ដើម្បីផ្ទៀងផ្ទាត់!'
                                  }
                                ]}
                              >
                                <Input.Password
                                  prefix={
                                    <LockOutlined className='text-gray-400' />
                                  }
                                  placeholder='បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្នរបស់អ្នក'
                                />
                              </Form.Item>
                            </Col>

                            <Col span={24}>
                              <Form.Item
                                label='ពាក្យសម្ងាត់ថ្មី (New Password)'
                                name='password'
                                rules={[
                                  {
                                    required: true,
                                    message: 'សូមបញ្ចូលពាក្យសម្ងាត់ថ្មី!'
                                  },
                                  {
                                    min: 6,
                                    message:
                                      'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ ៦ ខ្ទង់!'
                                  }
                                ]}
                              >
                                <Input.Password
                                  prefix={
                                    <LockOutlined className='text-gray-400' />
                                  }
                                  placeholder='បញ្ចូលពាក្យសម្ងាត់ថ្មីដែលចង់ផ្លាស់ប្តូរ'
                                />
                              </Form.Item>
                            </Col>

                            <Col span={24}>
                              <Form.Item
                                label='បញ្ជាក់ពាក្យសម្ងាត់ថ្មី (Confirm New Password)'
                                name='confirm_password'
                                dependencies={['password']}
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      'សូមបញ្ចូលការបញ្ជាក់ពាក្យសម្ងាត់ថ្មី!'
                                  },
                                  ({ getFieldValue }) => ({
                                    validator (_, value) {
                                      if (
                                        !value ||
                                        getFieldValue('password') === value
                                      ) {
                                        return Promise.resolve()
                                      }
                                      return Promise.reject(
                                        new Error(
                                          'ពាក្យសម្ងាត់ថ្មីទាំងពីរមិនស៊ីសង្វាក់គ្នាឡើយ!'
                                        )
                                      )
                                    }
                                  })
                                ]}
                              >
                                <Input.Password
                                  prefix={
                                    <LockOutlined className='text-gray-400' />
                                  }
                                  placeholder='វាយពាក្យសម្ងាត់ថ្មីម្តងទៀត'
                                />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Divider />
                          <div className='flex justify-end bg-gray-50 p-4 rounded-lg'>
                            <Button
                              type='primary'
                              htmlType='submit'
                              icon={<SaveOutlined />}
                              className='bg-red-500 hover:bg-red-600 px-8 h-[40px] rounded-md border-none'
                            >
                              ផ្លាស់ប្តូរពាក្យសម្ងាត់
                            </Button>
                          </div>
                        </Form>
                      )
                    }
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <Modal
          open={open}
          title='មើលរូបភាពកម្រងព័ត៌មាន'
          footer={null}
          onCancel={handleClosePreview}
          centered
        >
          <img
            alt='Profile Preview'
            className='w-full h-auto rounded-lg'
            src={imgUrl}
          />
        </Modal>
      </div>
    </MainPage>
  )
}

export default UserProfileSetting
