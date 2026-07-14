import React from 'react'
import { Card, Row, Col } from 'antd'
import {
  SafetyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons'

const iconMap = {
  SafetyOutlined:      <SafetyOutlined />,
  CheckCircleOutlined: <CheckCircleOutlined />,
  CloseCircleOutlined: <CloseCircleOutlined />,
  CalendarOutlined:    <CalendarOutlined />
}

function RoleStatsCard ({ stats = [] }) {
  return (
    <Row gutter={[12, 12]}>
      {stats.map((item, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card
            className="rounded-xl border border-gray-200 bg-white"
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-500 font-medium">{item.title}</div>
                <div className="text-2xl font-bold text-gray-800 mt-1">{item.value}</div>
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ color: item.color, backgroundColor: `${item.color}15` }}
              >
                {iconMap[item.icon] || <SafetyOutlined />}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default RoleStatsCard
