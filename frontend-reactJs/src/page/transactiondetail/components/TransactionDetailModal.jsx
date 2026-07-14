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
  Select
} from 'antd'
import { request } from '../../../util/request'
import { RiSave3Fill } from 'react-icons/ri'
import { BiSolidEditAlt } from 'react-icons/bi'
import React from 'react'

function TransactionDetailModal({
  open,
  setState,
  editingTransactionDetail,
  transactions = [],
  accounts = [],
  onSuccess
}) {
  const [form] = Form.useForm()

  React.useEffect(() => {
    if (editingTransactionDetail) {
      form.setFieldsValue({
        transaction_id: editingTransactionDetail.transaction_id,
        account_id: editingTransactionDetail.account_id,
        debit_amount: editingTransactionDetail.debit_amount,
        credit_amount: editingTransactionDetail.credit_amount,
        description: editingTransactionDetail.description
      })
    } else {
      form.resetFields()
    }
  }, [editingTransactionDetail, form])

  const handleClose = () => {
    setState(prev => ({
      ...prev,
      open: false,
      editingTransactionDetail: null
    }))
    form.resetFields()
  }

  const onFinish = async values => {
    let url = 'transaction-details'
    let method = 'post'

    if (editingTransactionDetail) {
      url += `/${editingTransactionDetail.id}`
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
      title={
        editingTransactionDetail
          ? 'កែប្រែ Transaction Detail'
          : 'បង្កើត Transaction Detail'
      }
      open={open}
      onCancel={handleClose}
      centered
      width={700}
      footer={null}
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Transaction'
              name='transaction_id'
              rules={[{ required: true }]}
            >
              <Select
                placeholder='ជ្រើសរើស Transaction'
                options={transactions.map(item => ({
                  value: item.id,
                  label: item.transaction_no
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label='Account'
              name='account_id'
              rules={[{ required: true }]}
            >
              <Select
                placeholder='ជ្រើសរើស Account'
                options={accounts.map(item => ({
                  value: item.id,
                  label: item.account_name
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Debit Amount' name='debit_amount'>
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder='0.00'
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='Credit Amount' name='credit_amount'>
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder='0.00'
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label='ពិពណ៌នា' name='description'>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={handleClose}>បោះបង់</Button>

            <Button
              type='primary'
              htmlType='submit'
              className='!bg-blue-500 !border-blue-500 hover:!bg-blue-600'
              icon={
                editingTransactionDetail
                  ? <BiSolidEditAlt />
                  : <RiSave3Fill />
              }
            >
              {editingTransactionDetail
                ? 'ធ្វើបច្ចុប្បន្នភាព'
                : 'រក្សាទុក'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TransactionDetailModal
