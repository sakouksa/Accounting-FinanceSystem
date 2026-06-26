import React from 'react'
import MainPage from '../../components/layout/MainPage'
import { useBudget } from './hooks/useBudget'

import BudgetFilter from './components/BudgetFilter'
import BudgetTable from './components/BudgetTable'
import BudgetModal from './components/BudgetModal'
import BudgetHeader from './components/BudgetHeader'
import BudgetStats from './components/BudgetStats'

function BudgetPage () {
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
    handleDeleteAll,
    accounts,
    branches
  } = useBudget()

  const [filter, setFilter] = React.useState({
    txt_search: '',
    status: null,
    account_id: null,
    branch_id: null,
    from_date: null,
    to_date: null
  })

  const handleFilter = () => getList(filter)

  const handleReset = () => {
    const defaultFilter = {
      txt_search: '',
      status: null,
      account_id: null,
      branch_id: null,
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
        <BudgetHeader
          onAdd={() =>
            setState(prev => ({ ...prev, open: true, editingBudget: null }))
          }
        />

        <BudgetStats stats={state.stats} />

        <BudgetFilter
          filter={filter}
          setFilter={setFilter}
          onFilter={handleFilter}
          onReset={handleReset}
          accounts={accounts}
          branches={branches}
        />

        <BudgetTable
          list={state.list}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          pagination={pagination}
          setPagination={setPagination}
          onStatusChange={handleStatusChange}
          getList={getList}
          onEdit={record =>
            setState(prev => ({ ...prev, open: true, editingBudget: record }))
          }
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          onDeleteAll={handleDeleteAll}
          accounts={accounts}
          branches={branches}
        />

        <BudgetModal
          open={state.open}
          editingBudget={state.editingBudget}
          onSuccess={() => {
            getList(filter)
            getStats()
          }}
          onClose={() => setState(prev => ({ ...prev, open: false }))}
          accounts={accounts}
          branches={branches}
        />
      </div>
    </MainPage>
  )
}

export default BudgetPage
