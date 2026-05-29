import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useChartOfAccount } from './hooks/useChartOfAccount'

import ChartOfAccountFilter from './components/ChartOfAccountFilter'
import ChartOfAccountTable from './components/ChartOfAccountTable'
import ChartOfAccountModal from './components/ChartOfAccountModal'
import ChartOfAccountHeader from './components/ChartOfAccountHeader'
import ChartOfAccountStats from './components/ChartOfAccountStats'

function ChartOfAccountPage() {
  const {
    state,
    setState,
    selectedRowKeys,
    setSelectedRowKeys,
    pagination,
    setPagination,
    resetPagination,
    getList,
    getStats,
    handleStatusChange,
    handleBulkDelete,
    handleDelete,
    handleDeleteAll
  } = useChartOfAccount()

  // Filter State
  const [filter, setFilter] = React.useState({
    txt_search: '',
    status: null,
    account_type_id: null,
  })

  const handleOpenModal = () => {
    setState(prev => ({ ...prev, open: true, editingChartOfAccount: null }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingChartOfAccount: record
    }))
  }

  const handleFilter = () => {
    getList(filter)
  }

  const handleReset = () => {
    const defaultFilter = {
      txt_search: '',
      status: null,
      account_type_id: null,
    }
    setFilter(defaultFilter)
    resetPagination()
    getList(defaultFilter)
  }

  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>
        <ChartOfAccountHeader onAdd={handleOpenModal} />

        <ChartOfAccountStats stats={state.stats} />

        <ChartOfAccountFilter
          filter={filter}
          setFilter={setFilter}
          accountTypes={state.account_types || []}
          onFilter={handleFilter}
          onReset={handleReset}
        />

        <ChartOfAccountTable
          list={state.list}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          pagination={pagination}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
          onBulkDelete={handleBulkDelete}
          onStatusChange={handleStatusChange}
        />

        <ChartOfAccountModal
          open={state.open}
          setState={setState}
          editingChartOfAccount={state.editingChartOfAccount}
          onSuccess={() => {
            getList(filter)   // Refresh with current filter
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default ChartOfAccountPage