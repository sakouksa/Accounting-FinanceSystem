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
  DatePicker,
  Upload
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { request } from '../../../util/request'
import { RiSave3Fill } from 'react-icons/ri'
import { BiSolidEditAlt } from 'react-icons/bi'
import React, { useEffect, useState } from 'react'
import { formatToPicker, dateServer } from '../../../util/helper'

function ReportModal ({
  open,
  setState,
  editingReport,
  onSuccess,
  branches = []
}) {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])

  const fillEditData = () => {
    if (editingReport) {
      form.setFieldsValue({
        id: editingReport.id,
        report_name: editingReport.report_name,
        report_type: editingReport.report_type,
        branch_id: editingReport.branch_id || null,
        status: editingReport.status || 'generated',
        report_period: [
          formatToPicker(editingReport.start_date),
          formatToPicker(editingReport.end_date)
        ],
        notes: editingReport.notes || editingReport.description
      })

      if (editingReport.file_path) {
        const path = editingReport.file_path
        setFileList([
          {
            uid: '-1',
            name: path.split('/').pop(),
            status: 'done',
            url: path
          }
        ])
      } else {
        setFileList([])
      }
    } else {
      form.resetFields()
      setFileList([])
      form.setFieldsValue({
        report_type: 'balance_sheet',
        branch_id: null,
        status: 'generated',
        report_period: [formatToPicker(new Date()), formatToPicker(new Date())]
      })
    }
  }

  useEffect(() => {
    fillEditData()
  }, [editingReport, open])

  const handleClose = () => {
    setState(prev => ({
      ...prev,
      open: false,
      editingReport: null
    }))
    form.resetFields()
    setFileList([])
  }

  //ពេលប្តូរ File ត្រូវលុប Error ក្រហមចេញភ្លាម
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    form.setFields([{ name: 'files', errors: [] }])
  }

  const onFinish = async values => {
    try {
      let isFileTooLarge = false
      fileList.forEach(file => {
        if (file.originFileObj) {
          const fileSizeInMB = file.originFileObj.size / 1024 / 1024
          if (fileSizeInMB > 10) {
            isFileTooLarge = true
          }
        }
      })

      // Frontend Validation៖ បង្ហាញ Error ក្រហមលើ Input File ពេល Submit
      if (isFileTooLarge) {
        form.setFields([
          {
            name: 'files',
            errors: ['ទំហំឯកសារមិនអាចធំជាង 10MB បានឡើយ។']
          }
        ])
        message.error('សូមពិនិត្យមើលឯកសារភ្ជាប់ឡើងវិញ!')
        return
      }

      let url = 'reports'
      const formData = new FormData()

      if (values.id) {
        url += `/${values.id}`
        formData.append('_method', 'PUT')
        formData.append('id', values.id)
      }

      const [startDate, endDate] = values.report_period || []

      formData.append('report_name', values.report_name)
      formData.append('report_type', values.report_type)
      formData.append('branch_id', values.branch_id || '')
      formData.append('report_date', dateServer(new Date()))
      formData.append('start_date', dateServer(startDate))
      formData.append('end_date', dateServer(endDate))
      formData.append('status', values.status || 'generated')
      formData.append('notes', values.notes || '')

      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('files[]', file.originFileObj)
        } else {
          formData.append('existing_files[]', file.url)
        }
      })
      const res = await request(url, 'post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (!res?.error) {
        message.success(res.message || 'រក្សាទុករបាយការណ៍ជោគជ័យ!')
        handleClose()
        onSuccess()
        return
      }

      // Server-Side Validation Mapping៖ ទាញ Error មកដាក់លើ Input Form នីមួយៗ
      if (res?.errors) {
        const fieldErrors = []
        Object.keys(res.errors).forEach(key => {
          if (key !== 'message' && key !== 'validation') {
            // ករណី Error របស់ files.0 ត្រូវបំប្លែងយកឈ្មោះ field 'files' វិញ
            const fieldName = key.includes('.') ? key.split('.')[0] : key
            const errorMessage =
              res.errors[key]?.[0] || res.errors[key] || 'ទិន្នន័យមិនត្រឹមត្រូវ'
            fieldErrors.push({
              name: fieldName,
              errors: [errorMessage]
            })
          }
        })

        if (res.validationErrors) {
          Object.keys(res.validationErrors).forEach(key => {
            const fieldName = key.includes('.') ? key.split('.')[0] : key
            fieldErrors.push({
              name: fieldName,
              errors: [res.validationErrors[key][0]]
            })
          })
        }

        form.setFields(fieldErrors)
        message.error(res?.message || 'សូមពិនិត្យទិន្នន័យឡើងវិញ!')
        return
      }

      message.error(res?.message || 'បរាជ័យ!')
    } catch (error) {
      message.error('បញ្ហាបច្ចេកទេសបានកើតឡើង 500!')
    }
  }

  return (
    <Modal
      title={
        editingReport
          ? 'កែប្រែទិន្នន័យរបាយការណ៍ហិរញ្ញវត្ថុ'
          : 'បង្កើតរបាយការណ៍ហិរញ្ញវត្ថុថ្មី'
      }
      open={open}
      onCancel={handleClose}
      centered
      width={950}
      footer={null}
      maskClosable={false}
    >
      <Form layout='vertical' form={form} onFinish={onFinish} className='mt-4'>
        <Form.Item name='id' hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='ឈ្មោះរបាយការណ៍ (Report Name)'
              name='report_name'
              rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះរបាយការណ៍!' }]}
            >
              <Input placeholder='ឧទាហរណ៍៖ របាយការណ៍ប្រចាំឆមាសទី១' maxLength={150} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label='ប្រភេទរបាយការណ៍ (Report Type)'
              name='report_type'
              rules={[
                { required: true, message: 'សូមជ្រើសរើសប្រភេទរបាយការណ៍!' }
              ]}
            >
              <Select placeholder='ជ្រើសរើសប្រភេទរបាយការណ៍'>
                <Select.Option value='balance_sheet'>
                  តារាងតុល្យការ (Balance Sheet)
                </Select.Option>
                <Select.Option value='income_statement'>
                  របាយការណ៍លទ្ធផល (Income Statement)
                </Select.Option>
                <Select.Option value='cash_flow'>
                  របាយការណ៍លំហូរសាច់ប្រាក់ (Cash Flow)
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='សាខា (Branch)'
              name='branch_id'
              rules={[{ required: true, message: 'សូមជ្រើសរើសសាខា!' }]}
            >
              <Select
                placeholder='ជ្រើសរើសសាខា'
                allowClear
                showSearch
                optionFilterProp='label'
                options={branches.map(item => ({
                  label: item.name,
                  value: item.id
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label='ស្ថានភាព (Status)' name='status'>
              <Select placeholder='ជ្រើសរើសស្ថានភាព'>
                <Select.Option value='generated'>
                  បានបង្កើតរួចរាល់ (Generated)
                </Select.Option>
                <Select.Option value='draft'>
                  រក្សាទុកព្រាង (Draft)
                </Select.Option>
                <Select.Option value='failed'>
                  មិនជោគជ័យ (Failed)
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label='គ្រាកាលរបាយការណ៍ (Report Period)'
              name='report_period'
              rules={[
                {
                  required: true,
                  message: 'សូមជ្រើសរើសចន្លោះកាលបរិច្ឆេទរបាយការណ៍!'
                }
              ]}
            >
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                format='YYYY-MM-DD'
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label='ភ្ជាប់ឯកសាររបាយការណ៍ (Upload Files)'
              name='files'
              extra='ប្រព័ន្ធអនុញ្ញាតតែឯកសារប្រភេទ PDF, Excel, Word ទំហំមិនលើសពី 10MB'
            >
              <Upload
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                accept='.pdf,.xlsx,.xls,.docx,.doc'
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>
                  ជ្រើសរើសឯកសារ (PDF, Excel...)
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item label='ពណ៌នា/សម្គាល់ (Notes)' name='notes'>
              <Input.TextArea
                rows={3}
                placeholder='បញ្ចូលព័ត៌មានលម្អិត ឬកំណត់សម្គាល់បន្ថែម...'
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          style={{ textAlign: 'right', marginBottom: 0, marginTop: 16 }}
        >
          <Space size={10}>
            <Button onClick={handleClose}>បោះបង់</Button>
            <Button
              type='primary'
              className='bg-indigo-600 hover:!bg-indigo-700 border-none rounded-xl'
              htmlType='submit'
              icon={editingReport ? <BiSolidEditAlt /> : <RiSave3Fill />}
            >
              {editingReport ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ReportModal