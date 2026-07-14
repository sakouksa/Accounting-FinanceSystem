import { Table, Tag, Button, Space, Typography, Pagination } from 'antd'
import { MdDelete } from 'react-icons/md'
import { dateClient } from '../../../util/helper'
import CustomEmpty from '../../../components/common/CustomEmpty'

const { Text } = Typography

function AuditLogTable({
  list,
  pagination,
  loading = false,
  setPagination,
  getList
}) {
  return (
    <>
      <Table
        dataSource={list}
        rowKey="id"
        scroll={{ x: 1600 }}
        pagination={false}
        loading={loading}
        locale={{
          emptyText: (
            <CustomEmpty
              title="មិនមាន Audit Log"
              description="មិនទាន់មានសកម្មភាពណាមួយត្រូវបានកត់ត្រា"
            />
          )
        }}
        columns={[
          {
            title: 'User',
            dataIndex: ['user', 'full_name'],
            key: 'user',
            width: 220,
            render: (_, record) => (
              <div>
                <Text strong>
                  {record.user?.full_name || record.user?.username || '-'}
                </Text>
                {record.user?.username && (
                  <div className='text-gray-500 text-xs'>
                    @{record.user.username}
                  </div>
                )}
              </div>
            )
          },
          {
            title: 'Action',
            dataIndex: 'action_type',
            key: 'action_type',
            width: 140,
            render: (val) => {
              let color = 'default'
              let text = val?.toUpperCase() || '-'

              if (val === 'login') color = 'blue'
              else if (val === 'create') color = 'green'
              else if (val === 'update') color = 'orange'
              else if (val === 'delete') color = 'red'
              else if (val === 'logout') color = 'purple'

              return <Tag color={color} className='font-medium'>{text}</Tag>
            }
          },
          {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
            width: 160,
            render: text => <span className='font-medium text-gray-700'>{text || '-'}</span>
          },
          {
            title: 'Table',
            dataIndex: 'table_name',
            key: 'table_name',
            width: 180,
            render: text => (
              <span className='font-mono text-xs bg-gray-100 px-2 py-1 rounded'>
                {text || '-'}
              </span>
            )
          },
          {
            title: 'Record ID',
            dataIndex: 'record_id',
            key: 'record_id',
            width: 120,
            align: 'center',
            render: id => id ? <Text strong>{id}</Text> : '-'
          },
          {
            title: 'IP Address',
            dataIndex: 'ip_address',
            key: 'ip_address',
            width: 140,
            render: ip => (
              <span className='font-mono text-sm'>{ip || '-'}</span>
            )
          },
          {
            title: 'Device Info',
            dataIndex: 'device_info',
            key: 'device_info',
            width: 300,
            ellipsis: true,
            render: text => (
              <span className='text-gray-500 text-sm' title={text}>
                {text ? text.substring(0, 60) + '...' : '-'}
              </span>
            )
          },
          {
            title: 'ថ្ងៃកត់ត្រា',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 180,
            render: val => (
              <div>
                <div>{dateClient(val) || '-'}</div>
                <div className='text-xs text-gray-400'>
                  {val ? new Date(val).toLocaleTimeString('km-KH') : ''}
                </div>
              </div>
            )
          },
        ]}
      />

      {/* Custom Pagination */}
      <div className='flex justify-between items-center bg-white p-4 border border-gray-100 rounded-b-2xl shadow-sm mt-0.5'>
        <span className='text-gray-600 text-sm'>
          សរុប: <b className='text-indigo-600'>{pagination.total || 0}</b> កំណត់ត្រា
        </span>

        <Pagination
          current={pagination.page}
          pageSize={pagination.limit}
          total={pagination.total}
          onChange={(page, pageSize) => {
            setPagination({ page, limit: pageSize })
            getList({ page, limit: pageSize })
          }}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
          showTotal={(total) => `ទំព័រ ${pagination.page} នៃ ${Math.ceil(total / pagination.limit)}`}
        />
      </div>
    </>
  )
}

export default AuditLogTable
