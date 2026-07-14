import { Table, Button, Space, Switch, Typography, Pagination, Skeleton, Empty } from 'antd'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import { dateClient } from '../../../util/helper'

const { Text } = Typography

function BranchTable ({
  list,
  selectedRowKeys,
  setSelectedRowKeys,
  pagination,
  onEdit,
  onDelete,
  onStatusChange,
  loading = false
}) {
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
              បានជ្រើសរើស{' '}
              <span className='font-semibold text-indigo-600'>
                {selectedRowKeys.length}
              </span>{' '}
              ទិន្នន័យ
            </div>
          </div>

          <Space>
            <Button onClick={() => setSelectedRowKeys([])}>បោះបង់</Button>
            <Button danger onClick={onDelete}>
              លុបជ្រើសរើស
            </Button>
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
        scroll={{ x: 1000 }}
        pagination={false}
        loading={loading}
        locale={{
          emptyText: loading ? (
            <div style={{ padding: '24px' }}>
              <Skeleton active paragraph={{ rows: 5 }} />
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='រកមិនឃើញទិន្នន័យឡើយ' />
          )
        }}
        columns={[
          { title: 'ឈ្មោះសាខា', dataIndex: 'name', key: 'name' },
          { title: 'កូដសាខា', dataIndex: 'code', key: 'code' },
          {
            title: 'អាសយដ្ឋាន',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true
          },
          { title: 'លេខទូរស័ព្ទ', dataIndex: 'phone', key: 'phone' },
          {
            title: 'ស្ថានភាព',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 110,
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
                className='text-xs'
              />
            )
          },
          {
            title: 'ថ្ងៃបង្កើត',
            dataIndex: 'created_at',
            key: 'created_at',
            render: val => dateClient(val)
          },
          {
            title: 'សកម្មភាព',
            key: 'action',
            align: 'center',
            width: 110,
            render: (_, record) => (
              <Space size={4}>
                <Button
                  type='text'
                  size='small'
                  icon={<CiEdit style={{ fontSize: 17 }} />}
                  onClick={() => onEdit(record)}
                  className='hover:bg-blue-50 hover:text-blue-600 text-gray-500 hover:border-blue-200 transition-all'
                  style={{ color: '#3b82f6', border: '1px solid transparent' }}
                />
                <Button
                  type='text'
                  size='small'
                  danger
                  icon={<MdDelete style={{ fontSize: 17 }} />}
                  onClick={() => onDelete(record)}
                  className='hover:bg-red-50 hover:text-red-600 transition-all'
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
        />
      </div>
    </>
  )
}

export default BranchTable
