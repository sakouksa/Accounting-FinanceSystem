import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { usePayment } from './hooks/usePayment'

import PaymentFilter from './components/PaymentFilter'
import PaymentTable from './components/PaymentTable'
import PaymentModal from './components/PaymentModal'
import PaymentHeader from './components/PaymentHeader'
import PaymentStats from './components/PaymentStats'

function PaymentPage () {
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
    handleDeleteAll,
  } = usePayment()

  // Filter State
  const [filter, setFilter] = React.useState({
    txt_search: '',
      status: null,
      payment_type: null,
      payment_method_id: null,
      payable_id: null,
      receivable_id: null,
      from_date: null,
      to_date: null
  })

  const handleOpenModal = () => {
    setState(prev => ({ ...prev, open: true, editingPayment: null }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingPayment: record
    }))
  }

  const handleFilter = () => {
    getList(filter)
  }

  const handleReset = () => {
    const defaultFilter = {
      txt_search: '',
      status: null,
      payment_type: null,
      payment_method_id: null,
      payable_id: null,
      receivable_id: null,
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
        <PaymentHeader onAdd={handleOpenModal} />

        <PaymentStats stats={state.stats} />

        <PaymentFilter
          filter={filter}
          setFilter={setFilter}
          transaction={state.transaction || []}
          accounts_payable={state.accounts_payable || []}
          accounts_receivable={state.accounts_receivable || []}
          payment_method={state.payment_method || []}
          onFilter={handleFilter}
          onReset={handleReset}
          setPagination={setPagination}
        />

        <PaymentTable
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
          getList={getList}
        />

        <PaymentModal
          open={state.open}
          setState={setState}
          transaction={state.transaction || []}
          accounts_payable={state.accounts_payable || []}
          accounts_receivable={state.accounts_receivable || []}
          payment_method={state.payment_method || []}
          editingPayment={state.editingPayment}
          onSuccess={() => {
            getList(filter) // Refresh with current filter
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default PaymentPage
