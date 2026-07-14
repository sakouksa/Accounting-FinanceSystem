import React from 'react'
import { Drawer, Form, Input, Select, Button, Space } from 'antd'

function RoleDrawer ({ open, onClose, form, onFinish, validate = {}, loading }) {
  const isEdit = !!form.getFieldValue('id')

  return (
    <Drawer
      title={
        <div>
          <div className="font-bold text-gray-800 text-sm">
            {isEdit ? 'កែប្រែតួនាទី (Edit Role)' : 'បង្កើតតួនាទីថ្មី (Create Role)'}
          </div>
          <div className="text-xs text-gray-400 font-normal mt-0.5">
            {isEdit ? 'ធ្វើបច្ចុប្បន្នភាពព័ត៌មានតួនាទី' : 'បំពេញព័ត៌មានដើម្បីបង្កើតតួនាទីថ្មី'}
          </div>
        </div>
      }
      placement="right"
      width={window.innerWidth > 640 ? 480 : '100%'}
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
              {isEdit ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក'}
            </Button>
          </Space>
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
        <Form.Item name="id" style={{ display: 'none' }}>
          <Input type="hidden" />
        </Form.Item>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <Form.Item
            label={<span className="font-semibold text-gray-700 text-xs">ឈ្មោះតួនាទី (Role Name)</span>}
            name="name"
            validateStatus={validate.name ? 'error' : ''}
            help={validate.name?.help}
            rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះតួនាទី!' }]}
          >
            <Input
              placeholder="ឧ. បុគ្គលិកផ្នែកលក់"
              style={{ height: 40 }}
              className="rounded-lg border-gray-200"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700 text-xs">កូដតួនាទី (Role Code)</span>}
            name="code"
            validateStatus={validate.code ? 'error' : ''}
            help={validate.code?.help}
            rules={[{ required: true, message: 'សូមបញ្ចូលកូដតួនាទី!' }]}
          >
            <Input
              placeholder="ឧ. sales_agent"
              style={{ height: 40 }}
              className="rounded-lg border-gray-200 font-mono"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700 text-xs">ការពិពណ៌នា (Description)</span>}
            name="description"
          >
            <Input.TextArea
              rows={3}
              placeholder="បញ្ចូលការពិពណ៌នា..."
              className="rounded-lg border-gray-200"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700 text-xs">ស្ថានភាព (Status)</span>}
            name="status"
            initialValue="active"
          >
            <Select
              style={{ height: 40 }}
              className="w-full rounded-lg"
              options={[
                { label: 'សកម្ម (Active)', value: 'active' },
                { label: 'អសកម្ម (Inactive)', value: 'inactive' }
              ]}
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  )
}

export default RoleDrawer
