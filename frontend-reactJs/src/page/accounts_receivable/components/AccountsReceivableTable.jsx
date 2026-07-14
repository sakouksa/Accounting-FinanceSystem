import { Table, Button, Space, Select, Typography, Pagination, Tag } from 'antd'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import { dateClient } from '../../../util/helper'
import CustomEmpty from '../../../components/common/CustomEmpty'
const { Text } = Typography

function AccountsReceivableTable ({
  list,
  selectedRowKeys,
  setSelectedRowKeys,
  pagination,
  setPagination,
  onEdit,
  onDelete,
  onBulkDelete,
  onDeleteAll,
  onStatusChange,
  loading
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
        scroll={{ x: 1200 }}
        pagination={false}
        locale={{
          emptyText: (
            <CustomEmpty
              title='មិនមាន Accounts Receivable ណាមួយទេ'
              description='សូមចុចប៊ូតុង បង្កើតថ្មី ដើម្បីបន្ថែម Accounts Receivable ដំបូងរបស់អ្នក'
              onReload={() => window.location.reload()}
            />
          )
        }}
        columns={[
          {
            title: 'លេខវិក្កយបត្រ',
            dataIndex: 'invoice_no',
            width: 150,
            render: value => (
              <span className='font-semibold text-indigo-600'>{value}</span>
            )
          },
          {
            title: 'ឈ្មោះអតិថិជន',
            dataIndex: ['customer', 'customer_name'],
            width: 220,
            render: (value, record) => value || record.customer_name || '-'
          },
          {
            title: 'កាលបរិច្ឆេទវិក្កយបត្រ',
            dataIndex: 'invoice_date',
            width: 160,
            render: value => dateClient(value)
          },
          {
            title: 'ថ្ងៃកំណត់ទូទាត់',
            dataIndex: 'due_date',
            width: 160,
            render: value => dateClient(value)
          },
          {
            title: 'ទឹកប្រាក់សរុប',
            dataIndex: 'total_amount',
            width: 150,
            align: 'right',
            render: value => (
              <span className='text-gray-800 font-medium'>
                $
                {Number(value || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            )
          },
          {
            title: 'បានទូទាត់',
            dataIndex: 'paid_amount',
            width: 150,
            align: 'right',
            render: value => (
              <span className='text-green-600 font-medium'>
                $
                {Number(value || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            )
          },
          {
            title: 'ប្រាក់នៅសល់',
            dataIndex: 'balance_amount',
            width: 150,
            align: 'right',
            render: value => (
              <span className='text-red-500 font-semibold'>
                $
                {Number(value || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            )
          },
          {
            title: 'ស្ថានភាព',
            dataIndex: 'status',
            width: 140,
            align: 'center',
            render: (value, record) => {
              const statusStyles = {
                unpaid: {
                  bg: 'bg-red-50 text-red-600 border-red-200',
                  dot: 'bg-red-500'
                },
                partial: {
                  bg: 'bg-amber-50 text-amber-600 border-amber-200',
                  dot: 'bg-amber-500'
                },
                paid: {
                  bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
                  dot: 'bg-emerald-500'
                }
              }

              const currentStyle = statusStyles[value] || {
                bg: 'bg-gray-50 text-gray-600 border-gray-200',
                dot: 'bg-gray-500'
              }

              return (
                <Select
                  size='small'
                  value={value}
                  variant='borderless'
                  style={{ width: 115 }}
                  onChange={newValue => onStatusChange(record.id, newValue)}
                  styles={{ popup: { root: { textAlign: 'left' } } }}
                  className={`
                    ${currentStyle.bg}
                    border rounded-full font-medium text-xs text-center
                    transition-all duration-200 hover:opacity-80 cursor-pointer
                    h-8 flex items-center justify-center
                  `}
                  options={[
                    {
                      value: 'unpaid',
                      label: (
                        <div className='flex items-center gap-2'>
                          <span className='w-2 h-2 rounded-full bg-red-500' />
                          <span className='text-red-600 font-medium text-xs'>
                            មិនទាន់ទូទាត់
                          </span>
                        </div>
                      )
                    },
                    {
                      value: 'partial',
                      label: (
                        <div className='flex items-center gap-2'>
                          <span className='w-2 h-2 rounded-full bg-amber-500' />
                          <span className='text-amber-600 font-medium text-xs'>
                            ទូទាត់ខ្លះ
                          </span>
                        </div>
                      )
                    },
                    {
                      value: 'paid',
                      label: (
                        <div className='flex items-center gap-2'>
                          <span className='w-2 h-2 rounded-full bg-emerald-500' />
                          <span className='text-emerald-600 font-medium text-xs'>
                            បានទូទាត់រួច
                          </span>
                        </div>
                      )
                    }
                  ]}
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
      />
      ​{/* Custom Pagination */}
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
            setPagination({ page, limit: pageSize })
          }}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
        />
      </div>
    </>
  )
}

export default AccountsReceivableTable
