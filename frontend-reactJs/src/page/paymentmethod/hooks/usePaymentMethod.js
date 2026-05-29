import React from 'react'
import {
  useState,
  useEffect
} from 'react'
import {
  message,
  Modal
} from 'antd'
import {
  ExclamationCircleFilled
} from '@ant-design/icons'
import {
  request
} from '../../../util/request'
import {
  usePaginationStore
} from '../../../store/usePaginationStore'

export const usePaymentMethod = () => {
  const [state, setState] = useState({
    list: [],
    stats: [],
    loading: false,
    open: false,
    editingPaymentMethod: null
  })

  const {
    pagination,
    setPagination,
    resetPagination
  } = usePaginationStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const getStats = async () => {
    const res = await request('payment-methods/stats', 'get')
    if (res && !res.error) {
      setState(prev => ({
        ...prev,
        stats: res?.stats || []
      }))
    }
  }

  const getList = async (filter = pagination) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))

    let query = `?page=${filter.page || 1}&limit=${filter.limit || 10}`
    if (filter.txt_search)
      query += `&txt_search=${encodeURIComponent(filter.txt_search)}`
    if (filter.status) query += `&status=${filter.status}`

    const res = await request(`payment-methods${query}`, 'get')

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

  const handleStatusChange = async (id, status) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))

    const res = await request(`payment-methods/${id}/status`, 'patch', {
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

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុប',
      icon: React.createElement(ExclamationCircleFilled, {
        style: {
          color: '#ff4d4f'
        }
      }),
      content: 'តើអ្នកពិតជាចង់លុបវិធីសាស្ត្រទូទាត់នេះមែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,

      onOk: async () => {
        const res = await request(`payment-methods/${record.id}`, 'delete')
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
      content: `តើអ្នកពិតជាចង់លុប ${selectedRowKeys.length} វិធីសាស្ត្រទូទាត់មែនទេ?`,
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,

      onOk: async () => {
        const res = await request('payment-methods/bulk-delete', 'post', {
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
        const res = await request('payment-methods/delete-all', 'post')
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

  useEffect(() => {
    getList()
    getStats()
  }, [])

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