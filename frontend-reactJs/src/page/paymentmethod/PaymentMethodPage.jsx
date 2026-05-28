import React from 'react'
import MainPage from '../../components/layout/MainPage'

import PaymentMethodFilter from './components/PaymentMethodFilter'
import PaymentMethodTable from './components/PaymentMethodTable'
import PaymentMethodModal from './components/PaymentMethodModal'
import PaymentMethodHeader from './components/PaymentMethodHeader'
import PaymentMethodStats from './components/PaymentMethodStats'
import { usePaymentMethod } from './hooks/usePaymentMethod'

function PaymentMethodPage () {
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
  } = usePaymentMethod()
  const handleOpenModal = () => {
    setState(prev => ({ ...prev, open: true, editingPaymentMethod: null }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingPaymentMethod: record
    }))
  }

  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>
        <PaymentMethodHeader onAdd={handleOpenModal} />
        <PaymentMethodStats stats={state.stats} />

        <PaymentMethodFilter
          pagination={pagination}
          setPagination={setPagination}
          onFilter={() => getList()}
          onReset={() => {
            resetPagination()
            getList({ page: 1, limit: 10, txt_search: '', status: null })
          }}
        />
        <PaymentMethodTable
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
        <PaymentMethodModal
          open={state.open}
          setState={setState}
          editingPaymentMethod={state.editingPaymentMethod}
          onSuccess={() => {
            getList()
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default PaymentMethodPage
