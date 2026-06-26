import {
  Table,
  Button,
  Space,
  Switch,
  Typography,
  Pagination,
  Tag,
  Tooltip
} from 'antd'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import { dateClient } from '../../../util/helper'
import CustomEmpty from '../../../components/common/CustomEmpty'

const { Text } = Typography

function CashFlowTable ({
  list,
  selectedRowKeys,
  setSelectedRowKeys,
  activeRowKey,
  setActiveRowKey,
  pagination,
  onEdit,
  onDelete,
  onBulkDelete,
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
        scroll={{ x: 1300 }}
        pagination={false}
        loading={loading}
        onRow={record => ({
          onClick: () => setActiveRowKey(record.id)
        })}
        rowClassName={record =>
          record.id === activeRowKey
            ? 'bg-blue-50/80 border-l-4 border-l-blue-500 transition-all duration-150 active-row-style'
            : 'hover:bg-gray-50/80 cursor-pointer transition-all duration-150'
        }
        locale={{
          emptyText: (
            <CustomEmpty
              title='មិនមានទិន្នន័យលំហូរសាច់ប្រាក់'
              description='បង្កើតទិន្នន័យលំហូរសាច់ប្រាក់ថ្មី ដើម្បីចាប់ផ្តើមគ្រប់គ្រងគណនេយ្យ'
              onReload={() => window.location.reload()}
            />
          )
        }}
        columns={[
          {
            title: 'កាលបរិច្ឆេទលំហូរ',
            dataIndex: 'flow_date',
            key: 'flow_date',
            width: 150,
            fixed: 'left',
            render: val => (
              <span className='font-medium text-gray-700'>
                {dateClient(val)}
              </span>
            )
          },
          {
            title: 'ប្រភេទលំហូរ',
            dataIndex: 'flow_type',
            key: 'flow_type',
            width: 150,
            render: type => {
              const isInflow = type === 'inflow'
              return (
                <Tag
                  // emerald-500: #10b981 | rose-500: #f43f5e
                  color={isInflow ? '#10b981' : '#f43f5e'}
                  className='font-medium rounded-md px-2.5 py-0.5'
                >
                  {isInflow ? 'លុយចូល (Inflow)' : 'លុយចេញ (Outflow)'}
                </Tag>
              )
            }
          },
          {
            title: 'គណនី (Chart of Account)',
            dataIndex: 'account',
            key: 'account_id',
            width: 250,
            render: account =>
              account ? (
                <div>
                  <div className='font-semibold text-gray-800'>
                    {account.account_name}
                  </div>
                  <div className='text-[11px] font-mono text-gray-400'>
                    {account.account_code}
                  </div>
                </div>
              ) : (
                '—'
              )
          },
          {
            title: 'ទឹកប្រាក់',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            align: 'right',
            render: (val, record) => (
              <span
                className={`font-bold text-base ${
                  record.flow_type === 'outflow'
                    ? 'text-red-600'
                    : 'text-emerald-600'
                }`}
              >
                {record.flow_type === 'outflow' ? '-' : '+'}$
                {Number(val || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                })}
              </span>
            )
          },
          {
            title: 'ប្រតិបត្តិការយោង',
            dataIndex: 'transaction',
            key: 'transaction_id',
            width: 180,
            render: transaction =>
              transaction?.transaction_no ? (
                <span className='font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md text-xs font-mono border border-purple-100'>
                  {transaction.transaction_no}
                </span>
              ) : (
                <span className='text-gray-400'>—</span>
              )
          },
          {
            title: 'ការពិពណ៌នា / កំណត់សម្គាល់',
            dataIndex: 'description',
            key: 'description',
            width: 280,
            ellipsis: true,
            render: text =>
              text ? (
                <Tooltip title={text}>
                  <span className='text-gray-600 text-sm'>{text}</span>
                </Tooltip>
              ) : (
                <span className='text-gray-300'>—</span>
              )
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
                  onClick={e => {
                    e.stopPropagation()
                    onEdit(record)
                  }}
                  className='hover:bg-blue-50 hover:text-blue-600'
                />
                <Button
                  type='text'
                  size='small'
                  danger
                  icon={<MdDelete style={{ fontSize: 18 }} />}
                  onClick={e => {
                    e.stopPropagation()
                    onDelete(record)
                  }}
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

export default CashFlowTable
