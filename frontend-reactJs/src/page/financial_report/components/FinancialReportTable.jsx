import {
  Table,
  Button,
  Space,
  Typography,
  Pagination,
  Tag,
  Tooltip
} from 'antd'
import { CiEdit } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import {
  FilePdfOutlined,
  FileExcelOutlined,
  FileOutlined
} from '@ant-design/icons'
import { dateClient } from '../../../util/helper'
import config from '../../../util/config'

const { Text } = Typography

function FinancialReportTable ({
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
        columns={[
          {
            title: 'ប្រភេទរបាយការណ៍',
            dataIndex: 'report_type',
            key: 'report_type',
            width: 280,
            fixed: 'left',
            render: type => {
              const types = {
                balance_sheet: {
                  label: 'តារាងតុល្យការ (Balance Sheet)',
                  color: 'blue'
                },
                income_statement: {
                  label: 'របាយការណ៍លទ្ធផលហិរញ្ញវត្ថុ (Income Statement)',
                  color: 'cyan'
                },
                cash_flow: {
                  label: 'របាយការណ៍លំហូរសាច់ប្រាក់ (Cash Flow)',
                  color: 'purple'
                },
                trial_balance: {
                  label: 'តារាងតុល្យភាពសាកល្បង (Trial Balance)',
                  color: 'orange'
                }
              }
              const current = types[type] || { label: type, color: 'default' }
              return (
                <Tag
                  color={current.color}
                  className='font-medium rounded-md px-2.5 py-0.5'
                >
                  {current.label}
                </Tag>
              )
            }
          },
          {
            title: 'សាខា (Branch)',
            dataIndex: 'branch',
            key: 'branch_id',
            width: 180,
            render: branch =>
              branch ? (
                <span className='font-semibold text-gray-700'>
                  {branch.name}
                </span>
              ) : (
                <Tag color='gold'>គ្រប់សាខាទាំងអស់</Tag>
              )
          },
          {
            title: 'កាលបរិច្ឆេទចាប់ផ្តើម',
            dataIndex: 'start_date',
            key: 'start_date',
            width: 160,
            render: val => (
              <span className='text-gray-600'>{dateClient(val)}</span>
            )
          },
          {
            title: 'កាលបរិច្ឆេទបញ្ចប់',
            dataIndex: 'end_date',
            key: 'end_date',
            width: 160,
            render: val => (
              <span className='text-gray-600'>{dateClient(val)}</span>
            )
          },
          {
            title: 'អ្នកបង្កើត',
            dataIndex: 'generator',
            key: 'generated_by',
            width: 160,
            render: gen =>
              gen ? (
                <span className='text-gray-700 font-medium'>
                  {gen.full_name}
                </span>
              ) : (
                '—'
              )
          },
          {
            title: 'ឯកសារយោង',
            dataIndex: 'file_path',
            key: 'file_path',
            width: 150,
            align: 'center',
            render: filePath => {
              if (filePath) {
                const fullUrl = filePath.startsWith('http')
                  ? filePath
                  : `${config.image_path}${filePath.replace(/^\//, '')}`

                const fileName = filePath.split('/').pop()
                const ext = fileName.split('.').pop().toLowerCase()
                let fileIcon = (
                  <FileOutlined className='text-blue-500 text-xl' />
                )
                if (ext === 'pdf')
                  fileIcon = (
                    <FilePdfOutlined className='text-red-500 text-xl' />
                  )
                if (['xlsx', 'xls'].includes(ext))
                  fileIcon = (
                    <FileExcelOutlined className='text-green-600 text-xl' />
                  )

                return (
                  <Space size={8} wrap className='justify-center'>
                    <Tooltip title={`បើកមើលឯកសារ៖ ${fileName}`}>
                      <Button
                        type='text'
                        shape='circle'
                        icon={fileIcon}
                        className='hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-110 h-9 w-9'
                        onClick={e => {
                          e.stopPropagation()
                          window.open(fullUrl, '_blank')
                        }}
                      />
                    </Tooltip>
                  </Space>
                )
              }
              return <span className='text-gray-300 font-medium'>—</span>
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

export default FinancialReportTable
