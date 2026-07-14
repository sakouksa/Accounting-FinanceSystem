import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  message,
  Row,
  Col,
  InputNumber,
  Select,
  DatePicker
} from 'antd'
import { request } from '../../../util/request'
import { RiSave3Fill } from 'react-icons/ri'
import { BiSolidEditAlt } from 'react-icons/bi'
import React, { useEffect, useCallback } from 'react'
import dayjs from 'dayjs'

function AccountsReceivableModal ({
  open,
  setState,
  editingAccountsReceivable,
  customers = [],
  onSuccess
}) {
  const [form] = Form.useForm()

  // អនុគមន៍រៀបចំតម្លៃលំនាំដើម (ទាំង Edit និង Create)
  const initFormValues = useCallback(() => {
    if (editingAccountsReceivable) {
      // === ករណី EDIT ===
      form.setFieldsValue({
        id: editingAccountsReceivable.id,
        customer_id: editingAccountsReceivable.customer_id,
        invoice_no: editingAccountsReceivable.invoice_no,
        invoice_date: editingAccountsReceivable.invoice_date
          ? dayjs(editingAccountsReceivable.invoice_date)
          : null,
        due_date: editingAccountsReceivable.due_date
          ? dayjs(editingAccountsReceivable.due_date)
          : null,
        total_amount: editingAccountsReceivable.total_amount,
        paid_amount: editingAccountsReceivable.paid_amount,
        balance_amount: editingAccountsReceivable.balance_amount,
        status: editingAccountsReceivable.status
      })
    } else {
      // === ករណី CREATE ថ្មី ===
      form.resetFields()
      form.setFieldsValue({
        invoice_date: dayjs(),
        total_amount: 0,
        paid_amount: 0,
        balance_amount: 0,
        status: 'unpaid'
      })
    }
  }, [editingAccountsReceivable, form])

  // ប្រើ useEffect សម្រាប់កំណត់តម្លៃចូល Form ពេលបើក Modal
  useEffect(() => {
    if (open) {
      initFormValues()
    }
  }, [open, initFormValues])

  // គណនា Balance Amount ដោយស្វ័យប្រវត្តិ
  const handleValuesChange = (changedValues, allValues) => {
    if (
      changedValues.total_amount !== undefined ||
      changedValues.paid_amount !== undefined
    ) {
      const total = allValues.total_amount || 0
      const paid = allValues.paid_amount || 0
      const balance = total - paid

      form.setFieldsValue({
        balance_amount: balance >= 0 ? balance : 0
      })
    }
  }

  // បិទ Modal
  const handleClose = () => {
    setState(prev => ({
      ...prev,
      open: false,
      editingAccountsReceivable: null
    }))
    form.resetFields()
  }

  // Submit ទិន្នន័យទៅ Backend
  const onFinish = async values => {
    try {
      const payload = {
        ...values,
        invoice_date: values.invoice_date
          ? values.invoice_date.format('YYYY-MM-DD')
          : null,
        due_date: values.due_date ? values.due_date.format('YYYY-MM-DD') : null
      }

      let url = 'accounts-receivable'
      let method = 'post'

      if (values.id) {
        url += `/${values.id}`
        method = 'put'
      }

      const res = await request(url, method, payload)

      // ករណីជោគជ័យ
      if (res && !res.error) {
        message.success(res.message || 'រក្សាទុកជោគជ័យ!')
        handleClose()
        onSuccess()
        return
      }

      // ករណីមានកំហុស Validation ពី Backend
      if (res && res.error && res.errors) {
        const fieldErrors = []

        Object.keys(res.errors).forEach(key => {
          if (key !== 'message') {
            fieldErrors.push({
              name: key,
              errors: [res.errors[key].help]
            })
          }
        })

        if (fieldErrors.length > 0) {
          form.setFields(fieldErrors)
        }
        message.error(res.errors.message || 'សូមពិនិត្យទិន្នន័យឡើងវិញ!')
        return
      }

    } catch (err) {
      console.error(err)
      message.error('បញ្ហាបច្ចេកទេសបានកើតឡើង 500!')
    }
  }

  return (
    <Modal
      title={
        editingAccountsReceivable
          ? 'កែប្រែ គណនីដែលត្រូវទទួលប្រាក់'
          : 'បង្កើត គណនីដែលត្រូវទទួលប្រាក់'
      }
      open={open}
      onCancel={handleClose}
      centered
      width={900}
      footer={null}
      mask={{ closable: false }}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
      >
        {/* hidden id */}
        <Form.Item name='id' hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='ជ្រើសរើសអតិថិជន'
              name='customer_id'
              rules={[{ required: true, message: 'សូមជ្រើសរើសអតិថិជន' }]}
            >
              <Select
                showSearch
                placeholder='--- ជ្រើសរើសអតិថិជន ---'
                optionFilterProp='children'
                fieldNames={{ label: 'customer_name', value: 'id' }}
                options={customers}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label='លេខវិក្កយបត្រ'
              name='invoice_no'
              rules={[
                { required: true, message: 'សូមបញ្ចូលលេខវិក្កយបត្រ' },
                { max: 100, message: 'មិនអាចលើសពី ១០០ តួអក្សរឡើយ' }
              ]}
            >
              <Input placeholder='ឧទាហរណ៍៖ INV-2026-0001' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='ថ្ងៃចេញវិក្កយបត្រ'
              name='invoice_date'
              rules={[
                { required: true, message: 'សូមជ្រើសរើសថ្ងៃចេញវិក្កយបត្រ' }
              ]}
            >
              <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label='ថ្ងៃកំណត់ទូទាត់'
              name='due_date'
              dependencies={['invoice_date']}
              rules={[
                { required: true, message: 'សូមជ្រើសរើសថ្ងៃកំណត់ទូទាត់' },
                ({ getFieldValue }) => ({
                  validator (_, value) {
                    if (
                      !value ||
                      !getFieldValue('invoice_date') ||
                      value.isAfter(getFieldValue('invoice_date')) ||
                      value.isSame(getFieldValue('invoice_date'), 'day')
                    ) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error(
                        'ថ្ងៃកំណត់ទូទាត់ត្រូវតែស្មើ ឬក្រោយថ្ងៃចេញវិក្កយបត្រ'
                      )
                    )
                  }
                })
              ]}
            >
              <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label='ទឹកប្រាក់សរុប'
              name='total_amount'
              rules={[{ required: true, message: 'សូមបញ្ចូលទឹកប្រាក់សរុប' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                placeholder='0.00'
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label='បានទូទាត់' name='paid_amount'>
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                placeholder='0.00'
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label='សមតុល្យនៅសល់'
              name='balance_amount'
            >
              <InputNumber
                style={{ width: '100%' }}
                disabled
                precision={2}
                placeholder='0.00'
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label='ស្ថានភាពទូទាត់'
          name='status'
          rules={[{ required: true, message: 'សូមជ្រើសរើសស្ថានភាព' }]}
        >
          <Select
            placeholder='--- ជ្រើសរើសស្ថានភាព ---'
            options={[
              { value: 'unpaid', label: 'មិនទាន់ទូទាត់' },
              { value: 'partial', label: 'ទូទាត់ខ្លះ' },
              { value: 'paid', label: 'បានទូទាត់រួច' }
            ]}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={handleClose}>បោះបង់</Button>

            <Button
              type='primary'
              htmlType='submit'
              className='bg-blue-600'
              icon={
                editingAccountsReceivable ? <BiSolidEditAlt /> : <RiSave3Fill />
              }
            >
              {editingAccountsReceivable ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AccountsReceivableModal
