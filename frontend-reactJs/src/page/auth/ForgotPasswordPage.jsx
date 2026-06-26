import React from "react";
import { MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import { request } from "../../util/request";

const ForgotPasswordPage = () => {
  const onFinish = async (values) => {
    const res = await request(
      "forgot-password",
      "post",
      {
        email: values.email,
      }
    );

    if (res && !res.error) {
      message.success(
        res.message ||
          "Password reset link has been sent to your email."
      );
    } else {
      message.error(
        res?.errors?.message ||
          "មិនអាចផ្ញើ Reset Link បានទេ!"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ភ្លេចលេខសម្ងាត់
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          បញ្ចូលអ៊ីមែលរបស់អ្នក ដើម្បីទទួលបាន Reset Password Link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <Form
            layout="vertical"
            requiredMark="optional"
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              label={
                <span className="font-medium text-gray-700">
                  អ៊ីមែល
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "សូមបញ្ចូលអ៊ីមែល!",
                },
                {
                  type: "email",
                  message:
                    "សូមបញ្ចូលអ៊ីមែលឱ្យត្រឹមត្រូវ!",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="អ៊ីមែល"
                className="rounded-md"
                prefix={
                  <MailOutlined className="text-gray-400" />
                }
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                block
                size="large"
                type="primary"
                htmlType="submit"
                className="bg-indigo-600 hover:bg-indigo-700 border-none font-semibold text-base shadow-sm h-11"
              >
                ផ្ញើ Reset Link
              </Button>

              <div className="mt-6 text-center text-sm text-gray-600">
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-150"
                >
                  ត្រឡប់ទៅទំព័រចូលប្រើប្រាស់
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;