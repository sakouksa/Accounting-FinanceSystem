import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useAccountsReceivable } from './hooks/useAccountsReceivable'
import AccountsReceivableFilter from './components/AccountsReceivableFilter'
import AccountsReceivableTable from './components/AccountsReceivableTable'
import AccountsReceivableModal from './components/AccountsReceivableModal'
import AccountsReceivableHeader from './components/AccountsReceivableHeader'
import AccountsReceivableStats from './components/AccountsReceivableStats'

function AccountsReceivablePage () {
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
    handleStatusChange,
    handleDateChange
  } = useAccountsReceivable()
  const handleOpenModal = () => {
    setState(prev => ({
      ...prev,
      open: true,
      editingAccountsReceivable: null
    }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingAccountsReceivable: record
    }))
  }
  const handleReset = () => {
    const resetData = {
      page: 1,
      limit: 10,
      txt_search: '',
      status: undefined,
      from_date: null,
      to_date: null
    }

    setPagination(resetData)
    getList(resetData)
  }

  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>
        <AccountsReceivableHeader onAdd={handleOpenModal} />
        <AccountsReceivableStats stats={state.stats} />
        <AccountsReceivableFilter
          pagination={pagination}
          setPagination={setPagination}
          transactions={state.transactions}
          customers={state.customers}
          handleDateChange={handleDateChange}
          onFilter={() => getList(pagination)}
          onReset={handleReset}
        />
        <AccountsReceivableTable
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

        <AccountsReceivableModal
          open={state.open}
          setState={setState}
          editingAccountsReceivable={state.editingAccountsReceivable}
          transactions={state.transactions}
          accounts={state.accounts}
          customers={state.customers}
          onSuccess={() => {
            getList()
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default AccountsReceivablePage
