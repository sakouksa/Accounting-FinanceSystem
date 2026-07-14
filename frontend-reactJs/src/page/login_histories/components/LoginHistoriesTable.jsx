import { Table, Tag, Typography, Pagination } from 'antd'
import { dateClient } from '../../../util/helper'
import CustomEmpty from '../../../components/common/CustomEmpty'

const { Text } = Typography

function LoginHistoriesTable({
  list,
  pagination,
  loading = false,
  setPagination
}) {
  const columns = [
    {
      title: 'អ្នកប្រើប្រាស់',
      dataIndex: ['user', 'full_name'],
      key: 'user',
      width: 250,
      render: (_, record) => (
        <div>
          <Text strong>
            {record.user?.full_name || record.user?.username || '-'}
          </Text>

          {record.user?.username && (
            <div className='text-xs text-gray-500'>
              @{record.user.username}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'IP Address',
      dataIndex: 'ip_address',
      key: 'ip_address',
      width: 180,
      render: ip => (
        <span className='font-mono text-sm'>
          {ip || '-'}
        </span>
      )
    },
    {
      title: 'Browser / Device',
      dataIndex: 'user_agent',
      key: 'user_agent',
      width: 450,
      ellipsis: true,
      render: value => (
        <span title={value}>
          {value || '-'}
        </span>
      )
    },
    {
      title: 'Login Time',
      dataIndex: 'login_at',
      key: 'login_at',
      width: 200,
      render: value => (
        <div>
          <div>{dateClient(value)}</div>
          <div className='text-xs text-gray-400'>
            {value
              ? new Date(value).toLocaleTimeString()
              : '-'}
          </div>
        </div>
      )
    },
    {
      title: 'Logout Time',
      dataIndex: 'logout_at',
      key: 'logout_at',
      width: 200,
      render: value =>
        value ? (
          <div>
            <div>{dateClient(value)}</div>
            <div className='text-xs text-gray-400'>
              {new Date(value).toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <Tag color='green'>
            Online
          </Tag>
        )
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (_, record) =>
        record.logout_at ? (
          <Tag color='default'>
            Offline
          </Tag>
        ) : (
          <Tag color='success'>
            Online
          </Tag>
        )
    }
  ]

  return (
    <>
      <Table
        rowKey='id'
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={false}
        scroll={{ x: 1400 }}
        locale={{
          emptyText: (
            <CustomEmpty
              title='មិនមាន Login History'
              description='មិនទាន់មានប្រវត្តិ Login'
            />
          )
        }}
      />

      <div className='flex justify-between items-center bg-white p-4 border border-gray-100 rounded-b-2xl shadow-sm mt-0.5'>
        <span className='text-sm text-gray-600'>
          សរុប៖{' '}
          <b className='text-indigo-600'>
            {pagination.total || 0}
          </b>{' '}
          កំណត់ត្រា
        </span>

        <Pagination
          current={pagination.page}
          pageSize={pagination.limit}
          total={pagination.total}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
          onChange={(page, pageSize) =>
            setPagination({
              page,
              limit: pageSize
            })
          }
          showTotal={total =>
            `សរុប ${total} កំណត់ត្រា`
          }
        />
      </div>
    </>
  )
}

export default LoginHistoriesTable
