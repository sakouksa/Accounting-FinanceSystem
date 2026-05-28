import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useCurrency } from './hooks/useCurrency'

import CurrencyFilter from './components/CurrencyFilter'
import CurrencyTable from './components/CurrencyTable'
import CurrencyModal from './components/CurrencyModal'
import CurrencyHeader from './components/CurrencyHeader'
import CurrencyStats from './components/CurrencyStats'


function CurrencyPage () {
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
  } = useCurrency()
  const handleOpenModal = () => {
    setState(prev => ({ ...prev, open: true, editingCurrency: null }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingCurrency: record
    }))
  }

  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>
        <CurrencyHeader onAdd={handleOpenModal} />
        <CurrencyStats stats={state.stats} />

        <CurrencyFilter
          pagination={pagination}
          setPagination={setPagination}
          onFilter={() => getList()}
          onReset={() => {
            resetPagination()
            getList({ page: 1, limit: 10, txt_search: '', status: null })
          }}
        />
<CurrencyTable
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
        <CurrencyModal
          open={state.open}
          setState={setState}
          editingCurrency={state.editingCurrency}
          onSuccess={() => {
            getList()
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default CurrencyPage
