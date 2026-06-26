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

export const useAccountType = () => {
  const [state, setState] = useState({
    list: [],
    stats: [],
    loading: false,
    open: false,
    editingAccountType: null
  })

  const {
    pagination,
    setPagination,
    resetPagination
  } = usePaginationStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const getStats = async () => {
    const res = await request('account-types/stats', 'get')
    if (res && !res.error) {
      setState(prev => ({
        ...prev,
        stats: res?.stats || []
      }))
    }
  }

  const getList = async (custom = pagination) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))

    let query = `?page=${custom.page || 1}&limit=${custom.limit || 10}`

    if (custom.txt_search?.trim()) {
      query += `&txt_search=${encodeURIComponent(custom.txt_search)}`
    }

    const res = await request(`account-types${query}`, 'get')

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

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'បញ្ជាក់ការលុប',
      icon: React.createElement(ExclamationCircleFilled, {
        style: {
          color: '#ff4d4f'
        }
      }),
      content: 'តើអ្នកពិតជាចង់លុបប្រភេទគណនីនេះមែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request(`account-types/${record.id}`, 'delete')
        if (res && !res.error) {
          message.success(res.message || 'លុបជោគជ័យ!')
          getList()
          getStats()
        } else {
          // កែសម្រួល៖ ទាញយកសារពី res.errors.message
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
      content: `តើអ្នកពិតជាចង់លុប ${selectedRowKeys.length} ប្រភេទគណនីមែនទេ?`,
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('account-types/bulk-delete', 'post', {
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
      content: 'តើអ្នកពិតជាចង់លុបប្រភេទគណនីទាំងអស់មែនទេ?',
      okText: 'លុបចេញ',
      okType: 'danger',
      cancelText: 'បោះបង់',
      centered: true,
      onOk: async () => {
        const res = await request('account-types/delete-all', 'post')
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
    handleBulkDelete,
    handleDelete,
    handleDeleteAll
  }
}