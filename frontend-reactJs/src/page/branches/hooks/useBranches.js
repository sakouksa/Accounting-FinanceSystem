import { useState, useEffect } from 'react'
import { message } from 'antd'
import { request } from '../../../util/request'
import { usePaginationStore } from '../../../store/usePaginationStore'

export const useBranches = () => {
  const [state, setState] = useState({
    list: [],
    stats: [],
    permissionsList: [],
    loading: false,
    open: false,
    selectedRoleId: null
  })

  const { pagination, setPagination, resetPagination } = usePaginationStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const getStats = async () => {
    const res = await request('branches/stats', 'get')
    setState(prev => ({
      ...prev,
      stats: res?.stats || []
    }))
  }

  const getList = async (filter = pagination) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))

    let query = `?page=${filter.page}&limit=${filter.limit}`
    if (filter.txt_search) query += `&txt_search=${filter.txt_search}`
    if (filter.status) query += `&status=${filter.status}`

    const res = await request(`branches${query}`, 'get')

    if (res && !res.errors) {
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
      message.error(res?.message || 'ទាញទិន្នន័យបរាជ័យ')
    }
  }
  // ================== CHANGE STATUS ==================
  const handleStatusChange = async (id, status) => {
      setState(prev => ({
          ...prev,
          loading: true
      }))

      const res = await request(`branches/${id}/status`, 'patch', {
          status
      })

      if (res && !res.error) {
          message.success(res.message || 'ប្តូរស្ថានភាពជោគជ័យ')
          await Promise.all([getList(), getStats()])
      } else {
          message.error(res?.message || 'ប្តូរស្ថានភាពបរាជ័យ')
          await getList() // Refresh ដើម្បី revert UI
      }

      setState(prev => ({
          ...prev,
          loading: false
      }))
  }
  useEffect(() => {
    getList()
    getStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    state,
    setState,
    getList,
    getStats,
    selectedRowKeys,
    setSelectedRowKeys,
    pagination,
    setPagination,
    resetPagination,
    handleStatusChange
  }
}
