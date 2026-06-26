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

function TransactionTypeTable ({
  list,
  selectedRowKeys,
  setSelectedRowKeys,
  pagination,
  setPagination,
  onEdit,
  onDelete,
  onBulkDelete,
  onDeleteAll,
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
        title: 'ID',
        dataIndex: 'id',
        width: 80
      },
      {
        title: 'ប្រតិបត្តិការ',
        dataIndex: 'transaction_id',
        width: 150,
        render: (_, record) => (
          <span className='font-semibold text-indigo-600'>
            {record.transaction?.transaction_no ||
              `#${record.transaction_id}`}
          </span>
        )
      },
      {
        title: 'គណនី',
        dataIndex: 'account_id',
        width: 220,
        render: (_, record) => (
          <div>
            <div className='font-medium'>
              {record.account?.account_name || '-'}
            </div>
            <div className='text-xs text-gray-500'>
              ID: {record.account_id}
            </div>
          </div>
        )
      },
      {
        title: 'Debit',
        dataIndex: 'debit_amount',
        width: 130,
        align: 'right',
        render: val => (
          <span className='text-green-600 font-semibold'>
            {Number(val || 0).toLocaleString()}
          </span>
        )
      },
      {
        title: 'Credit',
        dataIndex: 'credit_amount',
        width: 130,
        align: 'right',
        render: val => (
          <span className='text-red-500 font-semibold'>
            {Number(val || 0).toLocaleString()}
          </span>
        )
      },
      {
        title: 'ពិពណ៌នា',
        dataIndex: 'description',
        width: 250,
        render: text =>
          text?.length > 30
            ? `${text.slice(0, 30)}...`
            : text || '-'
      },
      {
        title: 'ថ្ងៃបង្កើត',
        dataIndex: 'created_at',
        width: 180,
        render: val => dateClient(val)
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
            setPagination({ page, limit: pageSize })
          }}
        />
      </div>
    </>
  )
}

export default TransactionTypeTable
