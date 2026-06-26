import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useSupplier } from "./hooks/useSupplier";
import SupplierFilter from './components/SupplierFilter'
import SupplierTable from './components/SupplierTable'
import SupplierModal from './components/SupplierModal'
import SupplierHeader from './components/SupplierHeader'
import SupplierStats from './components/SupplierStats'

function SupplierPage () {
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
    handleDelete,
    handleBulkDelete,
    handleDeleteAll,
    handleStatusChange
  } = useSupplier()
  const handleOpenModal = () => {
    setState(prev => ({
      ...prev,
      open: true,
      editingSupplier: null
    }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingSupplier: record
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
        <SupplierHeader onAdd={handleOpenModal} />
        <SupplierStats stats={state.stats} />
        <SupplierFilter
          pagination={pagination}
          setPagination={setPagination}
          transactions={state.transactions}
          accounts={state.accounts}
          onFilter={() => getList()}
          onReset={handleReset}
        />
<SupplierTable
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

        <SupplierModal
          open={state.open}
          setState={setState}
          editingSupplier={state.editingSupplier}
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

export default SupplierPage
