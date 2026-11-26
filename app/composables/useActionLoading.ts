import { readonly, ref } from "vue";

/**
 * Tracks concurrent per-item loading states by unique string key (e.g. row or comment ID)
 * to prevent duplicate submissions without disabling unrelated controls.
 */
export function useActionLoading() {
  const pendingKeys = ref<Record<string, boolean>>({});

  const isPending = (key: string): boolean => Boolean(pendingKeys.value[key]);

  const runWithLoading = async <T>(
    key: string,
    action: () => Promise<T>,
  ): Promise<T | undefined> => {
    if (pendingKeys.value[key]) return undefined;
    pendingKeys.value = { ...pendingKeys.value, [key]: true };
    try {
      return await action();
    } finally {
      const next = { ...pendingKeys.value };
      delete next[key];
      pendingKeys.value = next;
    }
  };

  return {
    pendingKeys: readonly(pendingKeys),
    isPending,
    runWithLoading,
  };
}
