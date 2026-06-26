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

function CashFlowModal ({
  open,
  setState,
  editingCashFlow,
  onSuccess,
  chart_of_accounts = [],
  transaction = []
}) {
  const [form] = Form.useForm()
  const flowType = Form.useWatch('flow_type', form)

  // Pre-fill form field data
  const fillEditData = () => {
    if (editingCashFlow) {
      form.setFieldsValue({
        ...editingCashFlow,
        flow_date: formatToPicker(editingCashFlow.flow_date)
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        flow_type: 'inflow', // Sync default with backend stats rule
        amount: 0,
        flow_date: formatToPicker(new Date())
      })
    }
  }

  useEffect(() => {
    fillEditData()
  }, [editingCashFlow, open])

  // Clear states and close modal
  const handleClose = () => {
    setState(prev => ({ ...prev, open: false, editingCashFlow: null }))
    form.resetFields()
  }

  // Handle server request submission
  const onFinish = async values => {
    try {
      let url = 'cashflow'
      let method = 'post'

      if (values.id) {
        url += `/${values.id}`
        method = 'put'
      }
      const payload = {
        id: values.id,
        transaction_id: values.transaction_id || null,
        flow_date: dateServer(values.flow_date),
        flow_type: values.flow_type,
        account_id: values.account_id,
        amount: Number(values.amount),
        description: values.description || null
      }

      const res = await request(url, method, payload)

      if (!res?.error) {
        message.success(res.message || 'រក្សាទុកជោគជ័យ!')
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

  // Local categorization rule for account filtering
  const filteredAccounts = chart_of_accounts.filter(acc => {
    if (flowType === 'inflow') {
      return true // Dynamically filter or display income mapping here
    }
    return true // Dynamically filter or display expense mapping here
  })

  return (
    <Modal
      title={
        editingCashFlow ? 'កែប្រែទិន្នន័យលំហូរថវិកា' : 'បង្កើតលំហូរថវិកាថ្មី'
      }
      open={open}
      onCancel={handleClose}
      centered
      width={950} // Optimized layout grid constraint
      footer={null}
      maskClosable={false}
    >
      <Form layout='vertical' form={form} onFinish={onFinish} className='mt-4'>
        {/* Hidden ID field for update */}
        <Form.Item name='id' hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          {/* Flow Type Field */}
          <Col xs={24} sm={12}>
            <Form.Item
              label='ប្រភេទលំហូរថវិកា (Flow Type)'
              name='flow_type'
              rules={[
                { required: true, message: 'សូមជ្រើសរើសប្រភេទលំហូរថវិកា!' }
              ]}
            >
              <Select
                placeholder='ជ្រើសរើសប្រភេទ'
                onChange={() => form.setFieldsValue({ account_id: null })} // Clear dynamic node on change
              >
                <Select.Option value='inflow'>ចំណូល (Inflow)</Select.Option>
                <Select.Option value='outflow'>ចំណាយ (Outflow)</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Transaction Ref Field */}
          <Col xs={24} sm={12}>
            <Form.Item
              label='លេខប្រតិបត្តិការយោង (Transaction No)'
              name='transaction_id'
            >
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
          {/* Unified Chart of Account Field (Fixes defined reference crash) */}
          <Col xs={24}>
            <Form.Item
              label={
                flowType === 'inflow'
                  ? 'គណនេយ្យត្រូវប្រមូល (Chart Of Account - Inflow)'
                  : 'គណនេយ្យត្រូវទូទាត់ (Chart Of Account - Outflow)'
              }
              name='account_id'
              rules={[{ required: true, message: 'សូមជ្រើសរើសគណនេយ្យ!' }]}
            >
              <Select
                placeholder='ស្វែងរក ឬជ្រើសរើសគណនីគណនេយ្យ...'
                showSearch
                optionFilterProp='label'
                options={filteredAccounts.map(item => ({
                  label: `${item.account_code} - ${item.account_name}`,
                  value: item.id
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Date Picker Field */}
          <Col xs={24} sm={12}>
            <Form.Item
              label='កាលបរិច្ឆេទលំហូរថវិកា (Flow Date)'
              name='flow_date'
              rules={[
                { required: true, message: 'សូមជ្រើសរើសថ្ងៃលំហូរថវិកា!' }
              ]}
            >
              <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
            </Form.Item>
          </Col>

          {/* Amount Field */}
          <Col xs={24} sm={12}>
            <Form.Item
              label='ទឹកប្រាក់ (Amount)'
              name='amount'
              rules={[{ required: true, message: 'សូមបញ្ចូលទឹកប្រាក់!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                className='h-10 !pt-1'
                min={0}
                precision={2}
                placeholder='0.00'
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Description Textarea */}
          <Col xs={24}>
            <Form.Item label='ពណ៌នា/សម្គាល់ (Description)' name='description'>
              <Input.TextArea
                rows={3}
                placeholder='បញ្ចូលព័ត៌មានលម្អិតបន្ថែម ឬលេខយោងផ្សេងៗ...'
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Action Controls */}
        <Form.Item
          style={{ textAlign: 'right', marginBottom: 0, marginTop: 16 }}
        >
          <Space size={10}>
            <Button onClick={handleClose} className=' rounded-xl px-5'>
              បោះបង់
            </Button>
            <Button
              type='primary'
              className='bg-indigo-600 hover:!bg-indigo-700 border-none rounded-xl shadow-sm px-5 font-medium'
              htmlType='submit'
              icon={editingCashFlow ? <BiSolidEditAlt /> : <RiSave3Fill />}
            >
              {editingCashFlow ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CashFlowModal
