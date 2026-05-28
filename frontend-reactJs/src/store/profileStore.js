import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const profileStore = create(
  persist(
    set => ({
      profile: null,
      access_token: null,
      permission: [],

      setProfile: params =>
        set({
          profile: params
        }),
      setAccessToken: params =>
        set({
          access_token: params
        }),

      logout: () =>
        set({
          profile: null,
          access_token: null,
          permission: []
        })
    }),
    {
      name: 'user-profile',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
