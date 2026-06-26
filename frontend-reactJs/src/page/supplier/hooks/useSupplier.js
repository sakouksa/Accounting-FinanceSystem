import { useState, useEffect } from 'react'
import { message, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { request } from '../../../util/request'
import { usePaginationStore } from '../../../store/usePaginationStore'
import React from 'react'

export const useSupplier = () => {
  const [state, setState] = useState({
    list: [],
    stats: [],
    loading: false,
    open: false,
    editingCustomer: null
  })

  const { pagination, setPagination, resetPagination } = usePaginationStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  // LIST
  const getList = async (custom = pagination) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))

    let query = `?page=${custom.page || 1}&limit=${custom.limit || 10}`

    if (custom.txt_search) {
      query += `&txt_search=${encodeURIComponent(custom.txt_search)}`
    }
    if (custom.status) {
      query += `&status=${custom.status}`
    }

    const res = await request(`suppliers${query}`, 'get')

    if (res && !res.error) {
      setState(prev => ({
        ...prev,
        list: res.list || [],
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

  // STATS
  const getStats = async () => {
    const res = await request('suppliers/stats', 'get')
    if (res && !res.error) {
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

    const res = await request(`suppliers/${id}/status`, 'patch', {
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

  // DELETE
  const handleDelete = record => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុប',
      icon: React.createElement(ExclamationCircleFilled, {
        style: {
          color: '#ff4d4f'
        }
      }),
      content: 'តើអ្នកពិតជាចង់លុបអតិថិជននេះមែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request(`suppliers/${record.id}`, 'delete')
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

  // BULK DELETE
  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: 'បញ្ជាក់ការលុបជាច្រើន',
      icon: React.createElement(ExclamationCircleFilled, {
        style: {
          color: '#ff4d4f'
        }
      }),
      content: `លុប ${selectedRowKeys.length} អតិថិជន?`,
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('suppliers/bulk-delete', 'post', {
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

  // DELETE ALL
  const handleDeleteAll = () => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុបទាំងអស់',
      icon: React.createElement(ExclamationCircleFilled, {
        style: {
          color: '#ff4d4f'
        }
      }),
      content: 'តើអ្នកពិតជាចង់លុបអតិថិជនទាំងអស់មែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('suppliers/delete-all', 'post')

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
    resetPagination,
    getList,
    getStats,
    handleStatusChange,
    handleDelete,
    handleBulkDelete,
    handleDeleteAll
  }
}
