import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useAccountsPayable } from './hooks/useAccountsPayable'

import AccountsPayableFilter from './components/AccountsPayableFilter'
import AccountsPayableTable from './components/AccountsPayableTable'
import AccountsPayableModal from './components/AccountsPayableModal'
import AccountsPayableHeader from './components/AccountsPayableHeader'
import AccountsPayableStats from './components/AccountsPayableStats'

function AccountsPayablePage () {
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
  } = useAccountsPayable()

  // Filter State
  const [filter, setFilter] = React.useState({
    txt_search: '',
    status: null,
    supplier_id: null,
    from_date: null,
    to_date: null
  })

  const handleOpenModal = () => {
    setState(prev => ({ ...prev, open: true, editingAccountsPayable: null }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingAccountsPayable: record
    }))
  }

  const handleFilter = () => {
    getList(filter)
  }

  const handleReset = () => {
    const defaultFilter = {
      txt_search: '',
      status: null,
      supplier_id: null,
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
        <AccountsPayableHeader onAdd={handleOpenModal} />

        <AccountsPayableStats stats={state.stats} />

        <AccountsPayableFilter
          filter={filter}
          setFilter={setFilter}
          suppliers={state.suppliers || []}
          onFilter={handleFilter}
          onReset={handleReset}
          setPagination={setPagination}
        />

        <AccountsPayableTable
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

        <AccountsPayableModal
          open={state.open}
          setState={setState}
          suppliers={state.suppliers || []}
          editingAccountsPayable={state.editingAccountsPayable}
          onSuccess={() => {
            getList(filter) // Refresh with current filter
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default AccountsPayablePage
