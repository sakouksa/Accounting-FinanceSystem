import { Modal, Form, Input, Select, Button, Space, message } from 'antd'
import { request } from '../../../util/request'
import { RiSave3Fill } from 'react-icons/ri'
import { BiSolidEditAlt } from 'react-icons/bi'
import React from 'react'
function BranchModal ({ open, setState, onSuccess, editingBranch }) {
  const [form] = Form.useForm()

  const handleClose = () => {
    setState(prev => ({ ...prev, open: false }))
    form.resetFields()
  }

  const onFinish = async values => {
    let url = 'branches'
    let method = 'post'

    if (values.id) {
      url += `/${values.id}`
      method = 'put'
    }

    const res = await request(url, method, values)

    if (res && !res.errors) {
      message.success(res.message || 'ជោគជ័យ!')
      handleClose()
      onSuccess()
    } else {
      message.error(res?.message || 'បរាជ័យ!')
    }
  }
  const fillEditData = () => {
      if (editingBranch) {
          form.setFieldsValue({
              id: editingBranch.id,
              name: editingBranch.name,
              code: editingBranch.code,
              address: editingBranch.address,
              phone: editingBranch.phone,
              status: editingBranch.status || 'active',
          })
      } else {
          form.resetFields()
      }
  }
  React.useEffect(() => {
    fillEditData()
  }, [editingBranch])

  return (
    <Modal
      title={form.getFieldValue('id') ? 'កែប្រែសាខា' : 'បង្កើតសាខាថ្មី'}
      open={open}
      onCancel={handleClose}
      centered
      width={600}
      footer={null}
      mask={{ closable: false }}
    >
      <Form layout='vertical' form={form} onFinish={onFinish}>
        <Form.Item name='id' hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label='ឈ្មោះសាខា'
          name='name'
          rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះសាខា!' }]}
        >
          <Input placeholder='បញ្ចូលឈ្មោះសាខា' />
        </Form.Item>

        <Form.Item
          label='កូដសាខា'
          name='code'
          rules={[{ required: true, message: 'សូមបញ្ចូលកូដសាខា!' }]}
        >
          <Input placeholder='ឧ. PHN-001' />
        </Form.Item>

        <Form.Item label='អាសយដ្ឋាន' name='address'>
          <Input.TextArea rows={2} placeholder='បញ្ចូលអាសយដ្ឋាន' />
        </Form.Item>

        <Form.Item label='លេខទូរស័ព្ទ' name='phone'>
          <Input placeholder='បញ្ចូលលេខទូរស័ព្ទ' />
        </Form.Item>

        <Form.Item label='ស្ថានភាព' name='status' initialValue='active'>
          <Select
            options={[
              { label: 'សកម្ម', value: 'active' },
              { label: 'អសកម្ម', value: 'inactive' }
            ]}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={handleClose}>បោះបង់</Button>
            <Button
              type='primary'
              className = 'bg-blue-600 hover:!bg-blue-700 border-none rounded-lg shadow-sm'
              htmlType='submit'
              icon={
                form.getFieldValue('id') ? <BiSolidEditAlt /> : <RiSave3Fill />
              }
            >
              {form.getFieldValue('id') ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BranchModal
