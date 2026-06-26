import { Table, Button, Space, Switch, Typography, Pagination, Tag } from 'antd'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import { dateClient } from '../../../util/helper'

const { Text } = Typography

function TransactionTable ({
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
                  ប្រតិបត្តិការ
                </>
              ) : (
                <>
                  បានជ្រើសរើស{' '}
                  <span className='font-semibold text-indigo-600'>
                    {selectedRowKeys.length}
                  </span>{' '}
                  ប្រតិបត្តិការ
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
        rowKey='id'
        dataSource={list}
        loading={loading}
        pagination={false}
        scroll={{ x: 1800 }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        columns={[
          {
            title: 'លេខប្រតិបត្តិការ',
            dataIndex: 'transaction_no',
            key: 'transaction_no',
            width: 180,
            render: text => (
              <span className='font-semibold uppercase tracking-wider text-blue-600'>
                {text}
              </span>
            )
          },

          {
            title: 'កាលបរិច្ឆេទ',
            dataIndex: 'transaction_date',
            key: 'transaction_date',
            width: 150,
            render: val => dateClient(val)
          },

          {
            title: 'ប្រភេទប្រតិបត្តិការ',
            dataIndex: 'transaction_type',
            key: 'transaction_type',
            width: 220,
            render: type => {
              if (!type) return <Tag color='default'>—</Tag>

              return (
                <Tag color='purple' className='font-medium'>
                  {type.name} {type.code ? `(${type.code})` : ''}
                </Tag>
              )
            }
          },

          {
            title: 'សាខា',
            dataIndex: 'branch',
            key: 'branch',
            width: 220,
            render: branch => (
              <span className='font-medium text-gray-700'>
                {branch ? branch.name : '—'}
              </span>
            )
          },

          {
            title: 'រូបិយប័ណ្ណ',
            dataIndex: 'currency_code',
            key: 'currency_code',
            width: 120,
            align: 'center',
            render: code => <Tag color='blue'>{code || '—'}</Tag>
          },

          {
            title: 'អត្រាប្តូរប្រាក់',
            dataIndex: 'exchange_rate',
            key: 'exchange_rate',
            width: 140,
            align: 'right',
            render: val => (
              <span className='font-medium'>
                {Number(val || 1).toLocaleString()}
              </span>
            )
          },

          {
            title: 'សរុប Debit',
            dataIndex: 'total_debit',
            key: 'total_debit',
            width: 160,
            align: 'right',
            render: val => (
              <span className='font-semibold text-emerald-600'>
                {Number(val || 0).toLocaleString()}
              </span>
            )
          },

          {
            title: 'សរុប Credit',
            dataIndex: 'total_credit',
            key: 'total_credit',
            width: 160,
            align: 'right',
            render: val => (
              <span className='font-semibold text-orange-600'>
                {Number(val || 0).toLocaleString()}
              </span>
            )
          },

          {
            title: 'Reference',
            key: 'reference',
            width: 220,
            render: (_, record) => (
              <span className='text-gray-600'>
                {record.reference_type
                  ? `${record.reference_type} (${record.reference_id || '-'})`
                  : '—'}
              </span>
            )
          },

          {
            title: 'ពិពណ៌នា',
            dataIndex: 'description',
            key: 'description',
            width: 300,
            render: text => (
              <Text ellipsis={{ tooltip: text }}>{text || '—'}</Text>
            )
          },

          {
            title: 'ចំនួន Details',
            dataIndex: 'details',
            key: 'details',
            width: 140,
            align: 'center',
            render: details => (
              <Tag color='cyan'>{details?.length || 0} បន្ទាត់</Tag>
            )
          },

          {
            title: 'ស្ថានភាព',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: 'center',
            render: val => {
              let color = 'default'

              if (val === 'Approved') color = 'green'
              else if (val === 'Pending') color = 'orange'
              else if (val === 'Cancelled') color = 'red'

              return (
                <Tag color={color} className='font-medium px-3 py-1'>
                  {val === 'Approved'
                    ? 'អនុម័ត'
                    : val === 'Pending'
                    ? 'រង់ចាំ'
                    : 'បានបោះបង់'}
                </Tag>
              )
            }
          },

          {
            title: 'ថ្ងៃបង្កើត',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 170,
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
          onChange = {
            (page, pageSize) => {
              setPagination({
                page,
                limit: pageSize
              })
              getList({
                page,
                limit: pageSize
              })
            }
          }
        />
      </div>
    </>
  )
}

export default TransactionTable
