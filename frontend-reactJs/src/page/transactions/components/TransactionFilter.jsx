import React from 'react'
import { Input, Select, Button, Space } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons'

function TransactionFilter ({
  filter,
  setFilter,
  transactionTypes = [],
  branches = [],
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
          onChange={e =>
            setFilter(prev => ({ ...prev, txt_search: e.target.value }))
          }
          placeholder='ស្វែងរក...'
          onPressEnter={onFilter}
          prefix={<SearchOutlined className='text-gray-400 mr-2' />}
          style={{ width: 250 }}
        />

        <Space wrap>
          {/* Account Type */}
          < Select
          allowClear
          showSearch
          placeholder = 'ប្រភេទប្រតិបត្តិការ'
          style = {
            {
              width: 190
            }
          }
          value = {
            filter?.transaction_type_id
          }
          onChange = {
            value =>
            setFilter(prev => ({
              ...prev,
              transaction_type_id: value
            }))
          }
          options = {
            transactionTypes.map(item => ({
              label: `${item.name} (${item.code})`,
              value: item.id
            }))
          }
          filterOption = {
            (input, option) =>
            option?.label?.toLowerCase().includes(input.toLowerCase())
          }
          />
          <Select
            allowClear
            placeholder='សាខា'
            style={{
              width: 150
            }}
            value={filter?.branch_id}
            onChange={value =>
              setFilter(prev => ({
                ...prev,
                branch_id: value
              }))
            }
            options={branches.map(item => ({
              label: item.name,
              value: item.id
            }))}
          />{' '}
          <Select
            allowClear
            placeholder='រូបិយប័ណ្ណ'
            style={{
              width: 100
            }}
            value={filter?.currency_code}
            onChange={value =>
              setFilter(prev => ({
                ...prev,
                currency_code: value
              }))
            }
            options={[
              {
                label: 'USD',
                value: 'USD'
              },
              {
                label: 'KHR',
                value: 'KHR'
              },
              {
                label: 'THB',
                value: 'THB'
              }
            ]}
          />{' '}
          <Select
            allowClear
            placeholder='ស្ថានភាព'
            style={{
              width: 120
            }}
            value={filter?.status}
            onChange={value =>
              setFilter(prev => ({
                ...prev,
                status: value
              }))
            }
            options={[
              {
                label: 'រង់ចាំ',
                value: 'Pending'
              },
              {
                label: 'អនុម័ត',
                value: 'Approved'
              }
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

export default TransactionFilter
