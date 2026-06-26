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

  const [filters, setFilters] = useState({
    txt_search: '',
    action_type: null,
    module: null,
    table_name: null,
    user_id: null,
    start_date: null,
    end_date: null
  })

  const buildQuery = (filters, pagination) => {
    let query = `?page=${pagination.page || 1}&per_page=${pagination.limit || 10}`

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        query += `&${key}=${encodeURIComponent(value)}`
      }
    })

    return query
  }

  const getList = async (
    customFilters = filters,
    customPagination = pagination
  ) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))

    const query = buildQuery(customFilters, customPagination)

    const res = await request(`audit-logs${query}`, 'get')

    // handle request() error format
    if (res?.error) {
      setState(prev => ({
        ...prev,
        loading: false
      }))
      return
    }

    setState(prev => ({
      ...prev,
      list: res?.list?.data || [],
      loading: false
    }))

    setPagination({
      total: res?.list?.total || 0
    })
  }

  const getStats = async () => {
    const res = await request('audit-logs/stats', 'get')

    if (res?.error) return

    setState(prev => ({
      ...prev,
      stats: res?.stats || []
    }))
  }

  const resetFilters = () => {
    const defaultFilters = {
      txt_search: '',
      action_type: null,
      module: null,
      table_name: null,
      user_id: null,
      start_date: null,
      end_date: null
    }

    setFilters(defaultFilters)
    resetPagination()

    getList(defaultFilters, {
      page: 1,
      limit: 10
    })
  }

  useEffect(() => {
    getList(filters, pagination)
  }, [pagination.page, pagination.limit])

  return {
    state,
    filters,
    setFilters,
    pagination,
    setPagination,
    resetPagination,
    getList,
    getStats,
    resetFilters
  }
}