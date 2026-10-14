export function useDraftAutoSave<T extends object>(
  storageKey: string,
  formData: Ref<T>,
) {
  const hasDraft = ref(false);

  function loadDraft(): boolean {
    if (!import.meta.client) return false;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(formData.value, parsed);
        hasDraft.value = true;
        return true;
      }
    } catch (e) {
      console.warn("Failed to load draft from localStorage", e);
    }
    return false;
  }

  function saveDraft() {
    if (!import.meta.client) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(formData.value));
      hasDraft.value = true;
    } catch (e) {
      console.warn("Failed to save draft to localStorage", e);
    }
  }

  function discardDraft() {
    if (!import.meta.client) return;
    try {
      localStorage.removeItem(storageKey);
      hasDraft.value = false;
    } catch (e) {
      console.warn("Failed to clear draft from localStorage", e);
    }
  }

  onMounted(() => {
    loadDraft();
  });

  watch(
    formData,
    () => {
      saveDraft();
    },
    { deep: true },
  );

  return {
    hasDraft,
    loadDraft,
    saveDraft,
    discardDraft,
  };
}
