import { Table, Tag } from 'antd'
import { dateClient } from '../../../util/helper'

function AuditLogTable({ list, pagination }) {

  return (
    <Table
      dataSource={list}
      rowKey="id"
      pagination={false}
      scroll={{ x: 1200 }}
      columns={[
        {
          title: 'User',
          dataIndex: ['user', 'full_name'],
          key: 'user'
        },
        {
          title: 'Action',
          dataIndex: 'action_type',
          key: 'action_type',
          render: (val) => {
            const color =
              val === 'create' ? 'green'
              : val === 'update' ? 'orange'
              : 'red'

            return <Tag color={color}>{val}</Tag>
          }
        },
        {
          title: 'Module',
          dataIndex: 'module'
        },
        {
          title: 'Table',
          dataIndex: 'table_name'
        },
        {
          title: 'Record ID',
          dataIndex: 'record_id'
        },
        {
          title: 'IP',
          dataIndex: 'ip_address'
        },
        {
          title: 'Date',
          dataIndex: 'created_at',
          render: (v) => dateClient(v)
        }
      ]}
    />
  )
}

export default AuditLogTable