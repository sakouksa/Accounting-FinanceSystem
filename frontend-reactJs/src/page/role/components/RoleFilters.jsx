import React from 'react'
import { Input, Select, Button } from 'antd'
import { SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons'

function RoleFilters ({ pagination, setPagination, onFilter, onReset }) {
  return (
    <div className="bg-white px-4 py-3 rounded-xl border border-gray-200">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

        <Input
          allowClear
          placeholder="ស្វែងរកតួនាទី..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={pagination.txt_search || ''}
          onChange={e => setPagination({ txt_search: e.target.value })}
          onPressEnter={onFilter}
          style={{ height: 40 }}
          className="rounded-lg border-gray-200 flex-1 sm:max-w-xs"
        />

        <Select
          allowClear
          placeholder="ស្ថានភាព"
          style={{ height: 40, minWidth: 160 }}
          className="rounded-lg"
          value={pagination.status || undefined}
          onChange={val => setPagination({ status: val })}
          options={[
            { label: 'សកម្ម', value: 'active' },
            { label: 'អសកម្ម', value: 'inactive' }
          ]}
        />

        <div className="flex gap-2">
          <Button
            onClick={onReset}
            icon={<ReloadOutlined />}
            style={{ height: 40 }}
            className="rounded-lg border-gray-200 text-gray-600 px-4"
          >
            កំណត់ឡើងវិញ
          </Button>
          <Button
            type="primary"
            onClick={onFilter}
            icon={<FilterOutlined />}
            style={{ height: 40 }}
            className="rounded-lg bg-indigo-600 border-0 hover:bg-indigo-700 px-4 font-medium"
          >
            តម្រង
          </Button>
        </div>

      </div>
    </div>
  )
}

export default RoleFilters
