import { useState, useCallback } from "react";

export const usePaginationStore = () => {
  const [pagination, setPaginationState] = useState({
    page: 1,
    limit: 10,
    total: 0,
    txt_search: "",
    is_active: null,
  });

  const setPagination = useCallback((updates) => {
    setPaginationState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetPagination = useCallback(() => {
    setPaginationState({
      page: 1,
      limit: 10,
      total: 0,
      txt_search: "",
      is_active: null,
    });
  }, []);

  return {
    pagination,
    setPagination,
    resetPagination,
  };
};