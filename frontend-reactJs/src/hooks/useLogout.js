import {
    request
} from '../util/request'
import {
    profileStore
} from '../store/profileStore'
import {
    useNavigate
} from 'react-router-dom'

export const useLogout = () => {
    const navigate = useNavigate()
    const logoutStore = profileStore(state => state.logout)

    const logout = async () => {
        try {
            await request('logout', 'post')
        } catch (err) {
            console.log(err)
        }

        logoutStore()
        sessionStorage.clear()
        navigate('/login')
    }

    return logout
}