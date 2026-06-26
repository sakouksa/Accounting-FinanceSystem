import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  message,
  Row,
  Col,
  Switch
} from 'antd'
import { request } from '../../../util/request'
import { RiSave3Fill } from 'react-icons/ri'
import { BiSolidEditAlt } from 'react-icons/bi'
import React from 'react'

function TransactionTypeModal ({
  open,
  setState,
  editingTransactionType,
  onSuccess
}) {
  const [form] = Form.useForm()

  React.useEffect(() => {
    if (editingTransactionType) {
      form.setFieldsValue({
        code: editingTransactionType.code,
        name: editingTransactionType.name,
        description: editingTransactionType.description,
        is_active: editingTransactionType.is_active === 1
      })
    } else {
      form.resetFields()
    }
  }, [editingTransactionType, form])

  const handleClose = () => {
    setState(prev => ({ ...prev, open: false, editingTransactionType: null }))
    form.resetFields()
  }

  const onFinish = async values => {
    const payload = {
      ...values,
      is_active: values.is_active ? 1 : 0
    }

    let url = 'transaction-types'
    let method = 'post'

    if (editingTransactionType) {
      url += `/${editingTransactionType.id}`
      method = 'put'
    }

    const res = await request(url, method, payload)

    if (res && !res.errors) {
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
        editingTransactionType
          ? 'កែប្រែប្រភេទប្រតិបត្តិការ'
          : 'បង្កើតប្រភេទប្រតិបត្តិការថ្មី'
      }
      open={open}
      onCancel={handleClose}
      centered
      width={700}
      footer={null}
      maskClosable={false}
    >
      <Form layout='vertical' form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label='កូដ' name='code' rules={[{ required: true }]}>
              <Input
                placeholder='ឧ. DEPOSIT, WITHDRAW'
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label='ឈ្មោះ' name='name' rules={[{ required: true }]}>
              <Input placeholder='ឧ. ដាក់លុយ, ដកលុយ' />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label='ពិពណ៌នា' name='description'>
          <Input.TextArea rows={3} placeholder='ពិពណ៌នាបន្ថែម...' />
        </Form.Item>
        <Form.Item label='ស្ថានភាព' name='is_active' valuePropName='checked'>
          <Switch
            checkedChildren='សកម្ម'
            unCheckedChildren='អសកម្ម'
            className='
      !bg-red-500
      [&.ant-switch-checked]:!bg-blue-600
    '
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={handleClose}>បោះបង់</Button>
            <Button
              type='primary'
              className = "!bg-blue-500 !border-blue-500 hover:!bg-blue-600"
              htmlType='submit'
              icon={
                editingTransactionType ? <BiSolidEditAlt /> : <RiSave3Fill />
              }
            >
              {editingTransactionType ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TransactionTypeModal
