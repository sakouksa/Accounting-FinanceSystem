import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useTransaction } from './hooks/useTransaction'

import TransactionFilter from './components/TransactionFilter'
import TransactionTable from './components/TransactionTable'
import TransactionModal from './components/TransactionModal'
import TransactionHeader from './components/TransactionHeader'
import TransactionStats from './components/TransactionStats'

function TransactionPage() {
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
  } = useTransaction()

  // Filter State
  const [filter, setFilter] = React.useState({
    txt_search: '',
    status: null,
    transaction_type_id: null,
    branch_id: null,
    currency_code: null
  })

  // Open Create Modal
  const handleOpenModal = () => {
    setState(prev => ({
      ...prev,
      open: true,
      editingTransaction: null
    }))
  }

  // Open Edit Modal
  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingTransaction: record
    }))
  }

  // Filter
  const handleFilter = () => {
    getList(filter)
  }

  // Reset Filter
  const handleReset = () => {
    const defaultFilter = {
      txt_search: '',
      status: null,
      transaction_type_id: null,
      branch_id: null,
      currency_code: null
    }

    setFilter(defaultFilter)

    resetPagination()

    getList(defaultFilter)
  }

  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>
        <TransactionHeader onAdd={handleOpenModal} />

        <TransactionStats stats={state.stats} />

        <TransactionFilter
          filter={filter}
          setFilter={setFilter}
          onFilter={handleFilter}
          onReset={handleReset}
          transactionTypes={state.transaction_types || []}
          branches={state.branches || []}
          setPagination={setPagination}
        />

        <TransactionTable
          list={state.list}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          pagination={pagination}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
          onBulkDelete={handleBulkDelete}
          onStatusChange={handleStatusChange}
          setPagination={setPagination}
        />

        <TransactionModal
          open={state.open}
          setState={setState}
          editingTransaction={state.editingTransaction}
          onSuccess={() => {
            getList(filter)
            getStats()
            
          }}
        />
      </div>
    </MainPage>
  )
}

export default TransactionPage
