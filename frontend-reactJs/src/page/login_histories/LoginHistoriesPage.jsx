import React, { useEffect } from 'react'
import MainPage from '../../components/layout/MainPage'
import { useLoginHistories } from './hooks/useLoginHistories'

import LoginHistoriesFilter from './components/LoginHistoriesFilter'
import LoginHistoriesTable from './components/LoginHistoriesTable'
import LoginHistoriesHeader from './components/LoginHistoriesHeader'
import LoginHistoriesStats from './components/LoginHistoriesStats'

function LoginHistoriesPage() {
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
  } = useLoginHistories()

  useEffect(() => {
    getStats()
  }, [])

  const handleOpenModal = () => {
    setState(prev => ({ ...prev, open: true, editingLoginHistories: null }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingLoginHistories: record
    }))
  }

  const handleSearch = () => {
    resetPagination()
    getList(filters, { page: 1, limit: pagination.limit || 10 })
  }

  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>

        <LoginHistoriesHeader onAdd={handleOpenModal} />

        <LoginHistoriesStats stats={state.stats} />

        <LoginHistoriesFilter
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onReset={resetFilters}
        />

        <LoginHistoriesTable
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

export default LoginHistoriesPage
