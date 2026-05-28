import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useAccountType } from './hooks/useAccountType'

import AccountTypeFilter from './components/AccountTypeFilter'
import AccountTypeTable from './components/AccountTypeTable'
import AccountTypeModal from './components/AccountTypeModal'
import AccountTypeHeader from './components/AccountTypeHeader'
import AccountTypeStats from './components/AccountTypeStats'

function AccountTypePage () {
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
    handleBulkDelete,
    handleDelete,
    handleDeleteAll
  } = useAccountType()
  const handleOpenModal = () => {
    setState(prev => ({ ...prev, open: true, editingAccountType: null }))
  }

  const handleEdit = record => {
    setState(prev => ({
      ...prev,
      open: true,
      editingAccountType: record
    }))
  }

  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>
        <AccountTypeHeader onAdd={handleOpenModal} />
        <AccountTypeStats stats={state.stats} />

        <AccountTypeFilter
          pagination={pagination}
          setPagination={setPagination}
          onFilter={() => getList()}
          onReset={() => {
            resetPagination()
            getList({ page: 1, limit: 10, txt_search: '', status: null })
          }}
        />
        <AccountTypeTable
          list={state.list}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          pagination={pagination}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
          onBulkDelete={handleBulkDelete}
        />
        <AccountTypeModal
          open={state.open}
          setState={setState}
          editingAccountType={state.editingAccountType}
          onSuccess={() => {
            getList()
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default AccountTypePage
