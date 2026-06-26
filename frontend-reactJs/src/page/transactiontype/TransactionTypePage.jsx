import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useTransactionType } from './hooks/useTransactionType'
import TransactionTypeFilter from './components/TransactionTypeFilter'
import TransactionTypeTable from './components/TransactionTypeTable'
import TransactionTypeModal from './components/TransactionTypeModal'
import TransactionTypeHeader from './components/TransactionTypeHeader'
import TransactionTypeStats from './components/TransactionTypeStats'

function TransactionTypePage () {
  const {
    state,
    setState,
    selectedRowKeys,
    setSelectedRowKeys,
    pagination,
    setPagination,
    getList,
    getStats,
    handleStatusChange,
    handleDelete,
    handleBulkDelete,
    handleDeleteAll
  } = useTransactionType()

  const handleOpenModal = () => {
    setState(prev => ({ ...prev, open: true, editingTransactionType: null }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingTransactionType: record
    }))
  }
  const handleReset = () => {
    const resetData = {
      page: 1,
      limit: 10,
      txt_search: '',
      is_active: ''
    }

    setPagination(resetData)
    getList(resetData)
    getStats()
  }

  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>
        <TransactionTypeHeader onAdd={handleOpenModal} />
        <TransactionTypeStats stats={state.stats} />
        <TransactionTypeFilter
          pagination={pagination}
          setPagination={setPagination}
          onFilter={() => getList()}
          onReset={handleReset}
        />

        <TransactionTypeTable
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
          loading={state.loading}
        />

        <TransactionTypeModal
          open={state.open}
          setState={setState}
          editingTransactionType={state.editingTransactionType}
          onSuccess={() => {
            getList()
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default TransactionTypePage
