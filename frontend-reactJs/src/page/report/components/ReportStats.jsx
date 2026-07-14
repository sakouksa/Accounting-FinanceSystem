import React from 'react'
import { Row, Col, Card, Typography } from 'antd'
import {
  FileTextOutlined,
  PieChartOutlined,
  FundOutlined,
  SlidersOutlined
} from '@ant-design/icons'

const { Title: AntTitle, Text } = Typography

function ReportStats ({ stats }) {
  const statsItems = [
    {
      title: 'របាយការណ៍សរុប',
      value: stats?.total_reports || stats?.total || 0,
      icon: <FileTextOutlined />,
      color: '#6366f1'
    },
    {
      title: 'តារាងតុល្យការ',
      value: stats?.balance_sheet_count || stats?.balance_sheet || 0,
      icon: <PieChartOutlined />,
      color: '#3b82f6'
    },
    {
      title: 'របាយការណ៍លទ្ធផល',
      value: stats?.income_statement_count || stats?.income_statement || 0,
      icon: <FundOutlined />,
      color: '#06b6d4'
    },
    {
      title: 'លំហូរសាច់ប្រាក់',
      value: stats?.cash_flow_count || stats?.cash_flow || 0,
      icon: <SlidersOutlined />,
      color: '#a855f7'
    }
  ]

  return (
    <Row gutter={[16, 16]}>
      {statsItems.map((item, index) => {
        const displayValue = Number(item.value || 0)

        return (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              variant='borderless'
              className='rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative border border-gray-100/60 bg-white'
              styles={{ body: { padding: '24px' } }}
            >
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Text className='text-gray-400 text-xs font-semibold uppercase tracking-wider block whitespace-nowrap'>
                    {item.title}
                  </Text>
                  <AntTitle
                    level={2}
                    className='!mb-0 !mt-1 font-bold tracking-tight whitespace-nowrap !text-gray-800'
                  >
                    {displayValue.toLocaleString()}{' '}
                    <span className='text-sm font-normal text-gray-400'>
                      ច្បាប់
                    </span>
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

              {/* Decorative bottom bar line */}
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

export default ReportStats
