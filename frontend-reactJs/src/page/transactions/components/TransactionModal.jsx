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
  DatePicker
} from 'antd'

import { request } from '../../../util/request'
import { RiSave3Fill } from 'react-icons/ri'
import { BiSolidEditAlt } from 'react-icons/bi'
import React, { useEffect, useState } from 'react'

import { dateServer, formatToPicker } from '../../../util/helper'

function TransactionModal ({ open, setState, editingTransaction, onSuccess }) {
  const [form] = Form.useForm()

  const [branches, setBranches] = useState([])
  const [transactionTypes, setTransactionTypes] = useState([])

  const [loadingBranches, setLoadingBranches] = useState(false)
  const [loadingTypes, setLoadingTypes] = useState(false)

  // Fetch Branches
  const fetchBranches = async () => {
    try {
      setLoadingBranches(true)

      const res = await request('branches', 'get')

      if (res?.list) {
        setBranches(res.list)
      }
    } finally {
      setLoadingBranches(false)
    }
  }

  // Fetch Transaction Types
  const fetchTransactionTypes = async () => {
    try {
      setLoadingTypes(true)

      const res = await request('transaction-types', 'get')

      if (res?.list) {
        setTransactionTypes(res.list)
      }
    } finally {
      setLoadingTypes(false)
    }
  }

  // Fill Edit Data
  const fillEditData = () => {
    if (editingTransaction) {
      form.setFieldsValue({
        id: editingTransaction.id,
        transaction_no: editingTransaction.transaction_no,
        transaction_date: formatToPicker(editingTransaction.transaction_date),
        transaction_type_id: editingTransaction.transaction_type_id,
        branch_id: editingTransaction.branch_id,
        currency_code: editingTransaction.currency_code || 'USD',
        exchange_rate: editingTransaction.exchange_rate || 1,
        total_debit: editingTransaction.total_debit || 0,
        total_credit: editingTransaction.total_credit || 0,
        reference_type: editingTransaction.reference_type,
        reference_id: editingTransaction.reference_id,
        description: editingTransaction.description || '',
        status: editingTransaction.status || 'Pending'
      })
    } else {
      form.resetFields()

      form.setFieldsValue({
        transaction_date: formatToPicker(new Date()),
        currency_code: 'USD',
        exchange_rate: 1,
        total_debit: 0,
        total_credit: 0,
        status: 'Pending'
      })
    }
  }

  // Load Data
  useEffect(() => {
    if (open) {
      fetchBranches()
      fetchTransactionTypes()
    }
  }, [open])

  useEffect(() => {
    fillEditData()
  }, [editingTransaction])

  // Close Modal
  const handleClose = () => {
    setState(prev => ({
      ...prev,
      open: false,
      editingTransaction: null
    }))

    form.resetFields()
  }

  // Submit
  const onFinish = async values => {
    try {
      const payload = {
        ...values,
        transaction_date: dateServer(values.transaction_date)
      }

      let url = 'transactions'
      let method = 'post'

      if (values.id) {
        url += `/${values.id}`
        method = 'put'
      }

      const res = await request(url, method, payload)

      // SUCCESS
      if (!res?.error) {
        message.success(
          res.message || (values.id ? 'កែប្រែជោគជ័យ!' : 'បង្កើតជោគជ័យ!')
        )

        handleClose()
        onSuccess?.()
        return
      }

      // FIELD VALIDATION ERROR (like ChartOfAccount)
      if (res?.errors) {
        const fieldErrors = []

        Object.keys(res.errors).forEach(key => {
          if (key !== 'message') {
            fieldErrors.push({
              name: key,
              errors: [res.errors[key]?.help || res.errors[key]]
            })
          }
        })

        form.setFields(fieldErrors)

        message.error(res.errors.message || 'Validation error')
        return
      }

      // GENERAL ERROR
      message.error(res?.errors?.message || 'បរាជ័យ!')
    } catch (error) {
      message.error('មានបញ្ហាក្នុងការទាក់ទង Server')
    }
  }

  return (
    <Modal
      title={
        editingTransaction ? 'កែប្រែប្រតិបត្តិការ' : 'បង្កើតប្រតិបត្តិការថ្មី'
      }
      open={open}
      onCancel={handleClose}
      centered
      width={900}
      footer={null}
      maskClosable={false}
    >
      <Form layout='vertical' form={form} onFinish={onFinish}>
        <Form.Item name='id' hidden>
          <Input />
        </Form.Item>

        {/* Transaction Info */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='លេខប្រតិបត្តិការ'
              name='transaction_no'
              rules={[
                {
                  required: true,
                  message: 'សូមបញ្ចូលលេខប្រតិបត្តិការ!'
                }
              ]}
            >
              <Input placeholder='TRX-0001' />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label='កាលបរិច្ឆេទ'
              name='transaction_date'
              rules={[
                {
                  required: true,
                  message: 'សូមជ្រើសរើសកាលបរិច្ឆេទ!'
                }
              ]}
            >
              <DatePicker style={{ width: '100%' }} format='DD MMMM YYYY' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='ប្រភេទប្រតិបត្តិការ'
              name='transaction_type_id'
              rules={[
                {
                  required: true,
                  message: 'សូមជ្រើសរើសប្រភេទប្រតិបត្តិការ!'
                }
              ]}
            >
              <Select
                placeholder='ជ្រើសរើសប្រភេទ'
                loading={loadingTypes}
                options={transactionTypes.map(item => ({
                  label: `${item.name} (${item.code || ''})`,
                  value: item.id
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label='សាខា'
              name='branch_id'
              rules={[
                {
                  required: true,
                  message: 'សូមជ្រើសរើសសាខា!'
                }
              ]}
            >
              <Select
                placeholder='ជ្រើសរើសសាខា'
                loading={loadingBranches}
                options={branches.map(item => ({
                  label: item.name,
                  value: item.id
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Currency */}

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item
              label='រូបិយប័ណ្ណ'
              name='currency_code'
              rules={[
                {
                  required: true,
                  message: 'សូមជ្រើសរើសរូបិយប័ណ្ណ!'
                }
              ]}
            >
              <Select
                placeholder='ជ្រើសរើសរូបិយប័ណ្ណ'
                options={[
                  {
                    label: '🇺🇸 USD',
                    value: 'USD'
                  },
                  {
                    label: '🇰🇭 KHR',
                    value: 'KHR'
                  },
                  {
                    label: '🇹🇭 THB',
                    value: 'THB'
                  },
                  {
                    label: '🇨🇳 CNY',
                    value: 'CNY'
                  }
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item label='អត្រាប្តូរប្រាក់' name='exchange_rate'>
              <InputNumber style={{ width: '100%' }} min={0} precision={2} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              label='ស្ថានភាព'
              name='status'
              rules={[
                {
                  required: true,
                  message: 'សូមជ្រើសរើសស្ថានភាព!'
                }
              ]}
            >
              <Select>
                <Select.Option value='draft'>រង់ចាំ</Select.Option>
                <Select.Option value='posted'>អនុម័ត</Select.Option>
                <Select.Option value='cancelled'>បោះបង់</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Amount */}

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='សរុប Debit'
              name='total_debit'
              rules={[
                {
                  required: true,
                  message: 'សូមបញ្ចូល Total Debit!'
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} min={0} precision={2} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label='សរុប Credit'
              name='total_credit'
              rules={[
                {
                  required: true,
                  message: 'សូមបញ្ចូល Total Credit!'
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} min={0} precision={2} />
            </Form.Item>
          </Col>
        </Row>

        {/* Reference */}

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label='Reference Type' name='reference_type'>
              <Input placeholder='Invoice / Payment / PO' />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label='Reference ID' name='reference_id'>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
        </Row>

        {/* Description */}

        <Form.Item label='ការពិពណ៌នា' name='description'>
          <Input.TextArea rows={4} placeholder='ព័ត៌មានបន្ថែម...' />
        </Form.Item>

        {/* Footer */}

        <Form.Item
          style={{
            textAlign: 'right',
            marginBottom: 0
          }}
        >
          <Space>
            <Button onClick={handleClose}>បោះបង់</Button>

            <Button
              type='primary'
              htmlType='submit'
              className='bg-blue-600 hover:!bg-blue-700 border-none rounded-lg shadow-sm'
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

export default TransactionModal
