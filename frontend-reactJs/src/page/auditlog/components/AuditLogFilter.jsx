import { Input, Select, Button, Space } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons'

function AuditLogFilter ({ pagination, setPagination, onFilter, onReset }) {
  return (
    <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
      <div className='flex flex-wrap justify-between items-center gap-4'>
        <Input
          allowClear
          value={pagination.txt_search || ''}
          onChange={e => setPagination({ txt_search: e.target.value })}
          placeholder='ស្វែងរក...'
          onPressEnter={onFilter}
          prefix={<SearchOutlined className='text-gray-400 mr-2' />}
          style={{ width: 280 }}
        />
        <Space>
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

export default AuditLogFilter
