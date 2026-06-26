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

export const useTransactionType = () => {
  const [state, setState] = useState({
    list: [],
    stats: [],
    loading: false,
    open: false,
    editingTransactionType: null
  })

  const {
    pagination,
    setPagination
  } = usePaginationStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const handleError = res => {
    if (res?.error) {
      if (res.validationErrors || res.errors?.validation) {
        message.error(res.errors?.message || 'សូមពិនិត្យទិន្នន័យឡើងវិញ')
      } else {
        message.error(res.errors?.message || 'មានបញ្ហាកើតឡើង')
      }
      return true
    }
    return false
  }

  // ១. បង្កើតអនុគមន៍ getList ដើម្បីទាញយកទិន្នន័យ (ជំនួសអោយ onFinish ចាស់ដែលខុស)
  const getList = async (searchParams = null) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))
    try {
      // បើសិនជាមានការហៅពី handleReset វានឹងយកតាម searchParams បើអត់ទេយកតាម pagination store
      const currentParams = searchParams || {
        page: pagination.page,
        limit: pagination.limit,
        txt_search: pagination.txt_search,
        is_active: pagination.is_active
      }

      // ហៅទៅកាន់ API របស់ transaction-types
      const res = await request('transaction-types', 'get', currentParams)

      if (res && !res.error) {
        setState(prev => ({
          ...prev,
          list: res.list || [] // ត្រូវប្រាកដថា backend បោះមកឈ្មោះ list ឬ data
        }))

        // កំណត់ចំនួនទិន្នន័យសរុប (total) ចូលទៅក្នុង pagination store
        if (res.total !== undefined) {
          setPagination({
            total: res.total
          })
        }
      } else {
        handleError(res)
      }
    } catch (err) {
      console.error(err)
      message.error('មិនអាចទាញយកទិន្នន័យពី Server បានទេ!')
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

  const getStats = async () => {
    const res = await request('transaction-types/stats', 'get')
    if (res && !res.error) {
      setState(prev => ({
        ...prev,
        stats: res.stats || []
      }))
    }
  }

  // HANDLERS
  const handleStatusChange = async (id, is_active) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))
    const res = await request(`transaction-types/${id}/status`, 'patch', {
      is_active: is_active ? 1 : 0
    })

    if (!handleError(res)) {
      message.success(res.message || 'ប្តូរស្ថានភាពជោគជ័យ')
      await Promise.all([getList(), getStats()])
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
      content: 'តើអ្នកពិតជាចង់លុបប្រភេទប្រតិបត្តិការនេះមែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request(`transaction-types/${record.id}`, 'delete')
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
      content: `តើអ្នកពិតជាចង់លុប ${selectedRowKeys.length} ទិន្នន័យដែលបានជ្រើសរើសមែនទេ?`,
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('transaction-types/bulk-delete', 'post', {
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
      content: 'តើអ្នកពិតជាចង់លុបប្រភេទប្រតិបត្តិការទាំងអស់មែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('transaction-types/delete-all', 'post')
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