import { useState, useEffect } from 'react'
import { message, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { request } from '../../../util/request'
import { usePaginationStore } from '../../../store/usePaginationStore'
import React from 'react'

export const useBudget = () => {
  const [state, setState] = useState({
    list: [],
    stats: {},
    loading: false,
    open: false,
    editingBudget: null,
    accounts: [],
    branches: []
  })

  const { pagination, setPagination, resetPagination } = usePaginationStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const getStats = async () => {
    const res = await request('budgets/stats', 'get')
    if (res && !res.error) {
      setState(prev => ({
        ...prev,
        stats: res.stats || {}
      }))
    }
  }
  const getList = async (custom = {}) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))

    const params = {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      ...custom
    }
    console.log("Params:", params);
    let query = `?page=${params.page}&limit=${params.limit}`
    if (params.txt_search)
      query += `&txt_search=${encodeURIComponent(params.txt_search)}`
    if (params.status) query += `&status=${params.status}`
    if (params.account_id) query += `&account_id=${params.account_id}`
    if (params.branch_id) query += `&branch_id=${params.branch_id}`
    if (params.from_date) query += `&from_date=${params.from_date}`
    if (params.to_date) query += `&to_date=${params.to_date}`
    const res = await request(`budgets${query}`, 'get')

    if (res && !res.error) {
      setState(prev => ({
        ...prev,
        list: res.list || [],
        accounts: res.accounts || [],
          branches: res.branches || [],
        loading: false
      }))
      setPagination({
        total: res.total || 0
      })
    } else {
      setState(prev => ({
        ...prev,
        loading: false
      }))
      message.error(res?.errors?.message || 'ទាញទិន្នន័យបរាជ័យ')
    }
  }
  const handleStatusChange = async (id, status) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))
    const res = await request(`budgets/${id}/status`, 'patch', {
      status
    })

    if (res && !res.error) {
      message.success(res.message || 'ប្តូរស្ថានភាពជោគជ័យ')
      await Promise.all([getList(), getStats()])
    } else {
      message.error(res?.errors?.message || 'បរាជ័យ')
      await getList()
    }
    setState(prev => ({
      ...prev,
      loading: false
    }))
  }

  const handleDelete = record => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុប',
      icon: React.createElement(ExclamationCircleFilled, {
        style: {
          color: '#ff4d4f'
        }
      }),
      content: 'តើអ្នកពិតជាចង់លុបមែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request(`budgets/${record.id}`, 'delete')
        if (res && !res.error) {
          message.success(res.message || 'លុបជោគជ័យ!')
          getList()
          getStats()
        } else {
          message.error(res?.errors?.message || 'លុបមិនបាន!')
        }
      }
    })
  }

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return
    Modal.confirm({
      title: 'បញ្ជាក់ការលុបជាច្រើន',
      icon: React.createElement(ExclamationCircleFilled, {
        style: {
          color: '#ff4d4f'
        }
      }),
      content: `តើអ្នកពិតជាចង់លុប ${selectedRowKeys.length} គណនីមែនទេ?`,
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('budgets/bulk-delete', 'post', {
          ids: selectedRowKeys
        })
        if (res && !res.error) {
          message.success(res.message || 'លុបជោគជ័យ!')
          setSelectedRowKeys([])
          getList()
          getStats()
        } else {
          message.error(res?.errors?.message || 'លុបមិនបាន!')
        }
      }
    })
  }

  const handleDeleteAll = () => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុបទាំងអស់',
      icon: React.createElement(ExclamationCircleFilled, {
        style: {
          color: '#ff4d4f'
        }
      }),
      content: 'តើអ្នកពិតជាចង់លុបទាំងអស់មែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('budgets/delete-all', 'post')
        if (res && !res.error) {
          message.success(res.message || 'លុបទាំងអស់ជោគជ័យ!')
          setSelectedRowKeys([])
          getList()
          getStats()
        } else {
          message.error(res?.errors?.message || 'លុបមិនបាន!')
        }
      }
    })
  }

  useEffect(() => {
    getStats()
  }, [])

  useEffect(() => {
    getList(pagination)
  }, [pagination.page, pagination.limit])

  return {
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
    accounts: state.accounts,
      branches: state.branches
  }
}
