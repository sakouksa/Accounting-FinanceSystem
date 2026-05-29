import React from 'react'
import { Input, Select, Button, Space } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons'

function ChartOfAccountFilter({
  filter,
  setFilter,
  accountTypes = [],
  onFilter,
  onReset
}) {

  return (
    <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
      <div className='flex flex-wrap justify-between items-center gap-4'>
        {/* Search Input */}
        <Input
          allowClear
          value={filter?.txt_search || ''}
          onChange={e => setFilter(prev => ({ ...prev, txt_search: e.target.value }))}
          placeholder='ស្វែងរកកូដឬឈ្មោះគណនី...'
          onPressEnter={onFilter}
          prefix={<SearchOutlined className='text-gray-400 mr-2' />}
          style={{ width: 320 }}
        />

        <Space wrap>
          {/* Account Type */}
          <Select
            allowClear
            placeholder='ប្រភេទគណនី'
            style={{ width: 220 }}
            value={filter?.account_type_id}
            onChange={value => setFilter(prev => ({ ...prev, account_type_id: value }))}
            options={accountTypes.map(item => ({
              label: `${item.name} (${item.code || ''})`,
              value: item.account_type_id
            }))}
          />

          {/* Status */}
          <Select
            allowClear
            placeholder='ស្ថានភាព'
            style={{ width: 160 }}
            value={filter?.status}
            onChange={value => setFilter(prev => ({ ...prev, status: value }))}
            options={[
              { label: 'សកម្ម', value: 'Active' },
              { label: 'អសកម្ម', value: 'Inactive' }
            ]}
          />

          {/* Buttons */}
          <Button
            onClick={onReset}
            icon={<ReloadOutlined />}
          >
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

export default ChartOfAccountFilter