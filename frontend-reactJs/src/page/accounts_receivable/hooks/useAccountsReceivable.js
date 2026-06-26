import { useState, useEffect } from 'react'
import { message, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { request } from '../../../util/request'
import { usePaginationStore } from '../../../store/usePaginationStore'
import React from 'react'
import { dateServer } from '../../../util/helper'
export const useAccountsReceivable = () => {
  const [state, setState] = useState({
    list: [],
    stats: {},
    loading: false,
    open: false,
    editingAccountsReceivable: null,
    customers: [],
  })

  const { pagination, setPagination, resetPagination } = usePaginationStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  // CHANGE DATE RANGE
  const handleDateChange = (dates) => {
    setPagination({
      ...pagination,
      from_date: dates ? dateServer(dates[0]) : null,
      to_date: dates ? dateServer(dates[1]) : null
    })
  }
  // LIST
  const getList = async (custom = pagination) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))

    const currentPage = custom.page || 1
    const currentLimit = custom.limit || 10
    let query = `?page=${currentPage}&limit=${currentLimit}`

    if (custom.txt_search) {
      query += `&txt_search=${encodeURIComponent(custom.txt_search.trim())}`
    }
    if (custom.status) {
      query += `&status=${custom.status}`
    }
    if (custom.customer_id) query += `&customer_id=${custom.customer_id}`;
    if (custom.from_date) query += `&from_date=${custom.from_date}`;
    if (custom.to_date) query += `&to_date=${custom.to_date}`;

    const res = await request(`accounts-receivable${query}`, 'get')

    if (res && !res.error) {
      setState(prev => ({
        ...prev,
        list: res.list || [],
        customers: res.customers || prev.customers,
        loading: false
      }))

      setPagination({
        ...custom,
        page: currentPage,
        limit: currentLimit,
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
  const getStats = async () => {
    const res = await request('accounts-receivable/stats', 'get')
    if (res && !res.error) {
      setState(prev => ({
        ...prev,
        stats: res || {}
      }))
    }
  }

  // CHANGE STATUS
  const handleStatusChange = async (id, status) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))

    const res = await request(`accounts-receivable/${id}/status`, 'patch', {
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

  // DELETE SINGLE ROW
  const handleDelete = record => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុប',
      icon: React.createElement(ExclamationCircleFilled, {
        style: {
          color: '#ff4d4f'
        }
      }),
      content: 'តើអ្នកពិតជាចង់លុបវិក្កយបត្រនេះមែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request(`accounts-receivable/${record.id}`, 'delete')
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
      content: `តើអ្នកពិតជាចង់លុបទិន្នន័យចំនួន ${selectedRowKeys.length} នេះមែនទេ?`,
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('accounts-receivable/bulk-delete', 'post', {
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

  // DELETE ALL ROWS
  const handleDeleteAll = () => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុបទាំងអស់',
      icon: React.createElement(ExclamationCircleFilled, {
        style: {
          color: '#ff4d4f'
        }
      }),
      content:
        'តើអ្នកពិតជាចង់លុបទិន្នន័យទាំងអស់មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានឡើយ។',
      okText: 'លុបទាំងអស់',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('accounts-receivable/delete-all', 'post')

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

  // EFFECT RUN ONCE & ON PAGINATION CHANGE
  useEffect(() => {
    getList(pagination)
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
    handleDeleteAll,
    handleDateChange
  }
}
