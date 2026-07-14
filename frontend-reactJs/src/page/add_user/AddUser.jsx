import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Radio,
  Checkbox,
  Button,
  Divider,
  message,
  Select,
  Row,
  Col
} from 'antd'
import { request } from '../../util/request'
import MainPage from '../../components/layout/MainPage'

const AddUser = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [roleType, setRoleType] = useState('default')
  const [selectedDefaultRole, setSelectedDefaultRole] = useState(null)
  const [defaultRoles, setDefaultRoles] = useState([])
  const [customPermissions, setCustomPermissions] = useState([])
  const [customSelectedModules, setCustomSelectedModules] = useState({})
  const [branches, setBranches] = useState([])
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [rolesRes, permsRes, branchesRes] = await Promise.all([
          request('default-roles', 'GET'),
          request('users/all-permissions', 'GET'),
          request('branches-list', 'GET')
        ])

        if (rolesRes.roles?.length > 0) {
          setDefaultRoles(rolesRes.roles)
          setSelectedDefaultRole(rolesRes.roles[0].id)
        }
        if (branchesRes) {
          setBranches(
            Array.isArray(branchesRes) ? branchesRes : branchesRes.data || []
          )
        } else {
          setBranches([])
        }
        if (permsRes.permissions) {
          const formatted = Object.keys(permsRes.permissions).map(key => ({
            key: key,
            name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            actions: {
              create: false,
              read: false,
              update: false,
              delete: false
            }
          }))
          setCustomPermissions(formatted)
        }
      } catch (err) {
        message.error('មិនអាចទាញទិន្នន័យ!')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const onFinish = async values => {
    setSubmitting(true)

    const payload = {
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      gender: values.gender,
      username: values.username,
      password: values.password,
      branch_id: values.branch_id,
      role_type: roleType,
      ...(roleType === 'default'
        ? {
            role_id: selectedDefaultRole
          }
        : {
            permissions: customPermissions.filter(
              m => customSelectedModules[m.key]
            )
          })
    }

    try {
      const res = await request('users', 'POST', payload)
      if (res.success || res.data?.success) {
        message.success('បង្កើត User ជោគជ័យ!')
        form.resetFields()
      } else {
        message.error(res.message || 'បរាជ័យ')
      }
    } catch (err) {
      console.error(err)
      message.error('Server Error: សូមពិនិត្យមើល Console')
    } finally {
      setSubmitting(false)
    }
  }
  const handleCustomModuleRowToggle = (key, checked) => {
    setCustomSelectedModules(prev => ({ ...prev, [key]: checked }))
    setCustomPermissions(prev =>
      prev.map(mod =>
        mod.key === key
          ? {
              ...mod,
              actions: {
                create: checked,
                read: checked,
                update: checked,
                delete: checked
              }
            }
          : mod
      )
    )
  }

  const handleCustomActionToggle = (moduleKey, action, checked) => {
    setCustomPermissions(prev =>
      prev.map(mod => {
        if (mod.key === moduleKey) {
          const newActions = { ...mod.actions, [action]: checked }
          setCustomSelectedModules(p => ({
            ...p,
            [moduleKey]: Object.values(newActions).some(v => v)
          }))
          return { ...mod, actions: newActions }
        }
        return mod
      })
    )
  }

  const renderDefaultRoles = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {defaultRoles.map(role => (
        <div
          key={role.id}
          onClick={() => setSelectedDefaultRole(role.id)}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedDefaultRole === role.id
              ? 'border-black bg-[#fafafa]'
              : 'border-gray-200'
          }`}
        >
          <h3 className='font-bold'>{role.name}</h3>
          <p className='text-xs text-gray-500'>{role.description}</p>
        </div>
      ))}
    </div>
  )

  const renderCustomPermissions = () => (
    <div className='overflow-x-auto border rounded-lg'>
      <table className='w-full text-xs'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='p-3 text-left'>ម៉ូឌុល</th>
            {['បង្កើត', 'អាន', 'កែសម្រួល', 'លុប'].map(h => (
              <th key={h} className='p-3 text-center'>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customPermissions.map(row => (
            <tr key={row.key} className='border-t'>
              <td className='p-3'>
                <Checkbox
                  checked={!!customSelectedModules[row.key]}
                  onChange={e =>
                    handleCustomModuleRowToggle(row.key, e.target.checked)
                  }
                >
                  {row.name}
                </Checkbox>
              </td>
              {['create', 'read', 'update', 'delete'].map(act => (
                <td key={act} className='text-center'>
                  <Checkbox
                    checked={row.actions[act]}
                    onChange={e =>
                      handleCustomActionToggle(row.key, act, e.target.checked)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <MainPage loading={loading}>
      <div className='bg-[#f8f9fa] min-h-screen p-6'>
        <div className='max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-8'>
          <h1 className='text-xl font-bold mb-6'>បន្ថែមអ្នកប្រើប្រាស់</h1>

          <Form form={form} layout='vertical' onFinish={onFinish}>
            {/* ព័ត៌មានអ្នកប្រើប្រាស់ */}
            <Row gutter={[24, 0]}>
              <Col span={12}>
                <Form.Item
                  name='full_name'
                  label='ឈ្មោះពេញ'
                  rules={[{ required: true }]}
                >
                  <Input className='h-10' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='email'
                  label='អ៊ីមែល'
                  rules={[{ required: true }]}
                >
                  <Input className='h-10' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='username'
                  label='ឈ្មោះអ្នកប្រើប្រាស់'
                  rules={[{ required: true }]}
                >
                  <Input className='h-10' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='password'
                  label='លេខសម្ងាត់'
                  rules={[{ required: true }]}
                >
                  <Input.Password className='h-10' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='gender' label='ភេទ'>
                  <Radio.Group>
                    <Radio value='male'>ប្រុស</Radio>
                    <Radio value='female'>ស្រី</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='branch_id'
                  label='សាខា'
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder='ជ្រើសរើសសាខា'
                    className='h-10'
                    allowClear
                  >
                    {branches?.map(b => (
                      <Select.Option key={b.id} value={b.id}>
                        {b.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='phone' label='លេខទូរស័ព្ទ'>
                  <Input className='h-10' />
                </Form.Item>
              </Col>
            </Row>

            <Divider className='my-6' />

            {/* តួនាទី និងសិទ្ធិ */}
            <div className='mb-6'>
              <h2 className='text-sm font-semibold mb-4'>
                តួនាទី & សិទ្ធិប្រើប្រាស់
              </h2>
              <Radio.Group
                value={roleType}
                onChange={e => setRoleType(e.target.value)}
                className='mb-4'
              >
                <Radio.Button value='default'>តួនាទីស្តង់ដារ</Radio.Button>
                <Radio.Button value='custom'>
                  កំណត់តួនាទីផ្ទាល់ខ្លួន
                </Radio.Button>
              </Radio.Group>

              <div className='mt-2'>
                {roleType === 'default'
                  ? renderDefaultRoles()
                  : renderCustomPermissions()}
              </div>
            </div>

            <div className='flex justify-end gap-3 pt-4 border-t'>
              <Button onClick={() => form.resetFields()}>បោះបង់</Button>
              <Button
                type='primary'
                htmlType='submit'
                loading={submitting}
                className='bg-black'
              >
                រក្សាទុកអ្នកប្រើប្រាស់
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </MainPage>
  )
}

export default AddUser
