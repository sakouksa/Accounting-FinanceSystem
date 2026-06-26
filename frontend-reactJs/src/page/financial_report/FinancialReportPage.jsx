import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useFinancialReport } from './hooks/useFinancialReport'

import FinancialReportFilter from './components/FinancialReportFilter'
import FinancialReportTable from './components/FinancialReportTable'
import FinancialReportModal from './components/FinancialReportModal'
import FinancialReportHeader from './components/FinancialReportHeader'
import FinancialReportStats from './components/FinancialReportStats'

function FinancialReportPage () {
  const {
    state,
    setState,
    selectedRowKeys,
    setSelectedRowKeys,
    activeRowKey,
    setActiveRowKey,
    pagination,
    setPagination,
    resetPagination,
    getList,
    getStats,
    handleBulkDelete,
    handleDelete,
    handleDeleteAll,
  } = useFinancialReport()

  const [filter, setFilter] = React.useState({
    txt_search: '',
    report_type: null,
    branch_id: null,
    from_date: null,
    to_date: null
  })

  const handleOpenModal = () => {
    setState(prev => ({ ...prev, open: true, editingFinancialReport: null }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingFinancialReport: record
    }))
  }

  const handleFilter = () => {
    getList(filter)
  }

  const handleReset = () => {
    const defaultFilter = {
      txt_search: '',
      report_type: null,
      branch_id: null,
      from_date: null,
      to_date: null
    }
    setFilter(defaultFilter)
    resetPagination()
    getList(defaultFilter)
  }

  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>
        <FinancialReportHeader onAdd={handleOpenModal} />

        <FinancialReportStats stats={state.stats} />

        <FinancialReportFilter
          filter={filter}
          setFilter={setFilter}
          branches={state.branches || []}
          onFilter={handleFilter}
          onReset={handleReset}
          setPagination={setPagination}
        />

        <FinancialReportTable
          list={state.list}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          activeRowKey={activeRowKey}
          setActiveRowKey={setActiveRowKey}
          pagination={pagination}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
          onBulkDelete={handleBulkDelete}
          setPagination={setPagination}
          getList={getList}
          loading={state.loading}
        />

        <FinancialReportModal
          open={state.open}
          setState={setState}
          branches={state.branches || []} 
          editingFinancialReport={state.editingFinancialReport}
          onSuccess={() => {
            getList(filter)
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default FinancialReportPage