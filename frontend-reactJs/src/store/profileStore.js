import {
  create
} from 'zustand'
import {
  persist,
  createJSONStorage
} from 'zustand/middleware'
export const profileStore = create(
  persist(
    set => ({
      profile: null,
      access_token: null,
      permissions: [],

      setProfile: (profileParams, permissionsParams) => set(state => ({
        profile: profileParams,
        permissions: permissionsParams !== undefined ? permissionsParams : state.permissions
      })),

      setAccessToken: (params) => set({
        access_token: params
      }),

      logout: () =>
        set({
          profile: null,
          access_token: null,
          permissions: []
        })
    }), {
      name: 'user-profile',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)