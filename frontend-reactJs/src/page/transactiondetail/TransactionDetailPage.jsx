import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useTransactionDetail } from './hooks/useTransactionDetail'
import TransactionDetailFilter from './components/TransactionDetailFilter'
import TransactionDetailTable from './components/TransactionDetailTable'
import TransactionDetailModal from './components/TransactionDetailModal'
import TransactionDetailHeader from './components/TransactionDetailHeader'
import TransactionDetailStats from './components/TransactionDetailStats'

function TransactionDetailPage () {
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
    handleDelete,
    handleBulkDelete,
    handleDeleteAll
  } = useTransactionDetail()
  const handleOpenModal = () => {
    setState(prev => ({
      ...prev,
      open: true,
      editingTransactionDetail: null
    }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingTransactionDetail: record
    }))
  }
  const handleReset = () => {
    const resetData = {
      page: 1,
      limit: 10,
      txt_search: '',
      transaction_id: undefined,
      account_id: undefined
    }

    setPagination(resetData)
    getList(resetData)
  }

  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>
        <TransactionDetailHeader onAdd={handleOpenModal} />
        <TransactionDetailStats stats={state.stats} />
        <TransactionDetailFilter
          pagination={pagination}
          setPagination={setPagination}
          transactions={state.transactions}
          accounts={state.accounts}
          onFilter={() => getList()}
          onReset={handleReset}
        />

        <TransactionDetailTable
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

        <TransactionDetailModal
          open={state.open}
          setState={setState}
          editingTransactionDetail={state.editingTransactionDetail}
          transactions={state.transactions}
          accounts={state.accounts}
          onSuccess={() => {
            getList()
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default TransactionDetailPage
