import { Input, Button, Space, DatePicker } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

function LoginHistoriesFilter({
  filters,
  setFilters,
  onSearch,
  onReset
}) {
  const onDateChange = (_, dateStrings) => {
    setFilters(prev => ({
      ...prev,
      start_date: dateStrings?.[0] || null,
      end_date: dateStrings?.[1] || null
    }))
  }

  return (
    <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
      <div className='flex flex-wrap gap-4 items-center justify-between'>
        {/* Search */}
        <Input
          allowClear
          style={{ width: 320 }}
          prefix={<SearchOutlined />}
          value={filters.txt_search}
          placeholder='ស្វែងរក Username, Full Name, IP Address...'
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              txt_search: e.target.value
            }))
          }
          onPressEnter={onSearch}
        />

        <Space wrap>
          {/* Login Date */}
          <RangePicker
            value={
              filters.start_date && filters.end_date
                ? [
                    dayjs(filters.start_date),
                    dayjs(filters.end_date)
                  ]
                : null
            }
            onChange={onDateChange}
            placeholder={[
              'ថ្ងៃចូលចាប់ផ្ដើម',
              'ថ្ងៃចូលបញ្ចប់'
            ]}
          />

          <Button
            icon={<ReloadOutlined />}
            onClick={onReset}
          >
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

export default LoginHistoriesFilter