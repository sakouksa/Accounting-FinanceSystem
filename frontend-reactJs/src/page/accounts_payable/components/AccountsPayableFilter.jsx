import React from 'react'
import { Input, Select, Button, Space, DatePicker } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

function AccountsPayableFilter ({
  filter,
  setFilter,
  suppliers = [],
  onFilter,
  onReset
}) {
  const handleDateChange = dates => {
    setFilter(prev => ({
      ...prev,
      from_date: dates ? dates[0].format('YYYY-MM-DD') : null,
      to_date: dates ? dates[1].format('YYYY-MM-DD') : null
    }))
  }
  return (
    <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
      <div className='flex flex-wrap justify-between items-center gap-4'>
        {/* Search Input */}
        <Input
          allowClear
          value={filter?.txt_search || ''}
          onChange={e =>
            setFilter(prev => ({ ...prev, txt_search: e.target.value }))
          }
          placeholder='ស្វែងរកលេខវិក្កយបត្រ ឬអ្នកផ្គត់ផ្គង់...'
          onPressEnter={onFilter}
          style={{ width: 200 }}
        />

        <Space wrap>
          <RangePicker
            onChange={handleDateChange}
            value={filter?.from_date ? [dayjs(filter.from_date), dayjs(filter.to_date)] : null}
          />

          <Select
            allowClear
            placeholder='អ្នកផ្គត់ផ្គង់'
            style={{ width: 200 }}
            value={filter?.supplier_id}
            onChange={val => setFilter(prev => ({ ...prev, supplier_id: val }))}
            options={suppliers.map(s => ({ label: s.supplier_name, value: s.id }))}
          />

          <Select
            allowClear
            placeholder='ស្ថានភាព'
            style={{ width: 150 }}
            value={filter?.status}
            onChange={val => setFilter(prev => ({ ...prev, status: val }))}
            options={[
              { label: 'មិនទាន់ទូទាត់', value: 'unpaid' },
              { label: 'ទូទាត់ខ្លះ', value: 'partial' },
              { label: 'បានទូទាត់', value: 'paid' }
            ]}
          />

          {/* Buttons */}
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
        </Space>
      </div>
    </div>
  )
}

export default AccountsPayableFilter
