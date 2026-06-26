import { Input, Select, Button, Space } from 'antd'
import { SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons'

function SupplierFilter({
  pagination,
  setPagination,
  onFilter,
  onReset
}) {
  return (
    <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
      <div className='flex flex-wrap justify-between items-center gap-4'>

        {/* SEARCH */}
        <Input
          allowClear
          style={{ width: 250 }}
          value={pagination.txt_search || ''}
          placeholder='ស្វែងរក Customer Code / Name / Phone'
          prefix={<SearchOutlined />}
          onChange={(e) =>
            setPagination({
              txt_search: e.target.value
            })
          }
          onPressEnter={onFilter}
        />

        <Space>

          {/* STATUS FILTER (NEW - matches backend) */}
          <Select
            allowClear
            style={{ width: 200 }}
            placeholder='ជ្រើសរើស Status'
            value={pagination.status}
            onChange={(value) =>
              setPagination({
                status: value
              })
            }
            options={[
              { value: 'active', label: 'សកម្ម' },
              { value: 'inactive', label: 'អសកម្ម' }
            ]}
          />

          {/* RESET */}
          <Button
            onClick={onReset}
            icon={<ReloadOutlined />}
            className='hover:!border-gray-300 hover:!text-gray-700'
          >
            កំណត់ឡើងវិញ
          </Button>

          {/* FILTER */}
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

export default SupplierFilter