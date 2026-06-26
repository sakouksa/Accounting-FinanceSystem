import React, { useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
  Row,
  Col
} from 'antd'
import { request } from '../../../util/request'
import { RiSave3Fill } from 'react-icons/ri'
import { BiSolidEditAlt } from 'react-icons/bi'

function AccountTypeModal({
  open,
  setState,
  editingAccountType,
  onSuccess
}) {
  const [form] = Form.useForm()

  const isEdit = !!editingAccountType

  // Fill form when edit
  useEffect(() => {
    if (editingAccountType) {
      form.setFieldsValue({
        name: editingAccountType.name,
        code: editingAccountType.code,
        normal_balance: editingAccountType.normal_balance,
        description: editingAccountType.description
      })
    } else {
      form.resetFields()
    }
  }, [editingAccountType, form])

  const handleClose = () => {
    setState(prev => ({
      ...prev,
      open: false,
      editingAccountType: null
    }))
    form.resetFields()
  }

  const onFinish = async (values) => {
    let res

    if (editingAccountType?.id) {
      res = await request(`account-types/${editingAccountType.id}`, 'put', values)
    } else {
      res = await request('account-types', 'post', values)
    }
    
    if (!res?.error) {
      message.success(res.message || 'ជោគជ័យ!')
      handleClose()
      onSuccess?.()
    } else {
      message.error(res?.errors?.message || res?.message || 'បរាជ័យ!')
    }
  }

  return (
    <Modal
      title={isEdit ? 'កែប្រែប្រភេទគណនេយ្យ' : 'បង្កើតប្រភេទគណនេយ្យ'}
      open={open}
      onCancel={handleClose}
      centered
      width={700}
      footer={null}
      maskClosable={false}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="ឈ្មោះប្រភេទគណនី"
              name="name"
              rules={[
                { required: true, message: 'សូមបញ្ចូលឈ្មោះ!' },
                { min: 2, message: 'តិចបំផុត 2 តួអក្សរ' },
                { max: 100, message: 'មិនអាចលើស 100 តួអក្សរ' }
              ]}
            
            >
              <Input placeholder="ឧ. Asset, Liability..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="កូដ"
              name="code"
              rules={[{ required: true, message: 'សូមបញ្ចូលកូដ!' }]}
            >
              <Input placeholder="ឧ. ASSET" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="សមតុល្យធម្មតា"
              name="normal_balance"
              rules={[{ required: true, message: 'សូមជ្រើសរើស!' }]}
            >
              <Select placeholder="ជ្រើសរើស">
                <Select.Option value="debit">Debit</Select.Option>
                <Select.Option value="credit">Credit</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="ពិពណ៌នា"
              name="description"
            >
              <Input.TextArea rows={4} placeholder="ពិពណ៌នា..." />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={handleClose}>
              បោះបង់
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              icon={isEdit ? <BiSolidEditAlt /> : <RiSave3Fill />}
              className="bg-blue-600 hover:!bg-blue-700 border-none"
            >
              {isEdit ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក'}
            </Button>
          </Space>
        </Form.Item>

      </Form>
    </Modal>
  )
}

export default AccountTypeModal