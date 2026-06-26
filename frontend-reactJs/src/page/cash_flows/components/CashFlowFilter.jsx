import React from 'react'
import { Input, Select, Button, Space, DatePicker } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

function CashFlowFilter ({
  filter,
  setFilter,
  transaction = [],
  chart_of_accounts = [],
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
      {/* Grid Layout: Structured 2-column or multi-row layout for responsiveness */}
      <div className='grid grid-cols-1 xl:grid-cols-4 gap-4'>
        {/* Left main: Search Input (Takes 1 full block or larger on big screens) */}
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
            className='w-full' // Set explicit height for standard look
          />
        </div>

        {/* Right main: Filter controllers & Action buttons */}
        <div className='xl:col-span-3 flex flex-wrap items-center justify-start xl:justify-end gap-3'>
          {/* Date Range Picker */}
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

          {/* Flow Type Filter */}
          <Select
            allowClear
            placeholder='ប្រភេទលំហូរថវិកា'
            style={{ width: 160 }}
            value={filter?.flow_type}
            onChange={val => setFilter(prev => ({ ...prev, flow_type: val }))}
            options={[
              { label: 'លុយចូល (Inflow)', value: 'inflow' },
              { label: 'លុយចេញ (Outflow)', value: 'outflow' }
            ]}
          />

          {/* Chart of Account Filter */}
          <Select
            allowClear
            showSearch
            optionFilterProp='label'
            placeholder='ជ្រើសរើសគណនី (COA)'
            style={{ width: 200 }}
            value={filter?.account_id}
            onChange={val => setFilter(prev => ({ ...prev, account_id: val }))}
            options={chart_of_accounts.map(acc => ({
              label: `${acc.account_code} - ${acc.account_name}`,
              value: acc.id
            }))}
          />

          {/* Reference Transaction Filter */}
          <Select
            allowClear
            showSearch
            optionFilterProp='label'
            placeholder='យោងប្រតិបត្តិការ'
            style={{ width: 160 }}
            value={filter?.transaction_id}
            onChange={val =>
              setFilter(prev => ({ ...prev, transaction_id: val }))
            }
            options={transaction.map(trans => ({
              label: trans.transaction_no,
              value: trans.id
            }))}
          />

          {/* Action Buttons grouped together */}
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

export default CashFlowFilter
