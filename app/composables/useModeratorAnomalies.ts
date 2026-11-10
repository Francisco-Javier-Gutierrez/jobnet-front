import { ref, computed } from "vue";
import { useFetch, useAuth } from "#imports";
import type { AnomalyAlert } from "./useAdminAnalytics";

export function useModeratorAnomalies() {
  const dismissedAnomalyIds = ref<string[]>([]);
  const { data: sessionData } = useAuth();

  const userRole = computed(() => {
    return ((sessionData.value?.user as any)?.tipoUsuario || "").toUpperCase();
  });

  const isModerator = computed(() => {
    const role = userRole.value;
    return role === "MODERATOR" || role === "MODERADOR" || role === "ADMIN";
  });

  const {
    data: apiResponse,
    status,
    error: fetchError,
    refresh,
  } = useFetch<any>("/api/moderator/concurrency-alerts", {
    headers: computed(() => ({
      "x-user-role": userRole.value || "MODERATOR",
    })),
    lazy: false,
  });

  const loading = computed(() => status.value === "pending");
  const error = computed(() => fetchError.value?.message || null);

  const rawAnomalies = computed<AnomalyAlert[]>(() => {
    if (apiResponse.value?.anomalies) {
      return apiResponse.value.anomalies;
    }

    // Baseline fallback if offline/mock
    return [];
  });

  const anomalies = computed<AnomalyAlert[]>(() => {
    return rawAnomalies.value.filter(
      (a) => !dismissedAnomalyIds.value.includes(a.id),
    );
  });

  const hasActiveAnomalies = computed(
    () => isModerator.value && anomalies.value.length > 0,
  );

  const dismissAnomaly = (id: string) => {
    if (!dismissedAnomalyIds.value.includes(id)) {
      dismissedAnomalyIds.value.push(id);
    }
  };

  return {
    isModerator,
    userRole,
    anomalies,
    hasActiveAnomalies,
    dismissAnomaly,
    loading,
    error,
    refresh,
  };
}
