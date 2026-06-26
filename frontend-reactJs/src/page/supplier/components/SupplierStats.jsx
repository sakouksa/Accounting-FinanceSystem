import React from 'react'
import { Row, Col, Card, Typography } from 'antd'
import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons'

const { Title: AntTitle, Text } = Typography

const iconMap = {
  UserOutlined: <UserOutlined />,
  CheckCircleOutlined: <CheckCircleOutlined />,
  CloseCircleOutlined: <CloseCircleOutlined />,
  CalendarOutlined: <CalendarOutlined />
}

function SupplierStats ({ stats }) {
  return (
    <Row gutter={[16, 16]}>
      {stats?.map((item, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card
            bordered={false}
            className='rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative'
            bodyStyle={{ padding: 20 }}
          >
            <div className='flex items-start justify-between'>
              {/* Left */}
              <div>
                <Text className='text-gray-500 text-sm font-medium'>
                  {item.title}
                </Text>

                <AntTitle level={3} className='!mb-0 !mt-2 font-bold'>
                  {Number(item.value || 0).toLocaleString()}
                </AntTitle>
              </div>

              {/* Right Icon */}
              <div
                className='w-14 h-14 rounded-2xl flex items-center justify-center text-2xl'
                style={{
                  color: item.color,
                  backgroundColor: `${item.color}15`
                }}
              >
                {iconMap[item.icon]}
              </div>
            </div>

            {/* Footer Line */}
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

export default SupplierStats
