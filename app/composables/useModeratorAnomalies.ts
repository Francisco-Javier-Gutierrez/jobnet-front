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
    return [
      {
        id: "anom-vac-demo-01",
        type: "RAPID_VACANCIES",
        severity: "CRITICAL",
        organizationId: "org-bot-recruitment-99",
        organizationName: "FastHiring Express Latam S.A.S.",
        count: 14,
        threshold: 10,
        timeWindow: "38 min (< 1 hora)",
        detectedAt: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
        title: "Concurrencia Anómala: Posible Bot / Spam de Vacantes",
        description:
          "Se detectaron 14 vacantes publicadas en 38 minutos por FastHiring Express Latam S.A.S. Supera el límite de seguridad de 10 vacantes/hora.",
        category: "BOT_SPAM",
        status: "ACTIVE",
      },
      {
        id: "anom-rep-demo-02",
        type: "REPORT_SURGE",
        severity: "CRITICAL",
        organizationId: "org-fake-corp-77",
        organizationName: "Inversiones & Créditos Inmediatos México",
        count: 7,
        threshold: 5,
        timeWindow: "24 min (< 1 hora)",
        detectedAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
        title: "Concurrencia Anómala: Avalancha de Reportes por Fraude Masivo",
        description:
          "Se acumularon 7 denuncias independientes por cobro previo indebido y estafa en 24 minutos contra Inversiones & Créditos Inmediatos México. Supera el límite de 5 reportes/hora.",
        category: "MASS_FRAUD",
        status: "ACTIVE",
      },
    ];
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
