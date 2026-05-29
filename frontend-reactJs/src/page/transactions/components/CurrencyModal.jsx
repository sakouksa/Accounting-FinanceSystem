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

function CurrencyModal ({ open, setState, editingCurrency, onSuccess }) {
  const [form] = Form.useForm()

  const fillEditData = () => {
    if (editingCurrency) {
      form.setFieldsValue({
        id: editingCurrency.id,
        code: editingCurrency.code,
        name: editingCurrency.name,
        symbol: editingCurrency.symbol,
        exchange_rate: editingCurrency.exchange_rate,
        status: editingCurrency.status || 'active'
      })
    } else {
      form.resetFields()
    }
  }

  // ហៅ fillEditData ពេល editingCurrency ផ្លាស់ប្តូរ
  React.useEffect(() => {
    fillEditData()
  }, [editingCurrency])

  const handleClose = () => {
    setState(prev => ({ ...prev, open: false, editingCurrency: null }))
    form.resetFields()
  }

  const onFinish = async values => {
    let url = 'currencies'
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

  return (
    <Modal
      title={editingCurrency ? 'កែប្រែរូបិយប័ណ្ណ' : 'បង្កើតរូបិយប័ណ្ណថ្មី'}
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
          <Col xs={24} sm={12}>
            <Form.Item
              label='កូដរូបិយប័ណ្ណ'
              name='code'
              rules={[{ required: true, message: 'សូមបញ្ចូលកូដ!' }]}
            >
              <Input
                placeholder='ឧ. USD, KHR, EUR'
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label='ឈ្មោះរូបិយប័ណ្ណ'
              name='name'
              rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះ!' }]}
            >
              <Input placeholder='ឧ. ដុល្លារអាមេរិក' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='និមិត្តសញ្ញា (Symbol)'
              name='symbol'
              rules={[{ required: true, message: 'សូមបញ្ចូលនិមិត្តសញ្ញា!' }]}
            >
              <Input placeholder='ឧ. $, ៛, €' />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label='អត្រាប្តូរ (Exchange Rate)'
              name='exchange_rate'
              rules={[{ required: true, message: 'សូមបញ្ចូលអត្រាប្តូរ!' }]}
            >
              <Input
                type='number'
                step='0.0001'
                placeholder='ឧ. 1.00 ឬ 4100'
                suffix='USD'
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label='ស្ថានភាព'
          name='status'
          initialValue='active'
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: ' សកម្ម', value: 'active' },
              { label: ' អសកម្ម', value: 'inactive' }
            ]}
          />
        </Form.Item>

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

export default CurrencyModal
