import { ref, computed, watch, type Ref } from "vue";

export interface FilterOptions<T> {
  searchFields?: (keyof T | string)[];
  debounceMs?: number;
}

export function useFilterAndSearch<T extends Record<string, any>>(
  items: Ref<T[]> | T[],
  options: FilterOptions<T> = {},
) {
  const searchQuery = ref("");
  const debouncedQuery = ref("");
  const activeFilters = ref<Record<string, any>>({});
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const debounceMs = options.debounceMs ?? 250;

  watch(searchQuery, (newVal) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (!debounceMs) {
      debouncedQuery.value = newVal;
      return;
    }
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = newVal;
    }, debounceMs);
  });

  const itemsRef = computed(() => (Array.isArray(items) ? items : items.value));

  const filteredItems = computed(() => {
    let result = itemsRef.value;

    // Filter by text search query
    const query = debouncedQuery.value.trim().toLowerCase();
    if (query) {
      result = result.filter((item) => {
        if (options.searchFields && options.searchFields.length > 0) {
          return options.searchFields.some((field) => {
            const val = getNestedValue(item, field as string);
            return val != null && String(val).toLowerCase().includes(query);
          });
        }
        // Fallback: search all values of object
        return Object.values(item).some(
          (val) => val != null && String(val).toLowerCase().includes(query),
        );
      });
    }

    // Filter by active key-value criteria
    Object.entries(activeFilters.value).forEach(([key, filterVal]) => {
      if (
        filterVal === undefined ||
        filterVal === null ||
        filterVal === "" ||
        filterVal === "ALL" ||
        filterVal === "TODOS"
      ) {
        return;
      }
      result = result.filter((item) => {
        const itemVal = getNestedValue(item, key);
        if (Array.isArray(filterVal)) {
          return filterVal.includes(itemVal);
        }
        return itemVal === filterVal;
      });
    });

    return result;
  });

  function setFilter(key: string, value: any) {
    activeFilters.value = {
      ...activeFilters.value,
      [key]: value,
    };
  }

  function clearFilter(key: string) {
    const updated = { ...activeFilters.value };
    delete updated[key];
    activeFilters.value = updated;
  }

  function clearAllFilters() {
    searchQuery.value = "";
    debouncedQuery.value = "";
    activeFilters.value = {};
  }

  function getNestedValue(obj: any, path: string): any {
    return path
      .split(".")
      .reduce(
        (acc, part) => (acc && acc[part] !== undefined ? acc[part] : null),
        obj,
      );
  }

  return {
    searchQuery,
    debouncedQuery,
    activeFilters,
    filteredItems,
    setFilter,
    clearFilter,
    clearAllFilters,
  };
}
