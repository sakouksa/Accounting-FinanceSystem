import React from 'react'
import { Input, Select, Button } from 'antd'
import { SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons'

function UserFilter ({ pagination, setPagination, defaultRoles, branches, onFilter, onReset }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Input Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          {/* Search */}
          <div>
            <Input
              allowClear
              placeholder="ស្វែងរក ឈ្មោះពេញ អ៊ីមែល ឈ្មោះអ្នកប្រើប្រាស់..."
              prefix={<SearchOutlined className="text-gray-400 mr-1" />}
              value={pagination.txt_search || ''}
              onChange={e => setPagination({ txt_search: e.target.value })}
              onPressEnter={onFilter}
              style={{ height: 40 }}
              className="rounded-lg border-gray-200"
            />
          </div>

          {/* Role */}
          <div>
            <Select
              allowClear
              placeholder="ជ្រើសរើសតួនាទី"
              style={{ height: 40 }}
              className="w-full rounded-lg"
              value={pagination.role_id || undefined}
              onChange={val => setPagination({ role_id: val })}
            >
              {defaultRoles.map(role => (
                <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
              ))}
            </Select>
          </div>

          {/* Branch */}
          <div>
            <Select
              allowClear
              placeholder="ជ្រើសរើសសាខា"
              style={{ height: 40 }}
              className="w-full rounded-lg"
              value={pagination.branch_id || undefined}
              onChange={val => setPagination({ branch_id: val })}
            >
              {branches.map(b => (
                <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
              ))}
            </Select>
          </div>

          {/* Status */}
          <div>
            <Select
              allowClear
              placeholder="ជ្រើសរើសស្ថានភាព"
              style={{ height: 40 }}
              className="w-full rounded-lg"
              value={pagination.status || undefined}
              onChange={val => setPagination({ status: val })}
            >
              <Select.Option value="active">សកម្ម</Select.Option>
              <Select.Option value="inactive">អសកម្ម</Select.Option>
              <Select.Option value="deleted">បានលុបបណ្តោះអាសន្ន</Select.Option>
            </Select>
          </div>
        </div>

        {/* Buttons Action Group */}
        <div className="flex gap-2 justify-end lg:w-auto w-full border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
          <Button
            onClick={onReset}
            icon={<ReloadOutlined />}
            style={{ height: 40 }}
            className="rounded-lg px-4 border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-600"
          >
            កំណត់ឡើងវិញ
          </Button>
          <Button
            type="primary"
            onClick={onFilter}
            icon={<FilterOutlined />}
            style={{ height: 40 }}
            className="rounded-lg px-4 bg-indigo-600 border-0 hover:bg-indigo-700 text-white font-medium"
          >
            តម្រងទិន្នន័យ
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserFilter
