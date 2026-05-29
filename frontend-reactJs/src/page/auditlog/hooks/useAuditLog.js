import {
  useEffect,
  useState
} from 'react'
import {
  request
} from '../../../util/request'
import {
  usePaginationStore
} from '../../../store/usePaginationStore'

export const useAuditLog = () => {
  const [state, setState] = useState({
    list: [],
    stats: [],
    loading: false
  })

  const {
    pagination,
    setPagination,
    resetPagination
  } = usePaginationStore()

  // LIST
  const getList = async (filter = pagination) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))

    let query = `?page=${filter.page || 1}&per_page=${filter.limit || 10}`

    if (filter.txt_search)
      query += `&txt_search=${filter.txt_search}`

    if (filter.action_type)
      query += `&action_type=${filter.action_type}`

    if (filter.module)
      query += `&module=${filter.module}`

    if (filter.table_name)
      query += `&table_name=${filter.table_name}`

    if (filter.user_id)
      query += `&user_id=${filter.user_id}`

    const res = await request(`audit-logs${query}`, 'get')

    setState(prev => ({
      ...prev,
      list: res?.list?.data || [],
      loading: false
    }))

    setPagination({
      total: res?.list?.total || 0
    })
  }

  // STATS
  const getStats = async () => {
    const res = await request('audit-logs/stats', 'get')

    setState(prev => ({
      ...prev,
      stats: res?.stats || []
    }))
  }

  useEffect(() => {
    getList()
    getStats()
  }, [])

  return {
    state,
    setState,
    pagination,
    setPagination,
    resetPagination,
    getList,
    getStats
  }
}