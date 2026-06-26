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
  onEdit,
  onDelete,
  setPagination,
  onBulkDelete,
  onStatusChange,
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
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        rowKey='id'
        scroll={{ x: 1100 }}
        pagination={false}
        locale = {
          {
            emptyText: ( <
              CustomEmpty title = 'មិនមានប្រភេទប្រតិបត្តិការ'
              description = 'បង្កើតប្រភេទប្រតិបត្តិការថ្មី ដើម្បីចាប់ផ្តើមកត់ត្រាប្រតិបត្តិការ'
              onReload = {
                () => window.location.reload()
              }
              />
            )
          }
        }
        columns={[
          {
            title: 'កូដ',
            dataIndex: 'code',
            key: 'code',
            width: 150,
            render: text => (
              <span className='font-semibold text-indigo-600'>{text}</span>
            )
          },
          {
            title: 'ឈ្មោះ',
            dataIndex: 'name',
            key: 'name',
            width: 220
          },
          {
            title: 'ពិពណ៌នា',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
          },
          {
            title: 'ស្ថានភាព',
            dataIndex: 'is_active',
            key: 'is_active',
            align: 'center',
            width: 110,
            render: (val, record) => ( <
              Switch size = 'small'
              checked = {
                val === 1
              }
              onChange = {
                checked => onStatusChange(record.id, checked)
              }
              checkedChildren = 'សកម្ម'
              unCheckedChildren = 'អសកម្ម'
              style = {
                {
                  backgroundColor: val === 1 ? '#1677ff' : '#ff4d4f'
                }
              }
              />
            )
          },
          {
            title: 'ថ្ងៃបង្កើត',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 180,
            render: val => dateClient(val)
          },
          {
            title: 'សកម្មភាព',
            key: 'action',
            align: 'center',
            width: 120,
            fixed: 'right',
            render: (_, record) => (
              <Space>
                <Button
                  type='text'
                  icon={<CiEdit />}
                  onClick={() => onEdit(record)}
                />
                <Button
                  danger
                  type='text'
                  icon={<MdDelete />}
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
