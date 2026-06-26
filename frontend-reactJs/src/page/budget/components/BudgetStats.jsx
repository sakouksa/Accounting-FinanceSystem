import React from 'react'
import { Row, Col, Card, Typography } from 'antd'
import {
  DashboardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  WalletOutlined,
  FileSyncOutlined
} from '@ant-design/icons'

const { Title: AntTitle, Text } = Typography

function BudgetStats ({ stats }) {
  const statsItems = [
    {
      title: 'ចំនួនថវិកាសរុប',
      value: stats?.total_budget || 0,
      icon: <DashboardOutlined />,
      color: '#1890ff',
      isCurrency: false
    },
    {
      title: 'ថវិកាសកម្ម',
      value: stats?.active_budget || 0,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      isCurrency: false
    },
    {
      title: 'ថវិកាអសកម្ម',
      value: stats?.inactive_budget || 0,
      icon: <CloseCircleOutlined />,
      color: '#ff4d4f',
      isCurrency: false
    },
    {
      title: 'ថវិកាដែលបានបែងចែក',
      value: stats?.allocated_amount || 0,
      icon: <DollarOutlined />,
      color: '#722ed1',
      isCurrency: true
    },
    {
      title: 'ថវិកាដែលបានប្រើ',
      value: stats?.used_amount || 0,
      icon: <WalletOutlined />,
      color: '#faad14',
      isCurrency: true
    },
    {
      title: 'ថវិកានៅសល់សរុប',
      value: stats?.remaining_amount || 0,
      icon: <FileSyncOutlined />,
      color: '#13c2c2',
      isCurrency: true
    }
  ]

  return (
    <Row gutter={[16, 16]}>
      {statsItems.map((item, index) => (
        <Col xs={24} sm={12} lg={4} key={index}>
          <Card
            variant='borderless'
            className='rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative'
            styles={{ body: { padding: 20 } }}
          >
            <div className='flex items-start justify-between'>
              <div>
                <Text className='text-gray-500 text-xs font-medium block whitespace-nowrap'>
                  {item.title}
                </Text>

                <AntTitle
                  level={4}
                  className='!mb-0 !mt-2 font-bold whitespace-nowrap'
                >
                  {item.isCurrency ? '$' : ''}
                  {Number(item.value).toLocaleString(undefined, {
                    minimumFractionDigits: item.isCurrency ? 2 : 0,
                    maximumFractionDigits: item.isCurrency ? 2 : 0
                  })}
                </AntTitle>
              </div>

              <div
                className='w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0'
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

export default BudgetStats
