import React from 'react'
import {
  Table,
  Button,
  Space,
  Typography,
  Select,
  Pagination,
  Tag,
  Tooltip,
  Switch
} from 'antd'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import { dateClient } from '../../../util/helper'
import CustomEmpty from '../../../components/common/CustomEmpty'

const { Text } = Typography

function BudgetTable ({
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
        scroll={{ x: 1600 }}
        pagination={false}
        loading={loading}
        locale={{
          emptyText: (
            <CustomEmpty
              title='មិនមានទិន្នន័យថវិកា'
              description='បង្កើតទិន្នន័យថវិកាថ្មី ដើម្បីចាប់ផ្តើមគ្រប់គ្រងទិន្នន័យ'
              onReload={() => window.location.reload()}
            />
          )
        }}
        columns={[
          {
            title: 'ឈ្មោះថវិកា',
            dataIndex: 'budget_name',
            key: 'budget_name',
            width: 200,
            fixed: 'left',
            render: text => (
              <span className='font-semibold text-gray-800'>{text}</span>
            )
          },
          {
            title: 'ឆ្នាំហិរញ្ញវត្ថុ',
            dataIndex: 'fiscal_year',
            key: 'fiscal_year',
            width: 130,
            align: 'center',
            render: year => (
              <Tag
                color='blue'
                className='font-mono font-medium rounded-md px-2'
              >
                {year}
              </Tag>
            )
          },
          {
            title: 'គណនី (Chart of Account)',
            dataIndex: 'account',
            key: 'account',
            width: 220,
            render: account => (
              <div>
                <span className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 mr-1'>
                  {account?.account_code}
                </span>
                <Text strong className='text-gray-700'>
                  {account?.account_name || '—'}
                </Text>
              </div>
            )
          },
          {
            title: 'សាខា',
            dataIndex: 'branch',
            key: 'branch',
            width: 160,
            render: branch => (
              <span className='text-gray-600'>
                {branch?.name || '—'}
              </span>
            )
          },
          {
            title: 'កាលបរិច្ឆេទថវិកា',
            key: 'budget_duration',
            width: 220,
            render: (_, record) => (
              <div className='text-xs text-gray-600'>
                <div>
                  ចាប់ផ្តើម:{' '}
                  <span className='font-mono'>
                    {dateClient(record.start_date)}
                  </span>
                </div>
                <div>
                  បញ្ចប់:{' '}
                  <span className='font-mono'>
                    {dateClient(record.end_date)}
                  </span>
                </div>
              </div>
            )
          },
          {
            title: 'កញ្ចប់ថវិកាសរុប',
            dataIndex: 'allocated_amount',
            key: 'allocated_amount',
            width: 150,
            align: 'right',
            render: val => (
              <span className='font-semibold text-indigo-600 font-mono'>
                $
                {Number(val || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                })}
              </span>
            )
          },
          {
            title: 'ថវិកាប្រើប្រាស់រួច',
            dataIndex: 'used_amount',
            key: 'used_amount',
            width: 150,
            align: 'right',
            render: val => (
              <span className='font-semibold text-amber-600 font-mono'>
                $
                {Number(val || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                })}
              </span>
            )
          },
          {
            title: 'ថវិកានៅសល់',
            dataIndex: 'remaining_amount',
            key: 'remaining_amount',
            width: 150,
            align: 'right',
            render: val => (
              <span className='font-semibold text-emerald-600 font-mono'>
                $
                {Number(val || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2
                })}
              </span>
            )
          },
          {
            title: 'ស្ថានភាព',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            align: 'center',
            render: (value, record) => ( <
              Switch checked = {
                value === 'active'
              }
              onChange = {
                (checked) => onStatusChange(record.id, checked ? 'active' : 'closed')
              }
              checkedChildren = "សកម្ម"
              unCheckedChildren = "អសកម្ម"
              style = {
                {
                  backgroundColor: value === 'active' ? '#1677ff' : '#ff4d4f',
                  width: 80
                }
              }
              />
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

export default BudgetTable
