import {
  Table,
  Button,
  Space,
  Switch,
  Typography,
  Pagination,
  Image
} from 'antd'

import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import { dateClient } from '../../../util/helper'
import config from '../../../util/config'

const { Text } = Typography

function PaymentMethodTable({
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
                  បានជ្រើសរើស{' '}
                  <span className='font-semibold text-red-600'>
                    ទាំងអស់
                  </span>{' '}
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
            <Button onClick={() => setSelectedRowKeys([])}>
              បោះបង់
            </Button>

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
      size = "small"
        dataSource={list}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        rowKey='id'
        scroll={{ x: 1200 }}
        pagination={false}
        loading={loading}
        columns={[
          {
            title: 'ឈ្មោះវិធីបង់ប្រាក់',
            dataIndex: 'name',
            key: 'name',
            width: 180
          },

          {
            title: 'ឈ្មោះគណនី',
            dataIndex: 'account_name',
            key: 'account_name',
            width: 220
          },

          {
            title: 'លេខគណនី',
            dataIndex: 'account_number',
            key: 'account_number',
            width: 180,
            render: text => (
              <Text copyable strong>
                {text}
              </Text>
            )
          },

          {
            title: 'QR Code',
            dataIndex: 'qr_code_url',
            key: 'qr_code_url',
            align: 'center',
            width: 140,
            render: qr =>
              qr ? (
                <Image
                  src={qr}
                  width={45}
                  height={45}
                  className='object-cover rounded-lg border'
                />
              ) : (
                <Text type='secondary'>No Image</Text>
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
                  onStatusChange(
                    record.id,
                    checked ? 'active' : 'inactive'
                  )
                }
                checkedChildren='សកម្ម'
                unCheckedChildren='អសកម្ម'
                style={{
                  minWidth: 40,
                  height: 18,
                  backgroundColor:
                    val === 'active'
                      ? '#22c55e'
                      : '#ef4444'
                }}
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

      {/* Pagination */}
      <div className='flex justify-between items-center bg-white p-4 border border-gray-100 rounded-b-2xl shadow-sm mt-0.5'>
        <span className='text-gray-600 text-sm'>
          សរុប:{' '}
          <b className='text-indigo-600'>
            {pagination.total || 0}
          </b>{' '}
          ទិន្នន័យ
        </span>

        <Pagination
          current={pagination.page}
          pageSize={pagination.limit}
          total={pagination.total}
          onChange={(page, pageSize) => {
            if (pagination.onChange)
              pagination.onChange(page, pageSize)
          }}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
        />
      </div>
    </>
  )
}

export default PaymentMethodTable