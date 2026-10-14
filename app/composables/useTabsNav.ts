export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: string;
  badgeClass?: string;
}

export interface TabsNavOptions {
  syncWithUrlQuery?: boolean;
  queryParamName?: string;
}

export function useTabsNav(
  initialTabs: TabItem[],
  defaultTabId?: string,
  options: TabsNavOptions = {},
) {
  const tabs = ref<TabItem[]>(initialTabs);
  const activeTab = ref<string>(
    defaultTabId || (initialTabs[0] ? initialTabs[0].id : ""),
  );

  const syncWithUrl = options.syncWithUrlQuery ?? false;
  const queryParam = options.queryParamName ?? "tab";

  onMounted(() => {
    if (syncWithUrl) {
      const route = useRoute();
      const currentQuery = route.query[queryParam];
      if (currentQuery && tabs.value.some((t) => t.id === currentQuery)) {
        activeTab.value = String(currentQuery);
      }
    }
  });

  if (syncWithUrl) {
    const route = useRoute();
    const router = useRouter();

    watch(activeTab, (newTab) => {
      if (route.query[queryParam] !== newTab) {
        router.replace({
          query: {
            ...route.query,
            [queryParam]: newTab,
          },
        });
      }
    });
  }

  function setActiveTab(tabId: string) {
    if (tabs.value.some((t) => t.id === tabId)) {
      activeTab.value = tabId;
    }
  }

  function updateTabCounts(countsMap: Record<string, number>) {
    tabs.value = tabs.value.map((t) => {
      if (countsMap[t.id] !== undefined) {
        return { ...t, count: countsMap[t.id] };
      }
      return t;
    });
  }

  return {
    tabs,
    activeTab,
    setActiveTab,
    updateTabCounts,
  };
}
