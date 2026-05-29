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
  onSuccess
}) {
  const [form] = Form.useForm()
  const [accountTypes, setAccountTypes] = useState([])
  const [parentAccounts, setParentAccounts] = useState([])
  const [loadingTypes, setLoadingTypes] = useState(false)
  const [loadingParents, setLoadingParents] = useState(false)

  // Fetch Account Types
  const fetchAccountTypes = async () => {
    setLoadingTypes(true)
    const res = await request('account-types', 'get')
    if (res && res.list) {
      setAccountTypes(res.list)
    }
    setLoadingTypes(false)
  }

  // Fetch Parent Accounts (គណនីមេ)
  const fetchParentAccounts = async () => {
    setLoadingParents(true)
    const res = await request('chart-of-accounts', 'get') // ទាញទាំងអស់
    if (res && res.list) {
      setParentAccounts(res.list)
    }
    setLoadingParents(false)
  }

  const fillEditData = () => {
    if (editingChartOfAccount) {
      form.setFieldsValue({
        id: editingChartOfAccount.id,
        account_type_id: editingChartOfAccount.account_type_id,
        parent_account_id: editingChartOfAccount.parent_account_id,
        account_code: editingChartOfAccount.account_code,
        account_name: editingChartOfAccount.account_name,
        account_level: editingChartOfAccount.account_level || 1,
        normal_balance: editingChartOfAccount.normal_balance,
        opening_balance: editingChartOfAccount.opening_balance || 0,
        current_balance: editingChartOfAccount.current_balance || 0,
        currency_code: editingChartOfAccount.currency_code || 'USD',
        is_system: !!editingChartOfAccount.is_system,
        allow_transaction: !!editingChartOfAccount.allow_transaction,
        description: editingChartOfAccount.description || '',
        status: editingChartOfAccount.status || 'Active'
      })
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
    if (open) {
      fetchAccountTypes()
      fetchParentAccounts()
    }
  }, [open])

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

      const res = await request(url, method, values)

      if (res && !res.errors) {
        message.success(
          res.message || (values.id ? 'កែប្រែជោគជ័យ!' : 'បង្កើតជោគជ័យ!')
        )
        handleClose()
        onSuccess()
      } else {
        message.error(res?.message || 'បរាជ័យ!')
      }
    } catch (error) {
      message.error('មានបញ្ហាក្នុងការទាក់ទង Server')
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
                loading={loadingTypes}
                options={accountTypes.map(item => ({
                  label: `${item.name} (${item.code || ''})`,
                  value: item.id // ← ប្តូរទៅ item.id
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label='គណនីមេ' name='parent_account_id'>
              <Select
                placeholder='ជ្រើសរើសគណនីមេ (Optional)'
                allowClear
                loading={loadingParents}
                options={parentAccounts
                  .filter(item => item.id !== editingChartOfAccount?.id) // កុំឱ្យជ្រើសខ្លួនឯង
                  .map(item => ({
                    label: `${item.account_code} - ${item.account_name}`,
                    value: item.id
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
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name='is_system'
              label='ជាគណនីប្រព័ន្ធ'
              valuePropName='checked'
            >
              <Switch checkedChildren='បាទ' unCheckedChildren='ទេ' />
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
              className = 'bg-blue-600 hover:!bg-blue-700 border-none rounded-lg shadow-sm'
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
