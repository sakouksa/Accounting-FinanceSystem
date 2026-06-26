import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useCashFlow } from './hooks/useCashFlow'

import CashFlowFilter from './components/CashFlowFilter'
import CashFlowTable from './components/CashFlowTable'
import CashFlowModal from './components/CashFlowModal'
import CashFlowHeader from './components/CashFlowHeader'
import CashFlowStats from './components/CashFlowStats'

function CashFlowPage () {
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
  } = useCashFlow()

  // Filter State
  const [filter, setFilter] = React.useState({
    txt_search: '',
    flow_type: null,
    account_id: null,
    transaction_id: null,
    from_date: null,
    to_date: null
  })

  const handleOpenModal = () => {
    setState(prev => ({ ...prev, open: true, editingCashFlow: null }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingCashFlow: record
    }))
  }

  const handleFilter = () => {
    getList(filter)
  }

  const handleReset = () => {
    const defaultFilter = {
      txt_search: '',
      flow_type: null,
      account_id: null,
      transaction_id: null,
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
        <CashFlowHeader onAdd={handleOpenModal} />

        <CashFlowStats stats={state.stats} />

        <CashFlowFilter
          filter={filter}
          setFilter={setFilter}
          transaction={state.transaction || []}
          chart_of_accounts={state.chart_of_accounts || []}
          onFilter={handleFilter}
          onReset={handleReset}
          setPagination={setPagination}
        />

        <CashFlowTable
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

        <CashFlowModal
          open={state.open}
          setState={setState}
          transaction={state.transaction || []}
          chart_of_accounts={state.chart_of_accounts || []}
          editingCashFlow={state.editingCashFlow}
          onSuccess={() => {
            getList(filter)
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default CashFlowPage