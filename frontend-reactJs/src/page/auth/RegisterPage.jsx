import React, { useState } from 'react'
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { Button, Form, Input, message, Upload, Image, Select } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { request } from '../../util/request'
import TextArea from 'antd/es/input/TextArea'

const { Option } = Select

const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

const RegisterPage = () => {
  const navigate = useNavigate()
  const [fileList, setFileList] = useState([])
  const [errors, setErrors] = useState({})

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      <PlusOutlined className='text-gray-400 text-lg' />
      <div className='mt-2 text-xs text-gray-500'>ផ្ទុកឡើង</div>
    </button>
  )

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
  }

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1))
  }

  const onFinish = async values => {
    try {
      const formData = new FormData();

      formData.append('full_name', values.full_name);
      formData.append('gender', values.gender || '');
      formData.append('phone', values.phone);
      formData.append('email', values.email);
      formData.append('username', values.username || '');
      formData.append('password', values.password);
      formData.append(
        'password_confirmation',
        values.password_confirmation
      );

      if (fileList.length > 0) {
        formData.append(
          'profile_image',
          fileList[0].originFileObj
        );
      }

      const res = await request('register', 'post', formData);

      if (!res.error) {
        message.success('ការចុះឈ្មោះបានជោគជ័យ!');
        navigate('/login');
      } else {
        setErrors(res.errors || {});
        message.error(res.errors?.message || 'មានបញ្ហា!');
      }
    } catch (err) {
      console.log(err);

      message.error('Server Error');
    }
  };
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-xl'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          ចុះឈ្មោះបង្កើតគណនី
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          សូមបំពេញព័ត៌មានខាងក្រោមដើម្បីបង្កើតគណនីថ្មី
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-xl'>
        <div className='bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10 border border-gray-200'>
          <Form
            name='register'
            onFinish={onFinish}
            layout='vertical'
            requiredMark='optional'
          >
            {/* Full Name + Email */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4'>
              <Form.Item
                name='full_name'
                label='ឈ្មោះពេញ'
                rules={[
                  {
                    required: true,
                    message: 'សូមបញ្ចូលឈ្មោះ!'
                  }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder='ឈ្មោះពេញ'
                  size='large'
                />
              </Form.Item>

              <Form.Item
                name='email'
                label='អ៊ីមែល'
                rules={[
                  {
                    required: true,
                    message: 'សូមបញ្ចូលអ៊ីមែល!'
                  },
                  {
                    type: 'email',
                    message: 'អ៊ីមែលមិនត្រឹមត្រូវ!'
                  }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder='អ៊ីមែល'
                  size='large'
                />
              </Form.Item>
            </div>

            {/* Phone + Username */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4'>
              <Form.Item
                name='phone'
                label='លេខទូរស័ព្ទ'
                rules={[
                  {
                    required: true,
                    message: 'សូមបញ្ចូលលេខទូរស័ព្ទ!'
                  }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder='012345678'
                  size='large'
                />
              </Form.Item>

              <Form.Item name='username' label='ឈ្មោះគណនី'>
                <Input
                  prefix={<UserOutlined />}
                  placeholder='username'
                  size='large'
                />
              </Form.Item>
            </div>

            {/* Gender */}
            <Form.Item name='gender' label='ភេទ'>
              <Select size='large' placeholder='ជ្រើសរើសភេទ'>
                <Option value='male'>ប្រុស</Option>
                <Option value='female'>ស្រី</Option>
              </Select>
            </Form.Item>

            {/* Password */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4'>
              <Form.Item
                name='password'
                label='លេខសម្ងាត់'
                rules={[
                  {
                    required: true,
                    message: 'សូមបញ្ចូលលេខសម្ងាត់!'
                  }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder='លេខសម្ងាត់'
                  size='large'
                />
              </Form.Item>

              <Form.Item
                name='password_confirmation'
                label='បញ្ជាក់លេខសម្ងាត់'
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: 'សូមបញ្ជាក់លេខសម្ងាត់!'
                  },

                  ({ getFieldValue }) => ({
                    validator (_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }

                      return Promise.reject(
                        new Error('លេខសម្ងាត់មិនត្រូវគ្នា!')
                      )
                    }
                  })
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder='បញ្ជាក់លេខសម្ងាត់'
                  size='large'
                />
              </Form.Item>
            </div>

            {/* Address */}
            <Form.Item name='address' label='អាសយដ្ឋាន'>
              <TextArea
                rows={3}
                placeholder='ភូមិ/ឃុំ/ស្រុក/ខេត្ត'
                maxLength={200}
                showCount
              />
            </Form.Item>

            {/* Upload Image */}
            <Form.Item label='រូបភាពគណនី'>
              <Upload
                customRequest={({ onSuccess }) => onSuccess('ok')}
                listType='picture-circle'
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>

              {previewImage && (
                <Image
                  wrapperStyle={{
                    display: 'none'
                  }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: visible => setPreviewOpen(visible),

                    afterOpenChange: visible => !visible && setPreviewImage('')
                  }}
                  src={previewImage}
                />
              )}
            </Form.Item>

            {/* Submit */}
            <Form.Item className='mt-6 mb-0'>
              <Button
                type='primary'
                htmlType='submit'
                size='large'
                block
                className='bg-indigo-600 hover:bg-indigo-700 border-none h-11'
              >
                ចុះឈ្មោះឥឡូវនេះ
              </Button>

              <div className='mt-6 text-center text-sm text-gray-600'>
                មានគណនីរួចហើយមែនទេ?{' '}
                <Link
                  to='/login'
                  className='font-medium text-indigo-600 hover:text-indigo-500'
                >
                  ចូលប្រើប្រាស់
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
