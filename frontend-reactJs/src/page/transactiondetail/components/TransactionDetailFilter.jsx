import { Input, Select, Button, Space } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons'

function TransactionDetailFilter ({
  pagination,
  setPagination,
  onFilter,
  onReset,
  transactions,
  accounts
}) {
  return (
    <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
      <div className='flex flex-wrap justify-between items-center gap-4'>
        <Input
          allowClear
          style={{ width: 250 }}
          value={pagination.txt_search || ''}
          placeholder='ស្វែងរក Description ឬ ID'
          prefix={<SearchOutlined />}
          onChange={e =>
            setPagination({
              txt_search: e.target.value
            })
          }
          onPressEnter={onFilter}
        />
        <Space>
          {/* Transaction */}
          <Select
            allowClear
            showSearch
            style={{ width: 250 }}
            placeholder='ជ្រើសរើស Transaction'
            value={pagination.transaction_id}
            onChange={value =>
              setPagination({
                transaction_id: value
              })
            }
            options={transactions?.map(item => ({
              value: item.id,
              label: item.transaction_no
            }))}
          />

          {/* Account */}
          <Select
            allowClear
            showSearch
            style={{ width: 250 }}
            placeholder='ជ្រើសរើស Account'
            value={pagination.account_id}
            onChange={value =>
              setPagination({
                account_id: value
              })
            }
            options={accounts?.map(item => ({
              value: item.id,
              label: item.account_name
            }))}
          />
          <Button
            onClick={onReset}
            icon={<ReloadOutlined />}
            className='hover:!border-gray-300 hover:!text-gray-700'
          >
            កំណត់ឡើងវិញ
          </Button>

          <Button
            type='primary'
            onClick={onFilter}
            icon={<FilterOutlined />}
            className='bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white font-medium'
          >
            តម្រង
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default TransactionDetailFilter
