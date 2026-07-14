import React from 'react'
import { Drawer, Form, Input, Radio, Select, Button, Card, Row, Col, Space } from 'antd'
import { SaveOutlined, UserOutlined, ApartmentOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import PermissionSelector from './PermissionSelector'

function UserDrawer ({
  open,
  onClose,
  form,
  onFinish,
  validate = {},
  loading,
  selectedUserId,
  branches = [],
  defaultRoles = [],
  roleType = 'default',
  setRoleType,
  customPermissions = [],
  customSelectedModules = {},
  onPermissionChange
}) {
  const isEdit = !!selectedUserId

  return (
    <Drawer
      title={
        <div className="py-1">
          <span className="text-base font-bold text-gray-800">
            {isEdit ? 'កែប្រែព័ត៌មានអ្នកប្រើប្រាស់ (Edit User)' : 'បង្កើតអ្នកប្រើប្រាស់ថ្មី (Create User)'}
          </span>
          <p className="text-xs font-normal text-gray-400 m-0 mt-0.5">
            {isEdit ? 'ធ្វើបច្ចុប្បន្នភាពព័ត៌មានគណនីបុគ្គលិក' : 'បំពេញព័ត៌មានខាងក្រោមដើម្បីបង្កើតគណនីថ្មី'}
          </p>
        </div>
      }
      placement="right"
      width={window.innerWidth > 640 ? 600 : '100%'}
      onClose={onClose}
      open={open}
      maskClosable={!loading}
      keyboard={!loading}
      styles={{
        header: {
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 20px'
        },
        body: {
          padding: '20px',
          background: '#f9fafb'
        },
        footer: {
          borderTop: '1px solid #e5e7eb',
          padding: '12px 20px',
          background: '#ffffff'
        }
      }}
      footer={
        <div className="flex justify-end">
          <Space size="small">
            <Button
              disabled={loading}
              onClick={onClose}
              className="rounded-lg px-4 border-gray-200 text-gray-500 hover:text-gray-700"
            >
              បោះបង់
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={() => form.submit()}
              className="rounded-lg px-5 bg-indigo-600 border-0 hover:bg-indigo-700 flex items-center gap-1.5 font-semibold text-white"
            >
              <SaveOutlined />
              <span>រក្សាទុក</span>
            </Button>
          </Space>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        requiredMark={false}
        className="space-y-4"
      >
        <Form.Item name="id" style={{ display: 'none' }}>
          <Input type="hidden" />
        </Form.Item>

        {/* 1. Personal Information Card */}
        <Card
          className="rounded-xl border border-gray-200 bg-white"
          title={
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <UserOutlined className="text-indigo-600" />
              ព័ត៌មានផ្ទាល់ខ្លួន (Personal Information)
            </span>
          }
        >
          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span className="font-semibold text-gray-700 text-xs">ឈ្មោះពេញ (Full Name)</span>}
                name="full_name"
                rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះពេញ!' }]}
                {...validate.full_name}
              >
                <Input
                  placeholder="បញ្ចូលឈ្មោះពេញ"
                  style={{ height: 40 }}
                  className="rounded-lg border-gray-200"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span className="font-semibold text-gray-700 text-xs">អ៊ីមែល (Email)</span>}
                name="email"
                rules={[
                  { required: true, message: 'សូមបញ្ចូលអ៊ីមែល!' },
                  { type: 'email', message: 'អ៊ីមែលមិនត្រឹមត្រូវ!' }
                ]}
                {...validate.email}
              >
                <Input
                  placeholder="បញ្ចូលអ៊ីមែល"
                  style={{ height: 40 }}
                  className="rounded-lg border-gray-200"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span className="font-semibold text-gray-700 text-xs">ឈ្មោះអ្នកប្រើប្រាស់ (Username)</span>}
                name="username"
                rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះគណនី!' }]}
                {...validate.username}
              >
                <Input
                  placeholder="បញ្ចូលឈ្មោះគណនី"
                  disabled={isEdit}
                  style={{ height: 40 }}
                  className="rounded-lg border-gray-200"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span className="font-semibold text-gray-700 text-xs">លេខទូរស័ព្ទ (Phone)</span>}
                name="phone"
                {...validate.phone}
              >
                <Input
                  placeholder="បញ្ចូលលេខទូរស័ព្ទ"
                  style={{ height: 40 }}
                  className="rounded-lg border-gray-200"
                />
              </Form.Item>
            </Col>
          </Row>

          {!isEdit && (
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  label={<span className="font-semibold text-gray-700 text-xs">លេខសម្ងាត់ (Password)</span>}
                  name="password"
                  rules={[{ required: true, message: 'សូមបញ្ចូលលេខសម្ងាត់!' }]}
                  {...validate.password}
                >
                  <Input.Password
                    placeholder="បញ្ចូលលេខសម្ងាត់"
                    style={{ height: 40 }}
                    className="rounded-lg border-gray-200"
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Form.Item label={<span className="font-semibold text-gray-700 text-xs">ភេទ (Gender)</span>} name="gender">
                <Radio.Group className="mt-1">
                  <Radio value="male">ប្រុស</Radio>
                  <Radio value="female">ស្រី</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {isEdit && (
              <Col xs={24} sm={12}>
                <Form.Item label={<span className="font-semibold text-gray-700 text-xs">ស្ថានភាព (Status)</span>} name="status">
                  <Select style={{ height: 40 }} className="w-full rounded-lg">
                    <Select.Option value="active">សកម្ម</Select.Option>
                    <Select.Option value="inactive">អសកម្ម</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
        </Card>

        {/* 2. Branch Information Card */}
        <Card
          className="rounded-xl border border-gray-200 bg-white"
          title={
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <ApartmentOutlined className="text-indigo-600" />
              ព័ត៌មានសាខា (Branch)
            </span>
          }
        >
          <Form.Item
            label={<span className="font-semibold text-gray-700 text-xs">ជ្រើសរើសសាខា (Select Branch)</span>}
            name="branch_id"
            rules={[{ required: true, message: 'សូមជ្រើសរើសសាខា!' }]}
          >
            <Select placeholder="ជ្រើសរើសសាខា" style={{ height: 40 }} className="w-full rounded-lg">
              {branches.map(b => (
                <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Card>

        {/* 3. Role Permission Card */}
        <Card
          className="rounded-xl border border-gray-200 bg-white"
          title={
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <SafetyCertificateOutlined className="text-indigo-600" />
              តួនាទី និងសិទ្ធិ (Role & Permission)
            </span>
          }
        >
          <div className="mb-4">
            <Radio.Group
              value={roleType}
              onChange={e => setRoleType(e.target.value)}
              className="w-full flex rounded-lg border border-gray-200 overflow-hidden"
              style={{ border: '1px solid #e5e7eb' }}
            >
              <Radio.Button value="default" className="flex-1 text-center font-medium h-9 flex items-center justify-center text-xs">
                តួនាទីស្តង់ដារ
              </Radio.Button>
              <Radio.Button value="custom" className="flex-1 text-center font-medium h-9 flex items-center justify-center text-xs">
                សិទ្ធិផ្ទាល់ខ្លួន
              </Radio.Button>
            </Radio.Group>
          </div>

          {roleType === 'default' ? (
            <Form.Item
              label={<span className="font-semibold text-gray-700 text-xs">ជ្រើសរើសតួនាទី (Select Role)</span>}
              name="role_id"
              rules={[{ required: roleType === 'default', message: 'សូមជ្រើសរើសតួនាទី!' }]}
            >
              <Select placeholder="ជ្រើសរើសតួនាទី" style={{ height: 40 }} className="w-full rounded-lg">
                {defaultRoles.map(role => (
                  <Select.Option key={role.id} value={role.id}>
                    {role.name} {role.description && `(${role.description})`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <PermissionSelector
              customPermissions={customPermissions}
              customSelectedModules={customSelectedModules}
              onChange={onPermissionChange}
            />
          )}
        </Card>
      </Form>
    </Drawer>
  )
}

export default UserDrawer
