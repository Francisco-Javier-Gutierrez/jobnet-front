import { ref, computed, watch, type Ref } from "vue";

export interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export function usePagination<T>(
  items: Ref<T[]> | T[],
  options: PaginationOptions = {},
) {
  const currentPage = ref(options.initialPage || 1);
  const pageSize = ref(options.initialPageSize || 10);

  const itemsRef = computed(() => (Array.isArray(items) ? items : items.value));

  const totalItems = computed(() => itemsRef.value.length);

  const totalPages = computed(() => {
    if (totalItems.value === 0) return 1;
    return Math.ceil(totalItems.value / pageSize.value);
  });

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return itemsRef.value.slice(start, end);
  });

  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPrevPage = computed(() => currentPage.value > 1);

  const startIndex = computed(() =>
    totalItems.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1,
  );
  const endIndex = computed(() =>
    Math.min(currentPage.value * pageSize.value, totalItems.value),
  );

  function nextPage() {
    if (hasNextPage.value) {
      currentPage.value++;
    }
  }

  function prevPage() {
    if (hasPrevPage.value) {
      currentPage.value--;
    }
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  function resetPage() {
    currentPage.value = 1;
  }

  // Reset to page 1 if current page becomes out of bounds
  watch(totalPages, (newTotalPages) => {
    if (currentPage.value > newTotalPages && newTotalPages > 0) {
      currentPage.value = newTotalPages;
    }
  });

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    paginatedItems,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
    nextPage,
    prevPage,
    goToPage,
    resetPage,
  };
}
