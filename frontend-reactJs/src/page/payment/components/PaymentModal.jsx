import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
  Row,
  Col,
  InputNumber,
  Switch,
  DatePicker
} from 'antd'
import { request } from '../../../util/request'
import { RiSave3Fill } from 'react-icons/ri'
import { BiSolidEditAlt } from 'react-icons/bi'
import React, { useState, useEffect } from 'react'
import { formatToPicker, dateServer } from '../../../util/helper'
function PaymentModal ({
  open,
  setState,
  editingPayment,
  onSuccess,
  payment_method = [],
  accounts_payable = [],
  accounts_receivable = [],
  transaction = []
}) {
  const [form] = Form.useForm()

  const [loadingTypes, setLoadingTypes] = useState(false)
  const [loadingParents, setLoadingParents] = useState(false)

  const paymentType = Form.useWatch('payment_type', form)
  const fillEditData = () => {
    if (editingPayment) {
      form.setFieldsValue({
        ...editingPayment,
        payment_date: formatToPicker(editingPayment.payment_date)
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        payment_type: 'payable',
        status: 'completed',
        amount: 0,
        exchange_rate: 1,
        currency_code: 'USD',
        payment_date: formatToPicker(new Date())
      })
    }
  }
  const handleValuesChange = (changedValues, allValues) => {
    if ('total_amount' in changedValues || 'paid_amount' in changedValues) {
      const total = allValues.total_amount || 0
      const paid = allValues.paid_amount || 0
      form.setFieldsValue({
        balance_amount: total - paid
      })
    }
  }
  useEffect(() => {
    fillEditData()
  }, [editingPayment])

  const handleClose = () => {
    setState(prev => ({ ...prev, open: false, editingPayment: null }))
    form.resetFields()
  }

  const onFinish = async values => {
    try {
      let url = 'payments'
      let method = 'post'

      if (values.id) {
        url += `/${values.id}`
        method = 'put'
      }

      const payload = {
        ...values,
        payment_date: dateServer(values.payment_date),
        payable_id:
          values.payment_type === 'payable' ? values.payable_id : null,
        receivable_id:
          values.payment_type === 'receivable' ? values.receivable_id : null,
        amount: Number(values.amount),
        exchange_rate: Number(values.exchange_rate || 1)
      }

      const res = await request(url, method, payload)

      if (!res?.error) {
        message.success(res.message || 'ជោគជ័យ!')
        handleClose()
        onSuccess()
        return
      }

      if (res?.errors) {
        const fieldErrors = []
        Object.keys(res.errors).forEach(key => {
          if (key !== 'message') {
            fieldErrors.push({
              name: key,
              errors: [res.errors[key].help || res.errors[key]]
            })
          }
        })
        form.setFields(fieldErrors)
        message.error(res.errors.message || 'ទិន្នន័យមិនត្រឹមត្រូវ!')
        return
      }

      message.error(res?.errors?.message || 'បរាជ័យ!')
    } catch (error) {
      message.error('បញ្ហាបច្ចេកទេសបានកើតឡើង 500!')
    }
  }
  return (
    <Modal
      title={editingPayment ? 'កែប្រែទិន្នន័យទូទាត់ប្រាក់' : 'បង្កើតការទូទាត់ប្រាក់ថ្មី'}
      open={open}
      onCancel={handleClose}
      centered
      width={950}
      footer={null}
      maskClosable={false}
    >
      <Form layout='vertical' form={form} onFinish={onFinish}>
        {/* Hidden ID field for update */}
        <Form.Item name='id' hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label='លេខកូដទូទាត់ (Payment No)'
              name='payment_no'
              rules={[{ required: true, message: 'សូមបញ្ចូលលេខកូដទូទាត់!' }]}
            >
              <Input placeholder='ឧ. PMT-2026-0001' style={{ textTransform: 'uppercase' }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label='ប្រភេទការទូទាត់'
              name='payment_type'
              rules={[{ required: true, message: 'សូមជ្រើសរើសប្រភេទការទូទាត់!' }]}
            >
              <Select placeholder='ជ្រើសរើសប្រភេទ'>
                <Select.Option value='payable'>ចំណាយ / ត្រូវទូទាត់ (Payable)</Select.Option>
                <Select.Option value='receivable'>ចំណូល / ត្រូវប្រមូល (Receivable)</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* កែប្រែត្រង់ options ទៅជា transaction.map */}
          <Col xs={24} sm={24} md={8}>
            <Form.Item label='លេខប្រតិបត្តិការយោង (Transaction No)' name='transaction_id'>
              <Select
                placeholder='ជ្រើសរើសលេខប្រតិបត្តិការ'
                showSearch
                allowClear
                optionFilterProp='label'
                options={transaction.map(item => ({
                  label: item.transaction_no,
                  value: item.id
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {paymentType === 'payable' ? (
            <Col xs={24} sm={12}>
              <Form.Item
                label='ជ្រើសរើសវិក្កយបត្រទិញ (Accounts Payable)'
                name='payable_id'
                rules={[{ required: true, message: 'សូមជ្រើសរើសវិក្កយបត្រជំពាក់!' }]}
              >
                <Select
                  placeholder='ជ្រើសរើសលេខវិក្កយបត្រជំពាក់'
                  showSearch
                  optionFilterProp='label'
                  options={accounts_payable.map(item => ({
                    label: item.bill_no,
                    value: item.id
                  }))}
                />
              </Form.Item>
            </Col>
          ) : (
            <Col xs={24} sm={12}>
              <Form.Item
                label='ជ្រើសរើសវិក្កយបត្រលក់ (Accounts Receivable)'
                name='receivable_id'
                rules={[{ required: true, message: 'សូមជ្រើសរើសវិក្កយបត្រត្រូវប្រមូល!' }]}
              >
                <Select
                  placeholder='ជ្រើសរើសលេខវិក្កយបត្រត្រូវប្រមូល'
                  showSearch
                  optionFilterProp='label'
                  options={accounts_receivable.map(item => ({
                    label: item.invoice_no,
                    value: item.id
                  }))}
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={12}>
            <Form.Item
              label='វិធីសាស្ត្រទូទាត់ (Payment Method)'
              name='payment_method_id'
              rules={[{ required: true, message: 'សូមជ្រើសរើសវិធីសាស្ត្រទូទាត់!' }]}
            >
              <Select
                placeholder='ជ្រើសរើសវិធីសាស្ត្រទូទាត់'
                showSearch
                optionFilterProp='label'
                options={payment_method.map(item => ({
                  label: item.name,
                  value: item.id
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='កាលបរិច្ឆេទភារកិច្ចទូទាត់'
              name='payment_date'
              rules={[{ required: true, message: 'សូមជ្រើសរើសថ្ងៃទូទាត់!' }]}
            >
              <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label='ទឹកប្រាក់ទូទាត់ (Amount)'
              name='amount'
              rules={[{ required: true, message: 'សូមបញ្ចូលទឹកប្រាក់ទូទាត់!' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} precision={2} placeholder='0.00' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label='ប្រភេទរូបិយប័ណ្ណ' name='currency_code'>
              <Select placeholder='ជ្រើសរើសរូបិយប័ណ្ណ'>
                <Select.Option value='USD'>USD ($)</Select.Option>
                <Select.Option value='KHR'>KHR (៛)</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label='អត្រាប្តូរប្រាក់ (Exchange Rate)' name='exchange_rate'>
              <InputNumber style={{ width: '100%' }} min={1} placeholder='4100' />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Form.Item label='លេខយោង/លេខប្រតិបត្តិការ (Reference No)' name='reference_no'>
              <Input placeholder='ឧ. លេខត្រួតពិនិត្យ ឬ លេខវេរលុយ' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='ស្ថានភាពការទូទាត់'
              name='status'
              rules={[{ required: true, message: 'សូមជ្រើសរើសស្ថានភាព!' }]}
            >
              <Select placeholder='ជ្រើសរើសស្ថានភាព'>
                <Select.Option value='pending'>កំពុងរង់ចាំ (Pending)</Select.Option>
                <Select.Option value='completed'>ជោគជ័យ (Completed)</Select.Option>
                <Select.Option value='cancelled'>បោះបង់ (Cancelled)</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label='សម្គាល់ (Remarks)' name='remarks'>
              <Input placeholder='ព័ត៌មានបន្ថែមផ្សេងៗ...' />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: 16 }}>
          <Space>
            <Button onClick={handleClose}>បោះបង់</Button>
            <Button
              type='primary'
              className='bg-blue-600 hover:!bg-blue-700 border-none rounded-lg shadow-sm'
              htmlType='submit'
              icon={editingPayment ? <BiSolidEditAlt /> : <RiSave3Fill />}
            >
              {editingPayment ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PaymentModal
