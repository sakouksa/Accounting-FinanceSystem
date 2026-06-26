import React from 'react'
import { useState, useEffect } from 'react'
import { message, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { request } from '../../../util/request'
import { usePaginationStore } from '../../../store/usePaginationStore'

export const useTransactionDetail = () => {
  const [state, setState] = useState({
    list: [],
    stats: [],
    transactions: [],
    accounts: [],
    loading: false,
    open: false,
    editingTransactionDetail: null
  })

  const { pagination, setPagination, resetPagination } = usePaginationStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  // GET LIST
  const getList = async (custom = pagination) => {
    try {
      setState(prev => ({
        ...prev,
        loading: true
      }))

      let query = `?page=${custom.page || 1}&limit=${custom.limit || 10}`

      if (custom.txt_search?.trim()) {
        query += `&txt_search=${encodeURIComponent(custom.txt_search)}`
      }

      if (custom.transaction_id) {
        query += `&transaction_id=${custom.transaction_id}`
      }

      if (custom.account_id) {
        query += `&account_id=${custom.account_id}`
      }

      const res = await request(`transaction-details${query}`, 'get')

      if (res?.error) {
        message.error(res.errors?.message || 'ទាញទិន្នន័យបរាជ័យ')
        return
      }

      setState(prev => ({
        ...prev,
        list: res.list || [],
        transactions: res.transaction || [],
        accounts: res.account || []
      }))

      setPagination({
        total: res.total || 0
      })
    } finally {
      setState(prev => ({
        ...prev,
        loading: false
      }))
    }
  }

  useEffect(() => {
    getList()
    getStats()
  }, [pagination.page, pagination.limit])
  // GET STATS
  const getStats = async () => {
    const res = await request('transaction-details/stats', 'get')
    if (res && !res.error) {
      setState(prev => ({
        ...prev,
        stats: res?.stats || []
      }))
    }
  }

  const handleDelete = record => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុប',
      icon: React.createElement(ExclamationCircleFilled, {
        style: {
          color: '#ff4d4f'
        }
      }),
      content: 'តើអ្នកពិតជាចង់លុបរូបិយប័ណ្ណនេះមែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request(`transaction-details/${record.id}`, 'delete')
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
      content: `តើអ្នកពិតជាចង់លុប ${selectedRowKeys.length} រូបិយប័ណ្ណមែនទេ?`,
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('transaction-details/bulk-delete', 'post', {
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
      content: 'តើអ្នកពិតជាចង់លុបទិន្នន័យទាំងអស់មែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('transaction-details/delete-all', 'post')
        if (res && !res.error) {
          message.success(res.message || 'លុបទាំងអស់ជោគជ័យ!')
          setSelectedRowKeys([])
          getList()
          getStats()
        } else {
          message.error(res?.errors?.message || 'លុបទាំងអស់មិនបាន!')
        }
      }
    })
  }

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
    handleDelete,
    handleBulkDelete,
    handleDeleteAll
  }
}
