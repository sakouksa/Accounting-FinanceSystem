import { Input, Select, Button, Space, DatePicker } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons'
import { formatToPicker } from '../../../util/helper'
const { RangePicker } = DatePicker
function AccountsReceivableFilter ({
  pagination,
  setPagination,
  onFilter,
  onReset,
  customers = [],
  handleDateChange
}) {
  return (
    <div className='bg-white p-4 rounded-2xl shadow-sm border border-gray-100'>
      <div className='flex flex-wrap justify-between items-center gap-4'>
        {/* SEARCH */}
        <Input
          allowClear
          style={{ width: 250 }}
          value={pagination.txt_search || ''}
          placeholder='ស្វែងរក លេខវិក្កយបត្រ / ឈ្មោះអតិថិជន'
          prefix={<SearchOutlined className='text-gray-400' />}
          onChange={e =>
            setPagination({
              ...pagination,
              txt_search: e.target.value
            })
          }
          onPressEnter={onFilter}
        />

        <Space gap='small'>
          <RangePicker
            onChange={handleDateChange}
            value={
              pagination.from_date
                ? [
                    formatToPicker(pagination.from_date),
                    formatToPicker(pagination.to_date)
                  ]
                : null
            }
            format='YYYY-MM-DD'
          />

          {/* CUSTOMER FILTER */}
          <Select
            allowClear
            placeholder='ជ្រើសរើសអតិថិជន'
            style={{ width: 200 }}
            value={pagination.customer_id}
            onChange={val =>
              setPagination({
                ...pagination,
                customer_id: val
              })
            }
            options={customers.map(c => ({
              label: c.customer_name,
              value: c.id
            }))}
          />

          <Select
            allowClear
            style={{ width: 150 }}
            placeholder='ជ្រើសរើសស្ថានភាព'
            value={pagination.status}
            onChange={value =>
              setPagination({
                ...pagination,
                status: value
              })
            }
            dropdownStyle={{ textAlign: 'left' }}
            optionRender={option => {
              const colors = {
                unpaid: { dot: 'bg-red-500', text: 'text-red-600' },
                partial: { dot: 'bg-amber-500', text: 'text-amber-600' },
                paid: { dot: 'bg-emerald-500', text: 'text-emerald-600' }
              }
              const current = colors[option.value] || {
                dot: 'bg-gray-400',
                text: 'text-gray-700'
              }
              return (
                <div className='flex items-center gap-2 py-0.5'>
                  <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
                  <span className={`font-medium text-xs ${current.text}`}>
                    {option.label}
                  </span>
                </div>
              )
            }}
            options={[
              { value: 'unpaid', label: 'មិនទាន់ទូទាត់' },
              { value: 'partial', label: 'ទូទាត់ខ្លះ' },
              { value: 'paid', label: 'បានទូទាត់រួច' }
            ]}
          />

          {/* RESET */}
          <Button
            onClick={onReset}
            icon={<ReloadOutlined />}
            className='hover:!border-gray-300 hover:!text-gray-700 font-medium text-gray-600'
          >
            កំណត់ឡើងវិញ
          </Button>

          {/* FILTER */}
          <Button
            type='primary'
            onClick={onFilter}
            icon={<FilterOutlined />}
            className='bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white font-medium shadow-sm rounded-lg'
          >
            ស្វែងរក
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default AccountsReceivableFilter
