import React, { useEffect } from 'react'
import MainPage from '../../components/layout/MainPage'
import { useAuditLog } from './hooks/useAuditLog'

import AuditLogFilter from './components/AuditLogFilter'
import AuditLogTable from './components/AuditLogTable'
import AuditLogHeader from './components/AuditLogHeader'
import AuditLogStats from './components/AuditLogStats'

function AuditLogPage() {
  const {
    state,
    filters,
    setFilters,
    selectedRowKeys,
    setSelectedRowKeys,
    pagination,
    setPagination,
    resetPagination,
    getList,
    getStats,
    resetFilters
  } = useAuditLog()

  useEffect(() => {
    getStats()
  }, [])

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

  const handleSearch = () => {
    resetPagination()
    getList(filters, { page: 1, limit: pagination.limit || 10 })
  }

  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>

        <AuditLogHeader onAdd={handleOpenModal} />

        <AuditLogStats stats={state.stats} />

        <AuditLogFilter
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onReset={resetFilters}
        />

        <AuditLogTable
          list={state.list}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          pagination={pagination}
          setPagination={setPagination}
        />

      </div>
    </MainPage>
  )
}

export default AuditLogPage