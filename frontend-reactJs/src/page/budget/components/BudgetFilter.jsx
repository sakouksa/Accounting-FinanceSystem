import React from 'react'
import { Input, Select, Button, Space, DatePicker } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

function BudgetFilter ({
  filter,
  setFilter,
  accounts = [],
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
    <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <Input
            allowClear
            prefix={<SearchOutlined className='text-gray-400' />}
            value={filter?.txt_search || ''}
            onChange={e =>
              setFilter(prev => ({ ...prev, txt_search: e.target.value }))
            }
            placeholder='ស្វែងរកឈ្មោះថវិកា...'
            onPressEnter={onFilter}
            style={{ width: 250 }}
          />

          <Space wrap size={12}>
            {/* Range Picker */}
            <RangePicker
              onChange={handleDateChange}
              value={
                filter?.from_date && filter?.to_date
                  ? [dayjs(filter.from_date), dayjs(filter.to_date)]
                  : null
              }
            />

            {/* Filter for Branch */}
            <Select
              allowClear
              showSearch
              optionFilterProp='label'
              placeholder='ជ្រើសរើសសាខា'
              style={{ width: 170 }}
              value={filter?.branch_id}
              onChange={val => setFilter(prev => ({ ...prev, branch_id: val }))}
              options={branches.map(b => ({ label: b.name, value: b.id }))}
            />

            {/* Filter for Account */}
            <Select
              allowClear
              showSearch
              optionFilterProp='label'
              placeholder='ជ្រើសរើសគណនី'
              style={{ width: 170 }}
              value={filter?.account_id}
              onChange={val => setFilter(prev => ({ ...prev, account_id: val }))}
              options={accounts.map(a => ({
                label: a.account_name,
                value: a.id
              }))}
            />

            {/* Filter for Status */}
            <Select
              allowClear
              placeholder='ស្ថានភាព'
              style={{ width: 130 }}
              value={filter?.status}
              onChange={val =>
                setFilter(prev => ({
                  ...prev,
                  status: val ?? null
                }))
              }
              options={[
                { label: 'សកម្ម', value: 'active' },
                { label: 'អសកម្ម', value: 'closed' }
              ]}
            />
          </Space>
        </div>

        <div className='flex justify-end gap-2 border-t pt-4'>
          <Button onClick={onReset} icon={<ReloadOutlined />}>
            កំណត់ឡើងវិញ
          </Button>
          <Button
            type='primary'
            onClick={onFilter}
            icon={<FilterOutlined />}
            className='bg-indigo-600 hover:bg-indigo-700 border-0'
          >
            តម្រងទិន្នន័យ
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BudgetFilter