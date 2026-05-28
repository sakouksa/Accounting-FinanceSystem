import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useBranches } from './hooks/useBranches'

import BranchStats from './components/BranchStats'
import BranchFilter from './components/BranchFilter'
import BranchTable from './components/BranchTable'
import BranchModal from './components/BranchModal'
import BranchHeader from './components/BranchHeader'
function BranchesPage () {
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
    handleStatusChange
  } = useBranches()

  const handleOpenModal = () => {
    setState(prev => ({ ...prev, open: true, editingBranch: null }))
  }

  const handleEdit = (record) => {
    setState(prev => ({
      ...prev,
      open: true,
      editingBranch: record
    }))
  }


  return (
    <MainPage loading={state.loading}>
      <div className='space-y-6'>
      <BranchHeader onAdd={handleOpenModal} />
        <BranchStats stats={state.stats} />

        <BranchFilter
          pagination={pagination}
          setPagination={setPagination}
          onFilter={() => getList()}
          onReset={() => {
            resetPagination()
            getList({ page: 1, limit: 10, txt_search: '', status: null })
          }}
        />

        <BranchTable
          list={state.list}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          pagination={pagination}
          setPagination={setPagination}
          onEdit={handleEdit}
          onDelete={() => {}}
          onStatusChange={handleStatusChange}
        />

        <BranchModal
          open={state.open}
          setState={setState}
          editingBranch={state.editingBranch}
          onSuccess={() => {
            getList()
            getStats()
          }}
        />
      </div>
    </MainPage>
  )
}

export default BranchesPage
