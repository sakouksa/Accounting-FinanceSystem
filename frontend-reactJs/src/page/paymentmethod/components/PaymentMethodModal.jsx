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
  Upload,
  Image
} from "antd";
import { request } from '../../../util/request'
import { RiSave3Fill } from 'react-icons/ri'
import { BiSolidEditAlt } from 'react-icons/bi'
import { UploadOutlined } from '@ant-design/icons'
import React from 'react'
import { usePreviewStore } from "../../../store/previewStore";
function PaymentMethodModal({
  open,
  setState,
  editingPaymentMethod,
  onSuccess
}) {
  const [form] = Form.useForm()
  const [fileList, setFileList] = React.useState([]);

  const {
    open: previewOpen,
    imgUrl,
    handleOpenPreview,
    handleClosePreview
  } =
  usePreviewStore();

  // ---------------- BASE64 ----------------
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // ---------------- PREVIEW ----------------
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    handleOpenPreview(file.url || file.preview);
  };

  // ---------------- FILL EDIT ----------------
  const fillEditData = () => {
    if (editingPaymentMethod) {
      form.setFieldsValue({
        id: editingPaymentMethod.id,
        name: editingPaymentMethod.name,
        account_name: editingPaymentMethod.account_name,
        account_number: editingPaymentMethod.account_number,
        status: editingPaymentMethod.status || "active",
      });

      if (editingPaymentMethod.qr_code_url) {
        setFileList([{
          uid: editingPaymentMethod.id,
          name: "qr",
          status: "done",
          url: editingPaymentMethod.qr_code_url,
        }, ]);
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  };


  React.useEffect(() => {
    fillEditData()
  }, [editingPaymentMethod])

  const handleClose = () => {
    setState(prev => ({
      ...prev,
      open: false,
      editingPaymentMethod: null
    }))

    form.resetFields()
  }

  const onFinish = async (values) => {
    let url = "payment-methods";
    let method = "post";

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("account_name", values.account_name);
    formData.append("account_number", values.account_number);
    formData.append("status", values.status);

    if (values.id) {
      url += `/${values.id}`;
      formData.append("_method", "PUT");
      method = "post";
    }

    // QR upload
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("qr_code", fileList[0].originFileObj);
    }

    const res = await request(url, method, formData);

    if (res && !res.errors) {
      message.success(res.message || "ផោគជ័យ!");
      handleClose();
      onSuccess();
    } else {
      message.error(res?.message || "បរាជ័យ!");
    }
  };


  return (
    <Modal
      title={
        editingPaymentMethod
          ? 'កែប្រែវិធីបង់ប្រាក់'
          : 'បង្កើតវិធីបង់ប្រាក់ថ្មី'
      }
      open={open}
      onCancel={handleClose}
      centered
      width={700}
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
              label='ឈ្មោះវិធីបង់ប្រាក់'
              name='name'
              rules={[
                {
                  required: true,
                  message: 'សូមបញ្ចូលឈ្មោះ!'
                }
              ]}
            >
              <Input placeholder='ABA, ACLEDA...' />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label='ឈ្មោះគណនី'
              name='account_name'
              rules={[
                {
                  required: true,
                  message: 'សូមបញ្ចូលឈ្មោះគណនី!'
                }
              ]}
            >
              <Input placeholder='ឈ្មោះម្ចាស់គណនី' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='លេខគណនី'
              name='account_number'
              rules={[
                {
                  required: true,
                  message: 'សូមបញ្ចូលលេខគណនី!'
                }
              ]}
            >
              <Input placeholder='012345678' />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label='ស្ថានភាព'
          name='status'
          initialValue='active'
          rules={[{ required: true }]}
        >
          <Select
            options={[
              {
                label: 'សកម្ម',
                value: 'active'
              },
              {
                label: 'អសកម្ម',
                value: 'inactive'
              }
            ]}
          />
        </Form.Item>
<Col span={12}>
<Form.Item label="QR Code">
  <div className="flex flex-col items-start gap-3">

    <Upload
      customRequest={(e) => e.onSuccess("ok")}
      listType="picture-card"
      fileList={fileList}
      onChange={({ fileList }) => setFileList(fileList)}
      onPreview={handlePreview}
      maxCount={1}
      className="qr-upload"
    >
      {fileList.length < 1 && (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <UploadOutlined style={{ fontSize: 20 }} />
          <span className="text-xs mt-1">Upload QR</span>
        </div>
      )}
    </Upload>

    {/* helper text */}
    <span className="text-xs text-gray-400">
      Recommended: PNG or JPG (square image)
    </span>

    {/* Global Preview */}
    <Image
      wrapperStyle={{ display: "none" }}
      preview={{
        visible: previewOpen,
        onVisibleChange: (v) => !v && handleClosePreview(),
        src: imgUrl,
      }}
    />
  </div>
</Form.Item>
</Col>
        <Form.Item
          style={{
            textAlign: 'right',
            marginBottom: 0
          }}
        >
          <Space>
            <Button onClick={handleClose}>
              បោះបង់
            </Button>

            <Button
              type='primary'
              className='bg-blue-600 hover:bg-blue-600 text-white border-0 flex items-center gap-2'
              htmlType='submit'
              icon={
                form.getFieldValue('id')
                  ? <BiSolidEditAlt />
                  : <RiSave3Fill />
              }
            >
              {form.getFieldValue('id')
                ? 'ធ្វើបច្ចុប្បន្នភាព'
                : 'រក្សាទុក'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PaymentMethodModal