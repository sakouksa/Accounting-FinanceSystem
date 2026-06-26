import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useReport } from './hooks/useReport'

import ReportFilter from './components/ReportFilter'
import ReportTable from './components/ReportTable'
import ReportModal from './components/ReportModal'
import ReportHeader from './components/ReportHeader'
import ReportStats from './components/ReportStats'

function ReportPage () {
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
  } = useReport()

  const [filter, setFilter] = React.useState({
    txt_search: '',
    report_type: null,
    branch_id: null,
    from_date: null,
    to_date: null
  })

  const handleOpenModal = () => {
    setState(prev => ({ ...prev, open: true, editingReport: null }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingReport: record
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
        <ReportHeader onAdd={handleOpenModal} />

        <ReportStats stats={state.stats} />

        <ReportFilter
          filter={filter}
          setFilter={setFilter}
          branches={state.branches || []}
          onFilter={handleFilter}
          onReset={handleReset}
          setPagination={setPagination}
        />

        <ReportTable
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

        <ReportModal
          open={state.open}
          setState={setState}
          branches={state.branches || []} 
          editingReport={state.editingReport}
          onSuccess={() => {
            getList(filter)
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default ReportPage