import { useState, useEffect } from 'react'
import { message, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { request } from '../../../util/request'
import { usePaginationStore } from '../../../store/usePaginationStore'
import React from 'react'

export const useTransaction = () => {
  const [state, setState] = useState({
    list: [],
      stats: [],
      branches: [],
      transaction_types: [],
      loading: false,
      open: false,
      editingTransaction: null
  })

  const { pagination, setPagination, resetPagination } = usePaginationStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const getStats = async () => {
    const res = await request('transactions/stats', 'get')
    if (res && !res.error) {
      setState(prev => ({
        ...prev,
        stats: res?.stats || []
      }))
    }
  }

  const getList = async (param_filter = {}) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))

    let query = '?page=1'

    if (param_filter.txt_search)
      query += `&txt_search=${encodeURIComponent(param_filter.txt_search)}`

    if (param_filter.status) query += `&status=${param_filter.status}`

    if (param_filter.transaction_type_id)
      query += `&transaction_type_id=${param_filter.transaction_type_id}`

    if (param_filter.branch_id) query += `&branch_id=${param_filter.branch_id}`

    if (param_filter.currency_code)
      query += `&currency_code=${param_filter.currency_code}`
    const res = await request(`transactions${query}`, 'get')

    if (res && !res.error) {
      setState(prev => ({
        ...prev,
        list: res.list || [],
        branches: res.branches || [],
        transaction_types: res.transaction_types || [],
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
    const res = await request(`transactions/${id}/status`, 'patch', {
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
      content: 'តើអ្នកពិតជាចង់លុបគណនីនេះមែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request(`transactions/${record.id}`, 'delete')
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
        const res = await request('transactions/bulk-delete', 'post', {
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
      content: 'តើអ្នកពិតជាចង់លុបគណនីទាំងអស់មែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('transactions/delete-all', 'post')
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
    getList()
    getStats()
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
    handleDeleteAll
  }
}
