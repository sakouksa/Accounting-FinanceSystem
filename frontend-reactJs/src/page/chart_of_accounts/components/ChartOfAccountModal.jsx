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
  Switch
} from 'antd'
import { request } from '../../../util/request'
import { RiSave3Fill } from 'react-icons/ri'
import { BiSolidEditAlt } from 'react-icons/bi'
import React, { useState, useEffect } from 'react'

function ChartOfAccountModal ({
  open,
  setState,
  editingChartOfAccount,
  onSuccess,
  accountTypes,
  parentAccounts
}) {
  const [form] = Form.useForm()

  const [loadingTypes, setLoadingTypes] = useState(false)
  const [loadingParents, setLoadingParents] = useState(false)

  const fillEditData = () => {
    if (editingChartOfAccount) {
      form.setFieldsValue({
        ...editingChartOfAccount,
        //convert boolean to switch value
        is_system: !!editingChartOfAccount.is_system,
        allow_transaction: !!editingChartOfAccount.allow_transaction,
      })
      // data static from API, so we need to set it manually
    } else {
      form.resetFields()
      form.setFieldsValue({
        status: 'Active',
        is_system: false,
        allow_transaction: true,
        opening_balance: 0,
        current_balance: 0,
        account_level: 1,
        normal_balance: 'Debit',
        currency_code: 'USD'
      })
    }
  }

  useEffect(() => {
    fillEditData()
  }, [editingChartOfAccount])

  const handleClose = () => {
    setState(prev => ({ ...prev, open: false, editingChartOfAccount: null }))
    form.resetFields()
  }

  const onFinish = async values => {
    try {
      let url = 'chart-of-accounts'
      let method = 'post'

      if (values.id) {
        url += `/${values.id}`
        method = 'put'
      }

      const payload = {
        ...values,
        parent_account_id: values.parent_account_id ? Number(values.parent_account_id) : null,
      }

      const res = await request(url, method, payload)

      // SUCCESS
      if (!res?.error) {
        message.success(res.message || 'ជោគជ័យ!')
        handleClose()
        onSuccess()
        return
      }

      // VALIDATION ERROR
      if (res?.errors) {
        const fieldErrors = []

        Object.keys(res.errors).forEach(key => {
          if (key !== 'message') {
            fieldErrors.push({
              name: key,
              errors: [res.errors[key].help]
            })
          }
        })

        form.setFields(fieldErrors)

        message.error(res.errors.message || 'Validation error')
        return
      }

      message.error(res?.errors?.message || 'បរាជ័យ!')
    } catch (error) {
      message.error('បញ្ហាបច្ចេកទេសបានកើតឡើង 500!')
    }
  }
  return (
    <Modal
      title={editingChartOfAccount ? 'កែប្រែគណនី' : 'បង្កើតគណនីថ្មី'}
      open={open}
      onCancel={handleClose}
      centered
      width={950}
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
              label='ប្រភេទគណនី'
              name='account_type_id'
              rules={[{ required: true, message: 'សូមជ្រើសរើសប្រភេទគណនី!' }]}
            >
              <Select
                placeholder='ជ្រើសរើសប្រភេទគណនី'
                options={accountTypes.map(item => ({
                  label: `${item.name} (${item.code || ''})`,
                  value: item.account_type_id
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
          <Form.Item label='គណនីមេ' name='parent_account_id'>
              <Select
                placeholder='ជ្រើសរើសគណនីមេ (Optional)'
                allowClear
                options={parentAccounts
                  .filter(item => item.parent_account_id !== editingChartOfAccount?.id)
                  .map(item => ({
                    label: item.account_name,
                    value: item.parent_account_id
                  }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item
              label='កូដគណនី'
              name='account_code'
              rules={[{ required: true, message: 'សូមបញ្ចូលកូដគណនី!' }]}
            >
              <Input
                placeholder='ឧ. 1000'
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              label='ឈ្មោះគណនី'
              name='account_name'
              rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះគណនី!' }]}
            >
              <Input placeholder='ឧ. សាច់ប្រាក់ ធនាគារ' />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item label='កម្រិត (Level)' name='account_level'>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='សមតុល្យធម្មតា'
              name='normal_balance'
              rules={[{ required: true, message: 'សូមជ្រើសរើសសមតុល្យធម្មតា!' }]}
            >
              <Select>
                <Select.Option value='Debit'>Debit (ឥណពន្ធ)</Select.Option>
                <Select.Option value='Credit'>Credit (ឥណទាន)</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label='រូបិយប័ណ្ណ' name='currency_code'>
              <Input placeholder='USD, KHR' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label='សមតុល្យដើម' name='opening_balance'>
              <InputNumber style={{ width: '100%' }} min={0} precision={2} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label='សមតុល្យបច្ចុប្បន្ន' name='current_balance'>
              <InputNumber style={{ width: '100%' }} precision={2} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name='allow_transaction'
              label='អនុញ្ញាតធ្វើប្រតិបត្តិការ'
              valuePropName='checked'
            >
              <Switch
                checkedChildren='អនុញ្ញាត'
                unCheckedChildren='មិនអនុញ្ញាត'
                className='
      !bg-red-500
      [&.ant-switch-checked]:!bg-blue-600
    '
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name='is_system'
              label='ជាគណនីប្រព័ន្ធ'
              valuePropName='checked'
            >
              <Switch
                checkedChildren='បាទ'
                unCheckedChildren='ទេ'
                className='
      !bg-red-500
      [&.ant-switch-checked]:!bg-blue-600
    '
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label='ការពិពណ៌នា' name='description'>
          <Input.TextArea rows={3} placeholder='ព័ត៌មានបន្ថែម...' />
        </Form.Item>

        <Form.Item
          label='ស្ថានភាព'
          name='status'
          rules={[{ required: true, message: 'សូមជ្រើសរើសស្ថានភាព!' }]}
        >
          <Select>
            <Select.Option value='Active'>សកម្ម (Active)</Select.Option>
            <Select.Option value='Inactive'>អសកម្ម (Inactive)</Select.Option>
          </Select>
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

export default ChartOfAccountModal
