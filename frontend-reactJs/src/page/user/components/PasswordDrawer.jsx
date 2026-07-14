import React from 'react'
import { Drawer, Form, Input, Button, Space } from 'antd'
import { LockOutlined } from '@ant-design/icons'

function PasswordDrawer ({ open, onClose, form, onFinish, loading }) {
  return (
    <Drawer
      title={
        <div>
          <div className="font-bold text-gray-800 text-sm">ប្តូរលេខសម្ងាត់ (Reset Password)</div>
          <div className="text-xs text-gray-400 font-normal mt-0.5">បញ្ចូលលេខសម្ងាត់ថ្មីសម្រាប់គណនីនេះ</div>
        </div>
      }
      placement="right"
      width={400}
      onClose={onClose}
      open={open}
      maskClosable={!loading}
      keyboard={!loading}
      styles={{
        header: { borderBottom: '1px solid #e5e7eb', padding: '16px 20px' },
        body: { padding: '20px', background: '#f9fafb' },
        footer: { borderTop: '1px solid #e5e7eb', padding: '12px 20px' }
      }}
      footer={
        <div className="flex justify-end">
          <Space size="small">
            <Button disabled={loading} onClick={onClose} className="rounded-lg border-gray-200 text-gray-500">
              បោះបង់
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={() => form.submit()}
              className="rounded-lg bg-indigo-600 border-0 hover:bg-indigo-700 font-semibold text-white"
            >
              ប្តូរលេខសម្ងាត់
            </Button>
          </Space>
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <Form.Item
            name="password"
            label={<span className="font-semibold text-gray-700 text-xs">លេខសម្ងាត់ថ្មី (New Password)</span>}
            rules={[
              { required: true, message: 'សូមបញ្ចូលលេខសម្ងាត់ថ្មី!' },
              { min: 6, message: 'លេខសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ ខ្ទង់!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="បញ្ចូលលេខសម្ងាត់ថ្មី"
              style={{ height: 40 }}
              className="rounded-lg border-gray-200"
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  )
}

export default PasswordDrawer
