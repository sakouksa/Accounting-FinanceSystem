import React from 'react'
import { Row, Col, Card, Typography } from 'antd'
import {
  FileTextOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined
} from '@ant-design/icons'

const { Title: AntTitle, Text } = Typography

function PaymentStats({ stats }) {
  const statsItems = [
    {
      title: 'មិនទាន់ទូទាត់ (Unpaid)',
      value: stats?.total_unpaid || 0,
      icon: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
      isCurrency: false
    },
    {
      title: 'ទូទាត់ខ្លះ (Partial)',
      value: stats?.total_partial || 0,
      icon: <FileTextOutlined />,
      color: '#faad14',
      isCurrency: false
    },
    {
      title: 'បានទូទាត់រួច (Paid)',
      value: stats?.total_paid || 0,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      isCurrency: false
    },
    {
      title: 'ទឹកប្រាក់នៅសល់សរុប(Total Balance)',
      value: stats?.sum_balance || 0,
      icon: <DollarOutlined />,
      color: '#1890ff',
      isCurrency: true
    }
  ]

  return (
    <Row gutter={[16, 16]}>
      {statsItems.map((item, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card
            variant='borderless'
            className='rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative'
            styles={{ body: { padding: 20 } }} 
          >
            <div className='flex items-start justify-between'>
              <div>
                <Text className='text-gray-500 text-sm font-medium block whitespace-nowrap'>
                  {item.title}
                </Text>

                <AntTitle level={3} className='!mb-0 !mt-2 font-bold whitespace-nowrap'>
                  {item.isCurrency ? '$' : ''}
                  {Number(item.value).toLocaleString(undefined, {
                    minimumFractionDigits: item.isCurrency ? 2 : 0,
                    maximumFractionDigits: item.isCurrency ? 2 : 0
                  })}
                </AntTitle>
              </div>

              <div
                className='w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0'
                style={{
                  color: item.color,
                  backgroundColor: `${item.color}15`
                }}
              >
                {item.icon}
              </div>
            </div>
            <div
              className='absolute bottom-0 left-0 h-1 w-full'
              style={{
                background: `linear-gradient(to right, ${item.color}, transparent)`
              }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default PaymentStats
