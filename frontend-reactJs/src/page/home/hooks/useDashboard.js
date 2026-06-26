import {
    useEffect,
    useState
} from 'react'
import {
    request
} from '../../../util/request' // ធានាថា path នេះត្រឹមត្រូវ

export const useDashboard = () => {
    const [state, setState] = useState({
        stats: {
            totalRevenue: 0,
            activeUsers: 0,
            totalTransactions: 0, // កែពី totalOrders ទៅជា totalTransactions ឱ្យត្រូវនឹង Backend
            pageViews: 0,
            receivable: 0,
            payable: 0,
            arPercent: 0,
            apPercent: 0,
            revenuePercent: "0.0",
            trxPercent: "0.0",
            isRevenueUp: true,
            isTrxUp: true
        },
        overviewChart: {
            labels: [],
            data: []
        },
        trafficSources: [0, 0, 0, 0],
        recentTransactions: [], // កែពី recentOrders ទៅជា recentTransactions ឱ្យត្រូវនឹងតារាង UI
        recentActivities: [],
        loading: false
    })

    const [filters, setFilters] = useState({
        branch_id: null,
        start_date: null,
        end_date: null
    })

    const buildQuery = (currentFilters) => {
        let query = ''
        const params = []

        Object.entries(currentFilters).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                params.push(`${key}=${encodeURIComponent(value)}`)
            }
        })

        if (params.length > 0) {
            query = `?${params.join('&')}`
        }

        return query
    }

    const getDashboardData = async (customFilters = filters) => {
        setState(prev => ({
            ...prev,
            loading: true
        }))

        const query = buildQuery(customFilters)

        try {
            // ហៅទៅកាន់ API តាមរយៈមុខងារ request របស់អ្នក
            const res = await request(`dashboard${query}`, 'get')

            // ឆែកលក្ខខណ្ឌ Error ឱ្យត្រូវតាមទម្រង់ request.js របស់អ្នក
            if (!res || res.error) {
                console.error("Dashboard Fetch Error:", res?.errors?.message || "Unknown error");
                setState(prev => ({
                    ...prev,
                    loading: false
                }))
                return
            }

            /**
             * ត្រួតពិនិត្យស្រទាប់ទិន្នន័យ (Data Layer Check):
             * ប្រសិនបើ request helper របស់អ្នកផ្ញើមកតែ payload ខាងក្នុង: ប្រើ res.data
             * ប្រសិនបើវាផ្ញើមកទាំងស្រុងពី Axios: ប្រើ res.data.data
             */
            const responseData = res.data?.data ? res.data.data : (res.data || res);

            setState(prev => ({
                ...prev,
                stats: responseData.stats || prev.stats,
                overviewChart: responseData.overviewChart || prev.overviewChart,
                trafficSources: responseData.trafficSources || prev.trafficSources,
                recentTransactions: responseData.recentTransactions || [], // ម៉ាសចូល key ត្រឹមត្រូវ
                recentActivities: responseData.recentActivities || [],
                loading: false
            }))
        } catch (err) {
            console.error("Dashboard Catch Error:", err);
            setState(prev => ({
                ...prev,
                loading: false
            }))
        }
    }

    const resetFilters = () => {
        const defaultFilters = {
            branch_id: null,
            start_date: null,
            end_date: null
        }
        setFilters(defaultFilters)
        getDashboardData(defaultFilters)
    }

    useEffect(() => {
        getDashboardData(filters)
    }, [])

    return {
        state,
        filters,
        setFilters,
        getDashboardData,
        resetFilters
    }
}