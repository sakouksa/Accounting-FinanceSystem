import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useAuditLog } from './hooks/useAuditLog'

import AuditLogFilter from './components/AuditLogFilter'
import AuditLogTable from './components/AuditLogTable'
import AuditLogHeader from './components/AuditLogHeader'
import AuditLogStats from './components/AuditLogStats'

function AuditLogPage () {
  const {
    state,
    setState,
    selectedRowKeys,
    setSelectedRowKeys,
    pagination,
    setPagination,
    resetPagination,
    getList,
    getStats
  } = useAuditLog()
  const handleOpenModal = () => {
    setState(prev => ({ ...prev, open: true, editingAuditLog: null }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingAuditLog: record
    }))
  }

  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>
        <AuditLogHeader onAdd={handleOpenModal} />
        <AuditLogStats stats={state.stats} />

        <AuditLogFilter
          pagination={pagination}
          setPagination={setPagination}
          onFilter={() => getList()}
          onReset={() => {
            resetPagination()
            getList({ page: 1, limit: 10, txt_search: '', status: null })
          }}
        />
        <AuditLogTable
          list={state.list}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          pagination={pagination}
        />
      </div>
    </MainPage>
  )
}

export default AuditLogPage
