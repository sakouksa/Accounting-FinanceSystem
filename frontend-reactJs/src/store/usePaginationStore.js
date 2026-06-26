import {
  create
} from "zustand";

export const usePaginationStore = create((set) => ({
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    txt_search: "",
    is_active: null,
  },

  setPagination: (updates) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        ...updates
      }
    })),

  resetPagination: () =>
    set({
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        txt_search: "",
        is_active: null,
      },
    }),
}));