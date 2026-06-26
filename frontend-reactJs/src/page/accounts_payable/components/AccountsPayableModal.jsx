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
function AccountsPayableModal ({
  open,
  setState,
  editingAccountsPayable,
  onSuccess,
  suppliers = []
}) {
  const [form] = Form.useForm()

  const [loadingTypes, setLoadingTypes] = useState(false)
  const [loadingParents, setLoadingParents] = useState(false)

  const fillEditData = () => {
    if (editingAccountsPayable) {
      form.setFieldsValue({
        ...editingAccountsPayable,
        // Helper formatToPicker
        bill_date: formatToPicker(editingAccountsPayable.bill_date),
        due_date: formatToPicker(editingAccountsPayable.due_date)
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        status: 'unpaid',
        total_amount: 0,
        paid_amount: 0,
        balance_amount: 0
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
  }, [editingAccountsPayable])

  const handleClose = () => {
    setState(prev => ({ ...prev, open: false, editingAccountsPayable: null }))
    form.resetFields()
  }

  const onFinish = async values => {
    try {
      let url = 'accounts-payable'
      let method = 'post'

      if (values.id) {
        url += `/${values.id}`
        method = 'put'
      }
      const payload = {
        ...values,
        bill_date: dateServer(values.bill_date),
        due_date: dateServer(values.due_date),
        supplier_id: Number(values.supplier_id)
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
      title={
        editingAccountsPayable
          ? 'កែប្រែវិក្កយបត្រត្រូវទូទាត់'
          : 'បង្កើតវិក្កយបត្រត្រូវទូទាត់ថ្មី'
      }
      open={open}
      onCancel={handleClose}
      centered
      width={900}
      footer={null}
      maskClosable={false}
    >
      <Form
        layout='vertical'
        form={form}
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
      >
        {/* Hidden ID field for update */}
        <Form.Item name='id' hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='អ្នកផ្គត់ផ្គង់'
              name='supplier_id'
              rules={[
                { required: true, message: 'សូមជ្រើសរើសអ្នកផ្គត់ផ្គង់!' }
              ]}
            >
              <Select
                placeholder='ជ្រើសរើសអ្នកផ្គត់ផ្គង់'
                showSearch
                optionFilterProp='label'
                options={suppliers.map(item => ({
                  label: item.supplier_name,
                  value: item.id
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label='លេខវិក្កយបត្រ (Bill No)'
              name='bill_no'
              rules={[{ required: true, message: 'សូមបញ្ចូលលេខវិក្កយបត្រ!' }]}
            >
              <Input
                placeholder='ឧ. INV-2026-0001'
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='កាលបរិច្ឆេទវិក្កយបត្រ'
              name='bill_date'
              rules={[
                { required: true, message: 'សូមជ្រើសរើសកាលបរិច្ឆេទវិក្កយបត្រ!' }
              ]}
            >
              <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label='ថ្ងៃកំណត់ទូទាត់ (Due Date)'
              name='due_date'
              rules={[
                { required: true, message: 'សូមជ្រើសរើសថ្ងៃកំណត់ទូទាត់!' }
              ]}
            >
              <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item
              label='ទឹកប្រាក់សរុប'
              name='total_amount'
              rules={[{ required: true, message: 'សូមបញ្ចូលទឹកប្រាក់សរុប!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                placeholder='0.00'
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              label='ទឹកប្រាក់បានទូទាត់'
              name='paid_amount'
              rules={[
                { required: true, message: 'សូមបញ្ចូលទឹកប្រាក់បានទូទាត់!' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                placeholder='0.00'
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              label='ទឹកប្រាក់នៅសល់'
              name='balance_amount'
              rules={[{ required: true, message: 'សូមបញ្ចូលទឹកប្រាក់នៅសល់!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                precision={2}
                placeholder='0.00'
                readOnly
                className='bg-gray-50'
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label='ស្ថានភាព'
              name='status'
              rules={[{ required: true, message: 'សូមជ្រើសរើសស្ថានភាព!' }]}
            >
              <Select placeholder='ជ្រើសរើសស្ថានភាព'>
                <Select.Option value='unpaid'>មិនទាន់ទូទាត់</Select.Option>
                <Select.Option value='partial'>ទូទាត់បានខ្លះ</Select.Option>
                <Select.Option value='paid'>បានទូទាត់រួច</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          style={{ textAlign: 'right', marginBottom: 0, marginTop: 16 }}
        >
          <Space>
            <Button onClick={handleClose}>បោះបង់</Button>
            <Button
              type='primary'
              className='bg-blue-600 hover:!bg-blue-700 border-none rounded-lg shadow-sm'
              htmlType='submit'
              icon={
                editingAccountsPayable ? <BiSolidEditAlt /> : <RiSave3Fill />
              }
            >
              {editingAccountsPayable ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AccountsPayableModal
