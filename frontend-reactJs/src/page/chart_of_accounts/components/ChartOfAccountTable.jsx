import { Table, Button, Space, Switch, Typography, Pagination, Tag } from 'antd'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import { dateClient } from '../../../util/helper'
import CustomEmpty from '../../../components/common/CustomEmpty'

const { Text } = Typography

function ChartOfAccountTable ({
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
        onChange = {
          (pagination, filters, sorter) => {
            const sortField = sorter.field;
            let sortOrder = null;

            if (sorter.order === 'ascend') sortOrder = 'asc';
            if (sorter.order === 'descend') sortOrder = 'desc';
            getList({
              sort_by: sortOrder ? sortField : null,
              sort_order: sortOrder
            });
          }
        }
        locale={{
          emptyText: (
            <CustomEmpty
              title='មិនមានគណនី'
              description='បង្កើតគណនីថ្មី ដើម្បីចាប់ផ្តើមកត់ត្រាប្រតិបត្តិការ'
              onReload={() => window.location.reload()}
            />
          )
        }}
        columns={[
          {
            title: 'កូដគណនី',
            dataIndex: 'account_code',
            key: 'account_code',
            width: 130,
            render: text => (
              <span className='font-semibold uppercase tracking-wider text-blue-600'>
                {text}
              </span>
            )
          },
          {
            title: 'ឈ្មោះគណនី',
            dataIndex: 'account_name',
            key: 'account_name',
            width: 280,
            render: text => <Text strong>{text}</Text>
          },
          {
            title: 'ប្រភេទគណនី',
            dataIndex: 'account_type',
            key: 'account_type',
            width: 220,
            render: accountType => {
              if (!accountType) return <Tag color='default'>—</Tag>
              const code = accountType.code ? `(${accountType.code})` : ''
              return (
                <Tag color='purple' className='font-medium'>
                  {accountType.name} {code}
                </Tag>
              )
            }
          },
          {
            title: 'គណនីមេ',
            dataIndex: 'parent',
            key: 'parent',
            width: 250,
            render: parent => (
              <span className='text-gray-600 font-medium'>
                {parent
                  ? `${parent.account_code} - ${parent.account_name}`
                  : '—'}
              </span>
            )
          },
          {
            title: 'សមតុល្យធម្មតា',
            dataIndex: 'normal_balance',
            key: 'normal_balance',
            width: 140,
            align: 'center',
            render: val => (
              <Tag color={val === 'Debit' ? 'green' : 'orange'}>
                {val === 'Debit' ? 'ឥណពន្ធ (Debit)' : 'ឥណទាន (Credit)'}
              </Tag>
            )
          },
          {
            title: 'សមតុល្យដើម',
            dataIndex: 'opening_balance',
            key: 'opening_balance',
            width: 150,
            align: 'right',
            render: val => (
              <span className='font-medium'>
                {Number(val || 0).toLocaleString()}
              </span>
            )
          },
          {
            title: 'សមតុល្យបច្ចុប្បន្ន',
            dataIndex: 'current_balance',
            key: 'current_balance',
            width: 160,
            align: 'right',
            render: val => (
              <span
                className={`font-semibold ${
                  val < 0 ? 'text-red-600' : 'text-emerald-600'
                }`}
              >
                {Number(val || 0).toLocaleString()}
              </span>
            )
          },
          {
            title: 'រូបិយប័ណ្ណ',
            dataIndex: 'currency_code',
            key: 'currency_code',
            width: 100,
            align: 'center',
            render: code => (code ? <strong>{code}</strong> : '—')
          },
          {
            title: 'ស្ថានភាព',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            align: 'center',
            render: (val, record) => {
              const isActive = val === 'Active'

              return (
                <Switch
                  size='small'
                  checked={isActive}
                  onChange={checked =>
                    onStatusChange(record.id, checked ? 'Active' : 'Inactive')
                  }
                  checkedChildren='សកម្ម'
                  unCheckedChildren='អសកម្ម'
                  className={`
          ${isActive ? '!bg-blue-500' : '!bg-red-500'}
        `}
                />
              )
            }
          },
          {
            title: 'ថ្ងៃបង្កើត',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 160,
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
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
        />
      </div>
    </>
  )
}

export default ChartOfAccountTable
