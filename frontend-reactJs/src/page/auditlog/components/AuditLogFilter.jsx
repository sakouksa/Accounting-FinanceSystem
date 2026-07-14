import { Input, Button, Space, DatePicker } from 'antd'
import { SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

function AuditLogFilter({ filters, setFilters, onSearch, onReset }) {

  const onDateChange = (dates, dateStrings) => {
    setFilters(prev => ({
      ...prev,
      start_date: dateStrings?.[0] || null,
      end_date: dateStrings?.[1] || null
    }))
  }

  return (
    <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
      <div className='flex flex-wrap gap-4 items-center justify-between'>

        {/* SEARCH */}
        <Input
          allowClear
          value={filters.txt_search}
          onChange={e =>
            setFilters(prev => ({ ...prev, txt_search: e.target.value }))
          }
          placeholder='ស្វែងរក...'
          onPressEnter={onSearch}
          prefix={<SearchOutlined />}
          style={{ width: 260 }}
        />

        <Space>

          {/* DATE RANGE */}
          <RangePicker
            value={
              filters.start_date && filters.end_date
                ? [dayjs(filters.start_date), dayjs(filters.end_date)]
                : null
            }
            onChange={onDateChange}
          />

          <Button icon={<ReloadOutlined />} onClick={onReset}>
            កំណត់ឡើងវិញ
          </Button>

          <Button
            type='primary'
            className=' bg-blue-600'
            icon={<FilterOutlined />}
            onClick={onSearch}
          >
            តម្រងទិន្នន័យ
          </Button>

        </Space>
      </div>
    </div>
  )
}

export default AuditLogFilter
