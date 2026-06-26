import {
  Table,
  Button,
  Space,
  Typography,
  Select,
  Pagination,
  Tag,
  Tooltip
} from 'antd'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import { dateClient } from '../../../util/helper'
import CustomEmpty from '../../../components/common/CustomEmpty'

const { Text } = Typography

function PaymentTable ({
  list,
  selectedRowKeys,
  setSelectedRowKeys,
  pagination,
  onEdit,
  onDelete,
  onBulkDelete,
  onStatusChange,
  onDeleteAll,
  setPagination,
  getList,
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
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        rowKey='id'
        scroll={{ x: 1700 }}
        pagination={false}
        loading={loading}
        locale={{
          emptyText: (
            <CustomEmpty
              title='មិនមានទិន្នន័យទូទាត់ប្រាក់'
              description='បង្កើតទិន្នន័យទូទាត់ប្រាក់ថ្មី ដើម្បីចាប់ផ្តើមគ្រប់គ្រងទិន្នន័យ'
              onReload={() => window.location.reload()}
            />
          )
        }}
        columns={[
          {
            title: 'លេខបញ្ជាក់ការទូទាត់',
            dataIndex: 'payment_no',
            key: 'payment_no',
            width: 170,
            fixed: 'left',
            render: text => (
              <span className='font-semibold uppercase tracking-wider text-blue-600'>
                {text}
              </span>
            )
          },
          {
            title: 'ប្រភេទការទូទាត់',
            dataIndex: 'payment_type',
            key: 'payment_type',
            width: 140,
            render: type => {
              const isPayable = type === 'payable'
              return (
                <Tag
                  color={isPayable ? 'volcano' : 'cyan'}
                  className='font-medium rounded-md'
                >
                  {isPayable ? 'ចំណាយ (Payable)' : 'ចំណូល (Receivable)'}
                </Tag>
              )
            }
          },
          {
            title: 'យោងលើវិក្កយបត្រ',
            key: 'invoice_reference',
            width: 190,
            render: (_, record) => {
              if (record.payment_type === 'payable') {
                return (
                  <div>
                    <div className='text-[11px] text-gray-400 font-medium uppercase'>
                      លេខបុងទិញ (AP)
                    </div>
                    <Text strong className='text-gray-700'>
                      {record.accounts_payable?.bill_no || '—'}
                    </Text>
                    <div className='text-xs text-gray-500 truncate'>
                      {record.accounts_payable?.supplier?.supplier_name}
                    </div>
                  </div>
                )
              }
              return (
                <div>
                  <div className='text-[11px] text-gray-400 font-medium uppercase'>
                    លេខវិក្កយបត្រ (AR)
                  </div>
                  <Text strong className='text-gray-700'>
                    {record.accounts_receivable?.invoice_no || '—'}
                  </Text>
                  <div className='text-xs text-gray-500 truncate'>
                    {record.accounts_receivable?.customer?.customer_name}
                  </div>
                </div>
              )
            }
          },
          {
            title: 'កាលបរិច្ឆេទប្រតិបត្តិការ',
            dataIndex: 'payment_date',
            key: 'payment_date',
            width: 170,
            render: val => dateClient(val)
          },
          {
            title: 'វិធីសាស្ត្រទូទាត់',
            dataIndex: 'payment_method',
            key: 'payment_method_id',
            width: 150,
            render: (_, record) => (
              <span className='font-medium text-gray-700'>
                {record.payment_method?.name || '—'}
              </span>
            )
          },
          {
            title: 'ទឹកប្រាក់ទូទាត់',
            dataIndex: 'amount',
            key: 'amount',
            width: 140,
            align: 'right',
            render: (val, record) => (
              <span
                className={`font-semibold ${
                  record.payment_type === 'payable'
                    ? 'text-red-600'
                    : 'text-emerald-600'
                }`}
              >
                {record.currency_code === 'KHR' ? '៛' : '$'}
                {Number(val || 0).toLocaleString(undefined, {
                  minimumFractionDigits: record.currency_code === 'KHR' ? 0 : 2
                })}
              </span>
            )
          },
          {
            title: 'អត្រាប្តូរប្រាក់',
            dataIndex: 'exchange_rate',
            key: 'exchange_rate',
            width: 130,
            align: 'right',
            render: val => (
              <span className='font-mono text-gray-600'>
                {Number(val || 1).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                })}
              </span>
            )
          },
          {
            title: 'លេខយោង (Ref)',
            dataIndex: 'reference_no',
            key: 'reference_no',
            width: 140,
            render: text =>
              text ? (
                <span className='text-gray-600 font-mono'>{text}</span>
              ) : (
                '—'
              )
          },
          {
            title: 'លេខកូដប្រតិបត្តិការ',
            dataIndex: 'transaction',
            key: 'transaction_id',
            width: 160,
            render: transaction =>
              transaction?.transaction_no ? (
                <span className='font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md text-xs font-mono border border-purple-100'>
                  {transaction.transaction_no}
                </span>
              ) : (
                '—'
              )
          },
          {
            title: 'អ្នកកត់ត្រា',
            dataIndex: 'recorder',
            key: 'recorded_by',
            width: 130,
            render: recorder => (
              <span className='text-gray-500 text-sm'>
                {recorder?.username || '—'}
              </span>
            )
          },
          {
            title: 'កំណត់សម្គាល់',
            dataIndex: 'remarks',
            key: 'remarks',
            width: 180,
            ellipsis: true,
            render: text =>
              text ? (
                <Tooltip title={text}>
                  <span className='text-gray-500 text-xs'>{text}</span>
                </Tooltip>
              ) : (
                <span className='text-gray-300'>—</span>
              )
          },
          {
            title: 'ស្ថានភាព',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            align: 'center',
            render: (value, record) => {
              const statusStyles = {
                pending: {
                  bg: 'bg-amber-50 text-amber-600 border-amber-200',
                  dot: 'bg-amber-500'
                },
                completed: {
                  bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
                  dot: 'bg-emerald-500'
                },
                cancelled: {
                  bg: 'bg-gray-50 text-gray-400 border-gray-200',
                  dot: 'bg-gray-400'
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
                  style={{ width: 120 }}
                  onChange={newValue => onStatusChange(record.id, newValue)}
                  dropdownStyle={{ textAlign: 'left' }}
                  className={`
            ${currentStyle.bg}
            border rounded-full font-medium text-xs
            transition-all duration-200 hover:opacity-80 cursor-pointer
            h-8 flex items-center justify-center
          `}
                  options={[
                    {
                      value: 'pending',
                      label: (
                        <div className='flex items-center gap-2'>
                          <span className='w-2 h-2 rounded-full bg-amber-500' />
                          <span className='text-amber-600 font-medium text-xs'>
                            កំពុងរង់ចាំ
                          </span>
                        </div>
                      )
                    },
                    {
                      value: 'completed',
                      label: (
                        <div className='flex items-center gap-2'>
                          <span className='w-2 h-2 rounded-full bg-emerald-500' />
                          <span className='text-emerald-600 font-medium text-xs'>
                            រួចរាល់
                          </span>
                        </div>
                      )
                    },
                    {
                      value: 'cancelled',
                      label: (
                        <div className='flex items-center gap-2'>
                          <span className='w-2 h-2 rounded-full bg-red-400' />
                          <span className='text-red-500 font-medium text-xs'>
                            បានបោះបង់
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
                />
                <Button
                  type='text'
                  size='small'
                  danger
                  icon={<MdDelete style={{ fontSize: 18 }} />}
                  onClick={() => onDelete(record)}
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
            setPagination({
              page,
              limit: pageSize
            })
            getList({
              page,
              limit: pageSize
            })
          }}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
        />
      </div>
    </>
  )
}

export default PaymentTable
