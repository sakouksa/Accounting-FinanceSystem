import React from 'react'
import { Input, Select, Button, Space, DatePicker } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

function FinancialReportFilter ({
  filter,
  setFilter,
  branches = [],
  onFilter,
  onReset
}) {
  const handleDateChange = dates => {
    setFilter(prev => ({
      ...prev,
      from_date: dates && dates[0] ? dates[0].format('YYYY-MM-DD') : null,
      to_date: dates && dates[1] ? dates[1].format('YYYY-MM-DD') : null
    }))
  }

  return (
    <div className='bg-white p-5 rounded-2xl shadow-sm border border-gray-100'>
      <div className='grid grid-cols-1 xl:grid-cols-4 gap-4'>
        <div className='xl:col-span-1'>
          <Input
            allowClear
            prefix={<SearchOutlined className='text-gray-400' />}
            value={filter?.txt_search || ''}
            onChange={e =>
              setFilter(prev => ({ ...prev, txt_search: e.target.value }))
            }
            placeholder='ស្វែងរកការពិពណ៌នា ឬកំណត់សម្គាល់...'
            onPressEnter={onFilter}
            className='w-full'
          />
        </div>

        <div className='xl:col-span-3 flex flex-wrap items-center justify-start xl:justify-end gap-3'>
          <RangePicker
            onChange={handleDateChange}
            value={
              filter?.from_date && filter?.to_date
                ? [dayjs(filter.from_date), dayjs(filter.to_date)]
                : null
            }
            style={{ width: 260 }}
            placeholder={['ចាប់ផ្តើមថ្ងៃ', 'បញ្ចប់ថ្ងៃ']}
          />

          <Select
            allowClear
            placeholder='ប្រភេទរបាយការណ៍'
            style={{ width: 190 }}
            value={filter?.report_type}
            onChange={val => setFilter(prev => ({ ...prev, report_type: val }))}
            options={[
              {
                label: 'តារាងតុល្យការ (Balance Sheet)',
                value: 'balance_sheet'
              },
              {
                label: 'របាយការណ៍លទ្ធផល (Income Statement)',
                value: 'income_statement'
              },
              {
                label: 'របាយការណ៍លំហូរសាច់ប្រាក់ (Cash Flow)',
                value: 'cash_flow'
              }
            ]}
          />

          <Select
            allowClear
            showSearch
            optionFilterProp='label'
            placeholder='ជ្រើសរើសសាខា'
            style={{ width: 180 }}
            value={filter?.branch_id}
            onChange={val => setFilter(prev => ({ ...prev, branch_id: val }))}
            options={branches.map(item => ({
              label: item.name,
              value: item.id
            }))}
          />
          <Space size={8} className='ml-auto xl:ml-0'>
            <Button
              onClick={onReset}
              icon={<ReloadOutlined />}
              className='rounded-xl'
            >
              កំណត់ឡើងវិញ
            </Button>

            <Button
              type='primary'
              onClick={onFilter}
              icon={<FilterOutlined />}
              className='bg-indigo-600 hover:bg-indigo-700 border-0 rounded-xl font-medium'
            >
              តម្រងទិន្នន័យ
            </Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default FinancialReportFilter
