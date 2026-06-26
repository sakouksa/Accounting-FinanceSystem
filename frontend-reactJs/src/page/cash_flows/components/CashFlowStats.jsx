import React from 'react'
import { Row, Col, Card, Typography } from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined
} from '@ant-design/icons'

const { Title: AntTitle, Text } = Typography

function CashFlowStats ({ stats }) {
  const statsItems = [
    {
      title: 'លំហូរចូលសរុប (Total Inflow)',
      value: stats?.total_inflow || 0,
      icon: <ArrowUpOutlined />,
      color: '#10b981'
    },
    {
      title: 'លំហូរចេញសរុប (Total Outflow)',
      value: stats?.total_outflow || 0,
      icon: <ArrowDownOutlined />,
      color: '#f43f5e'
    },
    {
      title: 'សាច់ប្រាក់សុទ្ធ (Net Cash Flow)',
      value: stats?.net_cash_flow || 0,
      icon: <WalletOutlined />,
      color: (stats?.net_cash_flow || 0) >= 0 ? '#3b82f6' : '#ef4444'
    }
  ]

  return (
    <Row gutter={[16, 16]}>
      {statsItems.map((item, index) => {
        const isNetCash = index === 2
        return (
          <Col xs={24} sm={24} lg={8} key={index}>
            <Card
              variant='borderless'
              className='rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative border border-gray-100/60 bg-white'
              styles={{ body: { padding: '24px' } }}
            >
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Text className='text-gray-400 text-xs font-semibold uppercase tracking-wider block'>
                    {item.title}
                  </Text>
                  <AntTitle
                    level={2}
                    className={`!mb-0 !mt-1 font-bold tracking-tight whitespace-nowrap`}
                    style={{
                      color: isNetCash && item.value < 0 ? '#ef4444' : '#1e293b'
                    }}
                  >
                    {item.value < 0 ? '- ' : ''}
                    {'$'}
                    {Number(Math.abs(item.value)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </AntTitle>
                </div>
                <div
                  className='w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-300 hover:scale-105'
                  style={{
                    color: item.color,
                    backgroundColor: `${item.color}12`
                  }}
                >
                  {item.icon}
                </div>
              </div>
              <div
                className='absolute bottom-0 left-0 h-[3px] w-full'
                style={{
                  background: `linear-gradient(to right, ${item.color}, ${item.color}33)`
                }}
              />
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

export default CashFlowStats
