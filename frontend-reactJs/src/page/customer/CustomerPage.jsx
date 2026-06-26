import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useCustomer } from './hooks/useCustomer'
import CustomerFilter from './components/CustomerFilter'
import CustomerTable from './components/CustomerTable'
import CustomerModal from './components/CustomerModal'
import CustomerHeader from './components/CustomerHeader'
import CustomerStats from './components/CustomerStats'

function CustomerPage () {
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
  } = useCustomer()

  const handleOpenModal = () => {
    setState(prev => ({
      ...prev,
      open: true,
      editingCustomer: null
    }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingCustomer: record
    }))
  }

  const handleReset = () => {
    const resetData = {
      page: 1,
      limit: 10,
      txt_search: '',
      status: null
    }
    setPagination(resetData)
    getList(resetData)
  }

  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>
        <CustomerHeader onAdd={handleOpenModal} />
        <CustomerStats stats={state.stats} />
        <CustomerFilter
          pagination={pagination}
          setPagination={setPagination}
          transactions={state.transactions}
          accounts={state.accounts}
          onFilter={() => getList(pagination)}
          onReset={handleReset}
        />

        <CustomerTable
          list={state.list}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          pagination={pagination}
          getList={getList} // ✅ បានបន្ថែម៖ បោះ getList ទៅឱ្យ Table ប្រើប្រាស់
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
          onBulkDelete={handleBulkDelete}
          onStatusChange={handleStatusChange}
          setPagination={setPagination}
          loading={state.loading}
        />

        <CustomerModal
          open={state.open}
          setState={setState}
          editingCustomer={state.editingCustomer}
          transactions={state.transactions}
          accounts={state.accounts}
          onSuccess={() => {
            getList(pagination)
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default CustomerPage