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
import React, { useEffect } from 'react'

function SupplierModal ({ open, setState, editingSupplier, onSuccess }) {
  const [form] = Form.useForm()

  // =========================
  // Fill form when edit / open
  // =========================
  useEffect(() => {
    if (!open) return

    if (editingSupplier) {
      form.setFieldsValue({
        id: editingSupplier.id,
        supplier_code: editingSupplier.supplier_code,
        supplier_name: editingSupplier.supplier_name,
        supplier_type: editingSupplier.supplier_type,
        tax_number: editingSupplier.tax_number,
        phone: editingSupplier.phone,
        email: editingSupplier.email,
        address: editingSupplier.address,
        credit_limit: editingSupplier.credit_limit,
        opening_balance: editingSupplier.opening_balance,
        current_balance: editingSupplier.current_balance,
        status: editingSupplier.status
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        status: 'active',
        supplier_type: 'retail',
        credit_limit: 0,
        opening_balance: 0,
        current_balance: 0
      })
    }
  }, [open, editingSupplier])

  // =========================
  // Close modal
  // =========================
  const handleClose = () => {
    setState(prev => ({
      ...prev,
      open: false,
      editingSupplier: null
    }))
    form.resetFields()
  }

  // =========================
  // Submit
  // =========================
  const onFinish = async values => {
    try {
      let url = 'suppliers'
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
      title={editingSupplier ? 'កែប្រែ អ្នកផ្គត់ផ្គង់ (Supplier)' : 'បង្កើត អ្នកផ្គត់ផ្គង់ (Supplier)'}
      open={open}
      onCancel={handleClose}
      centered
      width={850}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>

        {/* hidden id */}
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* ជួរទី ១ */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="កូដអ្នកផ្គត់ផ្គង់ (Supplier Code)"
              name="supplier_code"
              rules={[
                { required: true, message: 'សូមបញ្ចូល Supplier Code' },
                { max: 50, message: 'Supplier Code មិនអាចលើសពី ៥០ តួអក្សរឡើយ' }
              ]}
            >
              <Input placeholder="ឧទាហរណ៍៖ SUP001" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="ឈ្មោះអ្នកផ្គត់ផ្គង់ (Supplier Name)"
              name="supplier_name"
              rules={[
                { required: true, message: 'សូមបញ្ចូលឈ្មោះ Supplier' },
                { max: 150, message: 'ឈ្មោះមិនអាចលើសពី ១៥០ តួអក្សរឡើយ' }
              ]}
            >
              <Input placeholder="សូមបញ្ចូលឈ្មោះក្រុមហ៊ុន ឬបុគ្គល" />
            </Form.Item>
          </Col>
        </Row>

        {/* ជួរទី ២ */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label="អ្នកទំនាក់ទំនង (Contact Person)" 
              name="contact_person"
              rules={[{ max: 150, message: 'ឈ្មោះអ្នកទំនាក់ទំនងមិនអាចលើសពី ១base តួអក្សរឡើយ' }]}
            >
              <Input placeholder="ឈ្មោះអ្នកតំណាង ឬអ្នកទំនាក់ទំនង" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item 
              label="លេខអត្តសញ្ញាណកម្មសារពើពន្ធ (Tax Number)" 
              name="tax_number"
              rules={[{ max: 100, message: 'លេខពន្ធមិនអាចលើសពី ១០០ តួអក្សរឡើយ' }]}
            >
              <Input placeholder="សូមបញ្ចូលលេខប៉ាតង់ ឬលេខពន្ធ" />
            </Form.Item>
          </Col>
        </Row>

        {/* ជួរទី ៣ */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="លេខទូរស័ព្ទ (Phone)"
              name="phone"
              rules={[
                { max: 30, message: 'លេខទូរស័ព្ទមិនអាចលើសពី ៣០ ខ្ទង់ឡើយ' },
                {
                  pattern: /^[0-9+\- ]{8,30}$/,
                  message: 'ទម្រង់លេខទូរស័ព្ទមិនត្រឹមត្រូវ'
                }
              ]}
            >
              <Input placeholder="ឧទាហរណ៍៖ 012345678" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="អ៊ីមែល (Email)"
              name="email"
              rules={[
                { type: 'email', message: 'ទម្រង់ Email មិនត្រឹមត្រូវ' },
                { max: 150, message: 'Email មិនអាចលើសពី ១៥០ តួអក្សរឡើយ' }
              ]}
            >
              <Input placeholder="ឧទាហរណ៍៖ supplier@example.com" />
            </Form.Item>
          </Col>
        </Row>

        {/* អាសយដ្ឋាន */}
        <Form.Item label="អាសយដ្ឋាន (Address)" name="address">
          <Input.TextArea rows={2} placeholder="សូមបញ្ចូលអាសយដ្ឋានបច្ចុប្បន្ន" />
        </Form.Item>

        {/* សមតុល្យទឹកប្រាក់ */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="សមតុល្យដើមគ្រា (Opening Balance)" name="opening_balance">
              <InputNumber style={{ width: '100%' }} min={0} placeholder="0.00" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="សមតុល្យបច្ចុប្បន្ន (Current Balance)" name="current_balance">
              <InputNumber style={{ width: '100%' }} min={0} placeholder="0.00" />
            </Form.Item>
          </Col>
        </Row>

        {/* ស្ថានភាព */}
        <Form.Item
          label="ស្ថានភាព (Status)"
          name="status"
          rules={[{ required: true, message: 'សូមជ្រើសរើសស្ថានភាព' }]}
        >
          <Select
            placeholder="--- ជ្រើសរើសស្ថានភាព ---"
            options={[
              { value: 'active', label: 'សកម្ម (Active)' },
              { value: 'inactive', label: 'មិនសកម្ម (Inactive)' }
            ]}
          />
        </Form.Item>

        {/* ប៊ូតុងសកម្មភាព */}
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={handleClose}>
              បោះបង់
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600"
              icon={
                editingSupplier
                  ? <BiSolidEditAlt />
                  : <RiSave3Fill />
              }
            >
              {editingSupplier ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក'}
            </Button>
          </Space>
        </Form.Item>

      </Form>
    </Modal>
  )
}

export default SupplierModal
