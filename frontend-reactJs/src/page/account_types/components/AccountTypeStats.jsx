import React from 'react'
import { Row, Col, Card, Typography } from 'antd'
import {
  BankOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'

const { Title: AntTitle, Text } = Typography

const iconMap = {
  BankOutlined: <BankOutlined />,
  CheckCircleOutlined: <CheckCircleOutlined />,
  ArrowUpOutlined: <ArrowUpOutlined />,
  ArrowDownOutlined: <ArrowDownOutlined />,
  CalendarOutlined: <CalendarOutlined />
}

function AccountTypeStats ({ stats }) {
  return (
    <Row gutter={[16, 16]}>
      {stats.map((item, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card
            className='rounded-2xl border-none shadow-sm overflow-hidden relative hover:shadow-lg transition-all duration-300'
            styles={{ body: { padding: 20 } }}
          >
            <div className='flex justify-between items-start'>
              <div>
                <Text type='secondary' className='text-xs font-medium'>
                  {item.title}
                </Text>

                <AntTitle level={3} className='m-0 mt-1 font-bold'>
                  {item.value}
                </AntTitle>
              </div>

              <div
                className='p-3 rounded-xl bg-gray-50 text-xl'
                style={{
                  color: item.color,
                  backgroundColor: `${item.color}15`
                }}
              >
                {iconMap[item.icon]}
              </div>
            </div>

            {/* Bottom Gradient */}
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

export default AccountTypeStats
