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
import React from 'react'

function AccountTypeModal ({ open, setState, editingAccountType, onSuccess }) {
  const [form] = Form.useForm()

  const fillEditData = () => {
    if (editingAccountType) {
      form.setFieldsValue({
        id: editingAccountType.id,
        code: editingAccountType.code,
        name: editingAccountType.name,
        normal_balance: editingAccountType.normal_balance,
        description: editingAccountType.description
      })
    } else {
      form.resetFields()
    }
  }

  // ហៅ fillEditData ពេល editingAccountType ផ្លាស់ប្តូរ
  React.useEffect(() => {
    fillEditData()
  }, [editingAccountType])

  const handleClose = () => {
    setState(prev => ({ ...prev, open: false, editingAccountType: null }))
    form.resetFields()
  }

  const onFinish = async values => {
    let url = 'account-types'
    let method = 'post'

    const payload = {
      ...values
    }

    if (values.id) {
      url = `account-types/${values.id}`
      payload._method = 'PUT'
    }

    const res = await request(url, 'post', payload)

    if (res?.data || !res?.errors) {
      message.success(res.message || 'ជោគជ័យ!')
      handleClose()
      onSuccess()
    } else {
      message.error(res?.message || 'បរាជ័យ!')
    }
  }

  return (
    <Modal
      title={
        editingAccountType ? 'កែប្រែប្រភេទគណនេយ្យ' : 'បង្កើតប្រភេទគណនេយ្យថ្មី'
      }
      open={open}
      onCancel={handleClose}
      centered
      width={700}
      footer={null}
      maskClosable={false}
    >
      <Form layout='vertical' form={form} onFinish={onFinish}>
        <Form.Item name='id' hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={24}>
            <Form.Item
              label='ឈ្មោះប្រភេទគណនី (Name)'
              name='name'
              rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះ!' }]}
            >
              <Input
                placeholder='ឧ. Asset, Liability, Equity, Revenue, Expense'
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          </Col>

        </Row>

        <Row gutter={16}>
        <Col xs={24} sm={12}>
            <Form.Item
              label='កូដគណនី (Code)'
              name='code'
              rules={[{ required: true, message: 'សូមបញ្ចូលកូដ!' }]}
            >
              <Input
                placeholder='ឧ. ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE'
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label='សមតុល្យធម្មតា (Normal Balance)'
              name='normal_balance'
              rules={[{ required: true, message: 'សូមជ្រើសរើសសមតុល្យធម្មតា!' }]}
            >
              <Select placeholder='ជ្រើសរើសសមតុល្យធម្មតា'>
                <Select.Option value='debit'>Debit</Select.Option>
                <Select.Option value='credit'>Credit</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label='ការពិពណ៌នា (Description)' name='description'>
              <Input.TextArea placeholder='ការពិពណ៌នាអំពីប្រភេទគណនីនេះ...' rows={4} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={handleClose}>បោះបង់</Button>
            <Button
              type='primary'
              className='bg-blue-600 hover:!bg-blue-700 border-none rounded-lg shadow-sm'
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

export default AccountTypeModal
