import { useState, useEffect } from 'react'
import { message, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { request } from '../../../util/request'
import { usePaginationStore } from '../../../store/usePaginationStore'
import React from 'react'

export const useCustomer = () => {
  const [state, setState] = useState({
    list: [],
    stats: [],
    loading: false,
    open: false,
    editingCustomer: null
  })

  const { pagination, setPagination } = usePaginationStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const handleError = (res, defaultMsg = 'មានបញ្ហាកើតឡើង') => {
    message.error(res?.errors?.message || defaultMsg)
  }

  // LIST
  const getList = async (custom = pagination) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))

    let query = `?page=${custom.page || 1}&limit=${custom.limit || 10}`
    if (custom.txt_search)
      query += `&txt_search=${encodeURIComponent(custom.txt_search)}`
    if (custom.status) query += `&status=${custom.status}`

    const res = await request(`customers${query}`, 'get')

    if (!res.error) {
      setState(prev => ({
        ...prev,
        list: res.list || [],
        loading: false
      }))
      setPagination({
        ...custom,
        total: res.total || 0
      })
    } else {
      setState(prev => ({
        ...prev,
        loading: false
      }))
      handleError(res, 'ទាញទិន្នន័យបរាជ័យ')
    }
  }

  // STATS
  const getStats = async () => {
    const res = await request('customers/stats', 'get')
    if (!res.error) {
      setState(prev => ({
        ...prev,
        stats: res.stats || []
      }))
    }
  }

  // STATUS CHANGE
  const handleStatusChange = async (id, status) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))
    const res = await request(`customers/${id}/status`, 'patch', {
      status
    })

    if (!res.error) {
      message.success(res.message || 'ប្តូរស្ថានភាពជោគជ័យ')
      await Promise.all([getList(), getStats()])
    } else {
      handleError(res, 'ប្តូរស្ថានភាពបរាជ័យ')
      await getList() // Refresh list to revert UI if needed
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
      content: 'តើអ្នកពិតជាចង់លុបអថិជននេះមែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request(`customers/${record.id}`, 'delete')
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
      content: `តើអ្នកពិតជាចង់លុប ${selectedRowKeys.length} អថិជនមែនទេ?`,
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('customers/bulk-delete', 'post', {
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
      content: 'តើអ្នកពិតជាចង់លុបអថិជនទាំងអស់មែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('customers/delete-all', 'post')
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
    getList(pagination)
  }, [pagination.page, pagination.limit])

  return {
    state,
    setState,
    selectedRowKeys,
    setSelectedRowKeys,
    pagination,
    setPagination,
    getList,
    getStats,
    handleStatusChange,
    handleDelete,
    handleBulkDelete,
    handleDeleteAll
  }
}
