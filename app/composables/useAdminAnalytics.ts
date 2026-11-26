import { ref, computed } from "vue";
import { useFetch } from "#imports";
import { getAuthHeaders } from "~/composables/useApiClient";

export interface SkillItem {
  name: string;
  count: number;
  percentage: number;
  category: string;
}

export interface MonthlyOrgItem {
  month: string;
  count: number;
  label: string;
}

export interface ApplicationRateData {
  averagePerJob: number;
  totalApplications: number;
  totalJobs: number;
  byModality: {
    Remoto: number;
    Híbrido: number;
    Presencial: number;
  };
  distribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
}

export interface AnomalyAlert {
  id: string;
  type: "RAPID_VACANCIES" | "REPORT_SURGE" | string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  organizationId: string;
  organizationName: string;
  count: number;
  threshold: number;
  timeWindow: string;
  detectedAt: string;
  title: string;
  description: string;
  category: "BOT_SPAM" | "MASS_FRAUD" | string;
  status: "ACTIVE" | "DISMISSED" | "RESOLVED";
}

export interface AnalyticsKpis {
  totalVacancies: number;
  totalOrganizations: number;
  verifiedOrganizations: number;
  totalApplications: number;
  averageApplicationsPerJob: number;
  topSkillName: string;
  topSkillCount: number;
  monthlyGrowthRate: string;
  activeAnomaliesCount?: number;
}

export interface AdminAnalyticsData {
  regions: string[];
  selectedRegion: string;
  topSkills: SkillItem[];
  monthlyOrganizations: MonthlyOrgItem[];
  applicationRate: ApplicationRateData;
  anomalies?: AnomalyAlert[];
  kpis: AnalyticsKpis;
  warnings?: string[];
}

const emptyAnalytics = (selectedRegion: string): AdminAnalyticsData => ({
  regions: ["Todas las Regiones"],
  selectedRegion,
  topSkills: [],
  monthlyOrganizations: [],
  applicationRate: {
    averagePerJob: 0,
    totalApplications: 0,
    totalJobs: 0,
    byModality: {
      Remoto: 0,
      Híbrido: 0,
      Presencial: 0,
    },
    distribution: [],
  },
  anomalies: [],
  kpis: {
    totalVacancies: 0,
    totalOrganizations: 0,
    verifiedOrganizations: 0,
    totalApplications: 0,
    averageApplicationsPerJob: 0,
    topSkillName: "Sin datos",
    topSkillCount: 0,
    monthlyGrowthRate: "N/D",
    activeAnomaliesCount: 0,
  },
  warnings: [],
});

export function useAdminAnalytics() {
  const selectedRegion = ref("Todas las Regiones");
  const selectedPeriod = ref<"year" | "quarter" | "month">("year");
  const dismissedAnomalyIds = ref<string[]>([]);

  const queryParams = computed(() => ({
    region:
      selectedRegion.value === "Todas las Regiones"
        ? "ALL"
        : selectedRegion.value,
    period: selectedPeriod.value,
  }));

  const {
    data: apiResponse,
    status,
    error: fetchError,
    refresh,
  } = useFetch<any>("/api/admin/analytics", {
    query: queryParams,
    headers: computed(() => getAuthHeaders()),
    lazy: false,
    server: false,
  });

  const loading = computed(() => status.value === "pending");
  const error = computed(() => fetchError.value?.message || null);

  const analyticsData = computed<AdminAnalyticsData>(() => {
    if (apiResponse.value?.data) {
      return {
        ...apiResponse.value.data,
        warnings: apiResponse.value.warnings || [],
      };
    }

    return emptyAnalytics(selectedRegion.value);
  });

  const activeAnomalies = computed<AnomalyAlert[]>(() => {
    const list = analyticsData.value.anomalies || [];
    return list.filter((a) => !dismissedAnomalyIds.value.includes(a.id));
  });

  const hasActiveAnomalies = computed(() => activeAnomalies.value.length > 0);

  const dismissAnomaly = (id: string) => {
    if (!dismissedAnomalyIds.value.includes(id)) {
      dismissedAnomalyIds.value.push(id);
    }
  };

  const regionsList = computed(() => {
    return analyticsData.value.regions || ["Todas las Regiones"];
  });

  const setRegion = (region: string) => {
    selectedRegion.value = region;
    refresh();
  };

  const setPeriod = (period: "year" | "quarter" | "month") => {
    selectedPeriod.value = period;
    refresh();
  };

  const exportCsv = () => {
    const data = analyticsData.value;
    let csv = "MONITOREO Y METRICAS - JOBNET\n";
    csv += `Fecha de generación,${new Date().toLocaleDateString("es-MX")}\n`;
    csv += `Región analizada,${selectedRegion.value}\n\n`;

    // 1. Top 10 Skills
    csv += "TOP 10 HABILIDADES TECNICAS MAS DEMANDADAS\n";
    csv +=
      "Posición,Habilidad Técnica,Vacantes que la demandan,Porcentaje de Ofertas,Categoría\n";
    data.topSkills.forEach((s, idx) => {
      csv += `${idx + 1},"${s.name}",${s.count},${s.percentage}%,${s.category}\n`;
    });
    csv += "\n";

    // 2. Monthly Organizations
    csv += "VOLUMEN MENSUAL DE NUEVAS ORGANIZACIONES REGISTRADAS\n";
    csv += "Mes,Organizaciones Nuevas Registradas\n";
    data.monthlyOrganizations.forEach((m) => {
      csv += `"${m.month}",${m.count}\n`;
    });
    csv += "\n";

    // 3. Application Rate
    csv += "TASA PROMEDIO DE POSTULACIONES POR OFERTA LABORAL\n";
    csv += `Promedio General,${data.applicationRate.averagePerJob} postulaciones/oferta\n`;
    csv += `Total Postulaciones,${data.applicationRate.totalApplications}\n`;
    csv += `Total Ofertas Laborales,${data.applicationRate.totalJobs}\n`;
    csv += `Tasa Remoto,${data.applicationRate.byModality.Remoto} postulaciones/oferta\n`;
    csv += `Tasa Híbrido,${data.applicationRate.byModality.Híbrido} postulaciones/oferta\n`;
    csv += `Tasa Presencial,${data.applicationRate.byModality.Presencial} postulaciones/oferta\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `jobnet-analitica-avanzada-${Date.now()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    selectedRegion,
    selectedPeriod,
    analyticsData,
    activeAnomalies,
    hasActiveAnomalies,
    dismissAnomaly,
    regionsList,
    loading,
    error,
    refresh,
    setRegion,
    setPeriod,
    exportCsv,
  };
}
