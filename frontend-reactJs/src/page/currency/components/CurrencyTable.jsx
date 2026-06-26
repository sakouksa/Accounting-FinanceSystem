import { Table, Button, Space, Switch, Typography, Pagination } from 'antd'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import { dateClient } from '../../../util/helper'
import { request } from '../../../util/request'


const { Text } = Typography

function CurrencyTable({
  list,
  selectedRowKeys,
  setSelectedRowKeys,
  pagination,
  onEdit,
  onDelete,
  onBulkDelete,
  onStatusChange,
  onDeleteAll,
  loading = false
}) {
  const isAllSelected =
    selectedRowKeys?.length > 0 &&
    list?.length > 0 &&
    selectedRowKeys.length === list.length
  return (
    <>
{/* Selected Bar */}
{selectedRowKeys.length > 0 && (
  <div className='mb-4 flex items-center justify-between bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-3'>

    <div className='flex items-center gap-3'>
      <div className='w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm'>
        {selectedRowKeys.length}
      </div>

      <div className='text-sm text-gray-600'>
        {isAllSelected ? (
          <>
            បានជ្រើសរើស <span className='font-semibold text-red-600'>ទាំងអស់</span> ទិន្នន័យ
          </>
        ) : (
          <>
            បានជ្រើសរើស{' '}
            <span className='font-semibold text-indigo-600'>
              {selectedRowKeys.length}
            </span>{' '}
            ទិន្នន័យ
          </>
        )}
      </div>
    </div>

    <Space>
      <Button onClick={() => setSelectedRowKeys([])}>
        បោះបង់
      </Button>

      {/* DELETE BUTTON */}
      {isAllSelected ? (
    <button
    onClick={onDeleteAll}
    className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition shadow-sm"
  >
    លុបទាំងអស់
  </button>
) : (
  <button
    onClick={onBulkDelete}
    className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition shadow-sm"
  >
    លុបជ្រើសរើស
  </button>
      )}
    </Space>

  </div>
)}

<Table
dataSource={list}
rowSelection={{
  selectedRowKeys,
  onChange: setSelectedRowKeys
}}
rowKey='id'
scroll={{ x: 1100 }}
pagination={false}
loading={loading}
columns={[
  {
    title: 'ឈ្មោះរូបិយប័ណ្ណ',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'កូដ',
    dataIndex: 'code',
    key: 'code',
    width: 130,
    render: (text) => (
      <span className="font-semibold uppercase tracking-wider">{text}</span>
    )
  },
  {
    title: 'និមិត្តសញ្ញា',
    dataIndex: 'symbol',
    key: 'symbol',
    align: 'center',
    width: 100,
    render: (symbol) => <span className="text-lg font-bold">{symbol}</span>
  },
  {
    title: 'អត្រាប្តូរ',
    dataIndex: 'exchange_rate',
    key: 'exchange_rate',
    align: 'right',
    width: 150,
    render: (rate) => (
      <span className="font-medium text-emerald-600">
        {Number(rate).toLocaleString()} 
        <span className="text-gray-500 text-sm ml-1">USD</span>
      </span>
    )
  },
  {
    title: 'ស្ថានភាព',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: 130,
    render: (val, record) => (
      <Switch
        size='small'
        checked={val === 'active'}
        onChange={checked =>
          onStatusChange(record.id, checked ? 'active' : 'inactive')
        }
        checkedChildren='សកម្ម'
        unCheckedChildren='អសកម្ម'
        style={{
          minWidth: 40,
          height: 18,
          backgroundColor: val === 'active' ? '#22c55e' : '#ef4444'
        }}
      />
    )
  },
  {
    title: 'ថ្ងៃបង្កើត',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 160,
    render: val => dateClient(val)
  },
  {
    title: 'សកម្មភាព',
    key: 'action',
    align: 'center',
    width: 110,
    fixed: 'right',
    render: (_, record) => (
      <Space size={4}>
        <Button
          type='text'
          size='small'
          icon={<CiEdit style={{ fontSize: 18 }} />}
          onClick={() => onEdit(record)}
          className='hover:bg-blue-50 hover:text-blue-600'
          style={{ color: '#3b82f6' }}
        />
        <Button
          type='text'
          size='small'
          danger
          icon={<MdDelete style={{ fontSize: 18 }} />}
          onClick={() => onDelete(record)}
          className='hover:bg-red-50 hover:text-red-600'
        />
      </Space>
    )
  }
]}
/>

      {/* Custom Pagination */}
      <div className='flex justify-between items-center bg-white p-4 border border-gray-100 rounded-b-2xl shadow-sm mt-0.5'>
        <span className='text-gray-600 text-sm'>
          សរុប: <b className='text-indigo-600'>{pagination.total || 0}</b>{' '}
          ទិន្នន័យ
        </span>
        <Pagination
          current={pagination.page}
          pageSize={pagination.limit}
          total={pagination.total}
          onChange={(page, pageSize) => {
            if (pagination.onChange) pagination.onChange(page, pageSize)
          }}
          showSizeChanger
        />
      </div>
    </>
  )
}

export default CurrencyTable
