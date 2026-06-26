import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  InputNumber,
  Button,
  Space,
  Divider,
  Typography
} from 'antd'
import { BiSolidEditAlt } from 'react-icons/bi'
import { RiSave3Fill } from 'react-icons/ri'
import { useState, useEffect, useCallback } from 'react';
const { Text } = Typography;
function CustomerModal ({ open, setState, editingCustomer, onSuccess }) {
  const [form] = Form.useForm()
  // Initialize form when editingCustomer changes
  const initializeForm = useCallback(
    customer => {
      if (customer) {
        form.setFieldsValue({
          id: customer.id,
          customer_code: customer.customer_code,
          customer_name: customer.customer_name,
          customer_type: customer.customer_type,
          tax_number: customer.tax_number,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          credit_limit: customer.credit_limit,
          opening_balance: customer.opening_balance,
          current_balance: customer.current_balance,
          status: customer.status
        })
      } else {
        form.resetFields()
        form.setFieldsValue({
          status: 'active',
          customer_type: 'retail',
          credit_limit: 0,
          opening_balance: 0,
          current_balance: 0
        })
      }
    },
    [form]
  )
  useEffect(() => {
    initializeForm(editingCustomer)
  }, [editingCustomer, initializeForm])
  // Close modal
  const handleClose = () => {
    setState(prev => ({
      ...prev,
      open: false,
      editingCustomer: null
    }))
    form.resetFields()
  }

  // Submit
  const onFinish = async values => {
    try {
      let url = 'customers'
      let method = 'post'

      if (values.id) {
        url += `/${values.id}`
        method = 'put'
      }

      const res = await request(url, method, values)

      if (res && !res.error) {
        message.success(res.message || 'ជោគជ័យ!')
        handleClose()
        onSuccess()
        return
      }

      // === NEW HANDLING ===
      if (res?.validationErrors || res?.errors?.validation) {
        const validationErrors = res.validationErrors || res.errors.validation

        const fieldErrors = Object.keys(validationErrors).map(key => ({
          name: key,
          errors: Array.isArray(validationErrors[key])
            ? validationErrors[key]
            : [validationErrors[key]]
        }))

        form.setFields(fieldErrors)
        message.error(res.errors?.message || 'សូមពិនិត្យទិន្នន័យឡើងវិញ')
        return
      }

      // Other errors
      message.error(res?.errors?.message || 'បរាជ័យ!')
    } catch (err) {
      console.error(err)
      message.error('Server Error!')
    }
  }
  return (
    <Modal
      title={
        <Text strong style={{ fontSize: '18px' }}>
          {editingCustomer ? 'កែប្រែព័ត៌មានអតិថិជន' : 'បង្កើតអតិថិជនថ្មី'}
        </Text>
      }
      open={open}
      onCancel={handleClose}
      centered
      width={900}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Form.Item name='id' hidden>
          <Input />
        </Form.Item>

        {/* Section 1: General Info */}
        <Text type='secondary' style={{ fontWeight: 'bold' }}>
          ព័ត៌មានទូទៅ
        </Text>
        <Divider style={{ margin: '10px 0 20px 0' }} />

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label='Customer Code'
              name='customer_code'
              rules={[{ required: true }]}
            >
              <Input placeholder='ឧ. CUS001' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Customer Name'
              name='customer_name'
              rules={[{ required: true }]}
            >
              <Input placeholder='ឈ្មោះអតិថិជន' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label='Customer Type'
              name='customer_type'
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: 'retail', label: 'Retail' },
                  { value: 'wholesale', label: 'Wholesale' }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Tax Number' name='tax_number'>
              <Input placeholder='លេខអត្តសញ្ញាណកម្មអាករ' />
            </Form.Item>
          </Col>
        </Row>

        {/* Section 2: Contact Info */}
        <Text type='secondary' style={{ fontWeight: 'bold' }}>
          ព័ត៌មានទំនាក់ទំនង
        </Text>
        <Divider style={{ margin: '10px 0 20px 0' }} />

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label='Phone' name='phone'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Email' name='email' rules={[{ type: 'email' }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label='Address' name='address'>
          <Input.TextArea rows={2} />
        </Form.Item>

        {/* Section 3: Financial Info */}
        <Text type='secondary' style={{ fontWeight: 'bold' }}>
          ព័ត៌មានហិរញ្ញវត្ថុ
        </Text>
        <Divider style={{ margin: '10px 0 20px 0' }} />

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label='Credit Limit' name='credit_limit'>
              <InputNumber style={{ width: '100%' }} min={0} prefix='$' />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='Opening Balance' name='opening_balance'>
              <InputNumber style={{ width: '100%' }} min={0} prefix='$' />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='Current Balance' name='current_balance'>
              <InputNumber style={{ width: '100%' }} min={0} prefix='$' />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label='Status' name='status' rules={[{ required: true }]}>
          <Select
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />
        </Form.Item>

        <Divider />

        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={handleClose}>បោះបង់</Button>
            <Button
              type='primary'
              htmlType='submit'
              icon={editingCustomer ? <BiSolidEditAlt /> : <RiSave3Fill />}
            >
              {editingCustomer ? 'កែប្រែទិន្នន័យ' : 'រក្សាទុក'}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  )
}

export default CustomerModal
