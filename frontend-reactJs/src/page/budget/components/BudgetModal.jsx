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
import React, { useEffect } from 'react'
import { formatToPicker, dateServer } from '../../../util/helper'

function BudgetModal ({
  open,
  onClose,
  editingBudget,
  onSuccess,
  accounts = [],
  branches = []
}) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (editingBudget) {
      form.setFieldsValue({
        ...editingBudget,
        start_date: formatToPicker(editingBudget.start_date),
        end_date: formatToPicker(editingBudget.end_date)
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        status: 'active',
        allocated_amount: 0,
        used_amount: 0
      })
    }
  }, [editingBudget, open])

  const onFinish = async values => {
    try {
      const url = editingBudget ? `budgets/${editingBudget.id}` : 'budgets'
      const method = editingBudget ? 'put' : 'post'

      const payload = {
        ...values,
        start_date: dateServer(values.start_date),
        end_date: dateServer(values.end_date),
        allocated_amount: Number(values.allocated_amount || 0),
        used_amount: Number(values.used_amount || 0)
      }

      const res = await request(url, method, payload)

      if (res && !res.error) {
        message.success(res.message || 'ជោគជ័យ!')
        onClose()
        onSuccess()
      } else {
        message.error(res?.errors?.message || 'បរាជ័យ!')
      }
    } catch (error) {
      message.error('បញ្ហាបច្ចេកទេស!')
    }
  }

  return (
    <Modal
      title={editingBudget ? 'កែប្រែថវិកា' : 'បង្កើតថវិកាថ្មី'}
      open={open}
      onCancel={onClose}
      centered
      width={950}
      footer={null}
      mask={{ closable: false }}
    >
      <Form layout='vertical' form={form} onFinish={onFinish} className='mt-4'>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label='ឈ្មោះថវិកា'
              name='budget_name'
              rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះថវិកា' }]}
            >
              <Input placeholder='ឧ. ថវិកាទីផ្សារ' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='ឆ្នាំហិរញ្ញវត្ថុ'
              name='fiscal_year'
              rules={[{ required: true, message: 'សូមបញ្ចូលឆ្នាំ' }]}
            >
              <Input placeholder='ឧ. 2026' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label='សាខា'
              name='branch_id'
              rules={[{ required: true, message: 'សូមជ្រើសរើសសាខា' }]}
            >
              <Select
                placeholder='ជ្រើសរើសសាខា'
                options={branches.map(b => ({ label: b.name, value: b.id }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='គណនី'
              name='account_id'
              rules={[{ required: true, message: 'សូមជ្រើសរើសគណនី' }]}
            >
              <Select
                placeholder='ជ្រើសរើសគណនី'
                options={accounts.map(a => ({
                  label: a.account_name,
                  value: a.id
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label='ទឹកប្រាក់សរុប ($)'
              name='allocated_amount'
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} precision={2} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='ស្ថានភាព'
              name='status'
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value='active'>សកម្ម</Select.Option>
                <Select.Option value='closed'>អសកម្ម</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label='ថ្ងៃចាប់ផ្តើម'
              name='start_date'
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='ថ្ងៃបញ្ចប់'
              name='end_date'
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <div className='flex justify-end pt-4 border-t'>
          <Space>
            <Button onClick={onClose}>បោះបង់</Button>
            <Button
              type='primary'
              className=' bg-blue-500'
              htmlType='submit'
              icon={editingBudget ? <BiSolidEditAlt /> : <RiSave3Fill />}
            >
              {editingBudget ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក'}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  )
}

export default BudgetModal
