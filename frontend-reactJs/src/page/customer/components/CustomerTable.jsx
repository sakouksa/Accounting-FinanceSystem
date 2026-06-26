import {
  Table,
  Button,
  Space,
  Switch,
  Typography,
  Pagination,
  Empty
} from 'antd'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import { dateClient } from '../../../util/helper'
import CustomEmpty from '../../../components/common/CustomEmpty'
const { Text } = Typography

function CustomerTable ({
  list,
  selectedRowKeys,
  setSelectedRowKeys,
  pagination,
  setPagination,
  onEdit,
  onDelete,
  onBulkDelete,
  onDeleteAll,
  loading,
  onStatusChange
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
                  បានជ្រើសរើស{' '}
                  <span className='font-semibold text-red-600'>ទាំងអស់</span>{' '}
                  ទិន្នន័យ
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
            <Button onClick={() => setSelectedRowKeys([])}>បោះបង់</Button>
            {isAllSelected ? (
              <button
                onClick={onDeleteAll}
                className='px-3 py-1.5 text-xs font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition shadow-sm'
              >
                លុបទាំងអស់
              </button>
            ) : (
              <button
                onClick={onBulkDelete}
                className='px-3 py-1.5 text-xs font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition shadow-sm'
              >
                លុបជ្រើសរើស
              </button>
            )}
          </Space>
        </div>
      )}

      <Table
        dataSource={list}
        rowKey='id'
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        loading={loading}
        scroll={{ x: 1000 }}
        pagination={false}
        locale={{
          emptyText: (
            <CustomEmpty
              title='មិនមាន Transaction Detail'
              description='សូមបន្ថែម transaction detail ថ្មី'
              onReload={() => window.location.reload()}
            />
          )
        }}
        columns={[
          {
            title: 'កូដអតិថិជន',
            dataIndex: 'customer_code',
            width: 150,
            render: value => (
              <span className='font-semibold text-indigo-600'>{value}</span>
            )
          },
          {
            title: 'ឈ្មោះអតិថិជន',
            dataIndex: 'customer_name',
            width: 220
          },
          {
            title: 'ប្រភេទ',
            dataIndex: 'customer_type',
            width: 120,
            render: value => (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value === 'wholesale'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                {value}
              </span>
            )
          },
          {
            title: 'លេខពន្ធ',
            dataIndex: 'tax_number',
            width: 150,
            render: value => value || '-'
          },
          {
            title: 'ទូរស័ព្ទ',
            dataIndex: 'phone',
            width: 140,
            render: value => value || '-'
          },
          {
            title: 'Email',
            dataIndex: 'email',
            width: 220,
            render: value => value || '-'
          },
          {
            title: 'Credit Limit',
            dataIndex: 'credit_limit',
            width: 150,
            align: 'right',
            render: value => (
              <Text strong>{Number(value || 0).toLocaleString()}</Text>
            )
          },
          {
            title: 'Opening Balance',
            dataIndex: 'opening_balance',
            width: 150,
            align: 'right',
            render: value => (
              <span className='text-green-600 font-medium'>
                {Number(value || 0).toLocaleString()}
              </span>
            )
          },
          {
            title: 'Current Balance',
            dataIndex: 'current_balance',
            width: 150,
            align: 'right',
            render: value => (
              <span className='text-orange-600 font-medium'>
                {Number(value || 0).toLocaleString()}
              </span>
            )
          },
          {
            title: 'ស្ថានភាព',
            dataIndex: 'status',
            width: 130,
            align: 'center',
            render: (value, record) => {
              const isActive = value === 'active'

              return ( <
                Switch size = "small"
                checked = {
                  isActive
                }
                checkedChildren = "សកម្ម"
                unCheckedChildren = "អសកម្ម"
                onChange = {
                  checked =>
                  onStatusChange(
                    record.id,
                    checked ? 'active' : 'inactive'
                  )
                }
                className = {
                  `${isActive ? '!bg-blue-500' : '!bg-red-500'}`
                }
                />
              )
            }
          },
          {
            title: 'ថ្ងៃបង្កើត',
            dataIndex: 'created_at',
            width: 180,
            render: value => dateClient(value)
          },
          {
            title: 'សកម្មភាព',
            width: 120,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
              <Space>
                <Button
                  type='text'
                  icon={<CiEdit size={18} />}
                  onClick={() => onEdit(record)}
                />
                <Button
                  danger
                  type='text'
                  icon={<MdDelete size={18} />}
                  onClick={() => onDelete(record)}
                />
              </Space>
            )
          }
        ]}
      />​

      {/* Custom Pagination */}
      <div className='flex justify-between items-center bg-white p-4 border border-gray-100 rounded-b-2xl shadow-sm mt-0.5'>
        <span className='text-gray-600 text-sm'>
          សរុប: <b className='text-indigo-600'>{pagination.total || 0}</b> ទិន្នន័យ
        </span>

        <Pagination
          current={pagination.page || 1}
          pageSize={pagination.limit || 10}
          total={pagination.total || 0}
          onChange={(page, pageSize) => {
            setPagination({
              ...pagination,
              page,
              limit: pageSize
            })
          }}
        />
      </div>
    </>
  )
}

export default CustomerTable
