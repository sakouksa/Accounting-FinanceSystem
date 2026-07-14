import React from 'react'
import { Card, Row, Col, Typography } from 'antd'
import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

function UserStatsCard ({ stats }) {
  const statsItems = [
    {
      title: 'អ្នកប្រើប្រាស់សរុប',
      value: stats.total || 0,
      color: '#4f46e5',
      icon: <UserOutlined />
    },
    {
      title: 'គណនីសកម្ម',
      value: stats.active || 0,
      color: '#10b981',
      icon: <CheckCircleOutlined />
    },
    {
      title: 'គណនីអសកម្ម',
      value: stats.inactive || 0,
      color: '#f59e0b',
      icon: <CloseCircleOutlined />
    },
    {
      title: 'បានលុបបណ្តោះអាសន្ន',
      value: stats.deleted || 0,
      color: '#ef4444',
      icon: <DeleteOutlined />
    }
  ]

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {statsItems.map((item, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card
            className="rounded-xl border border-gray-200 bg-white shadow-sm"
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div className="flex justify-between items-center">
              <div>
                <Text type="secondary" className="text-xs font-medium text-gray-500">
                  {item.title}
                </Text>
                <Title level={3} className="m-0 mt-1 font-bold text-gray-800">
                  {item.value}
                </Title>
              </div>
              <div
                className="w-10 h-10 rounded-lg text-lg flex items-center justify-center"
                style={{
                  color: item.color,
                  backgroundColor: `${item.color}12`
                }}
              >
                {item.icon}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default UserStatsCard
