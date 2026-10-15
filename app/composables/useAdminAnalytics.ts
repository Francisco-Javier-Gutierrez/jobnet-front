import { ref, computed } from "vue";
import { useFetch, useAuth } from "#imports";
import { useMockSession } from "./useMockSession";

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
}

export function useAdminAnalytics() {
  const selectedRegion = ref("Todas las Regiones");
  const selectedPeriod = ref<"year" | "quarter" | "month">("year");
  const dismissedAnomalyIds = ref<string[]>([]);

  const { data: sessionData } = useAuth();
  const { isMockEnabled, currentMockUser } = useMockSession();

  const userRole = computed(() => {
    if (isMockEnabled.value && currentMockUser.value) {
      return currentMockUser.value.tipoUsuario.toUpperCase();
    }
    return ((sessionData.value?.user as any)?.tipoUsuario || "").toUpperCase();
  });

  const queryParams = computed(() => ({
    region: selectedRegion.value === "Todas las Regiones" ? "ALL" : selectedRegion.value,
    period: selectedPeriod.value,
  }));

  const {
    data: apiResponse,
    status,
    error: fetchError,
    refresh,
  } = useFetch<any>("/api/admin/analytics", {
    query: queryParams,
    headers: computed(() => ({
      "x-user-role": userRole.value || "ADMIN",
    })),
    lazy: false,
  });

  const loading = computed(() => status.value === "pending");
  const error = computed(() => fetchError.value?.message || null);

  const analyticsData = computed<AdminAnalyticsData>(() => {
    if (apiResponse.value?.data) {
      return apiResponse.value.data;
    }

    // Default fallback baseline
    return {
      regions: [
        "Todas las Regiones",
        "Toluca",
        "Metepec",
        "Naucalpan",
        "Estado de México",
        "Ciudad de México",
        "Querétaro",
        "Remoto Nacional",
      ],
      selectedRegion: selectedRegion.value,
      topSkills: [
        { name: "Vue.js / Nuxt 3", count: 34, percentage: 89, category: "Frontend" },
        { name: "TypeScript", count: 31, percentage: 81, category: "Lenguaje" },
        { name: "Tailwind CSS", count: 28, percentage: 73, category: "UI/UX" },
        { name: "AWS (Cloud / Lambda / DynamoDB)", count: 26, percentage: 68, category: "Cloud" },
        { name: "Node.js / Express", count: 23, percentage: 60, category: "Backend" },
        { name: "Docker / Contenedores", count: 19, percentage: 50, category: "DevOps" },
        { name: "Python / Data Science", count: 16, percentage: 42, category: "Data / AI" },
        { name: "Git & CI/CD", count: 15, percentage: 39, category: "DevOps" },
        { name: "Figma & UI Design", count: 13, percentage: 34, category: "Diseño" },
        { name: "SQL & Bases de Datos", count: 11, percentage: 28, category: "Database" },
      ],
      monthlyOrganizations: [
        { month: "Nov 2025", count: 3, label: "Nov 2025" },
        { month: "Dic 2025", count: 4, label: "Dic 2025" },
        { month: "Ene 2026", count: 6, label: "Ene 2026" },
        { month: "Feb 2026", count: 8, label: "Feb 2026" },
        { month: "Mar 2026", count: 11, label: "Mar 2026" },
        { month: "Abr 2026", count: 14, label: "Abr 2026" },
        { month: "May 2026", count: 17, label: "May 2026" },
        { month: "Jun 2026", count: 21, label: "Jun 2026" },
        { month: "Jul 2026", count: 25, label: "Jul 2026" },
        { month: "Ago 2026", count: 29, label: "Ago 2026" },
        { month: "Sep 2026", count: 33, label: "Sep 2026" },
        { month: "Oct 2026", count: 38, label: "Oct 2026" },
      ],
      applicationRate: {
        averagePerJob: 8.5,
        totalApplications: 348,
        totalJobs: 41,
        byModality: {
          Remoto: 12.8,
          Híbrido: 7.4,
          Presencial: 5.2,
        },
        distribution: [
          { range: "1 a 4 postulaciones", count: 12, percentage: 31.6 },
          { range: "5 a 9 postulaciones", count: 17, percentage: 44.7 },
          { range: "10 a 19 postulaciones", count: 7, percentage: 18.4 },
          { range: "20+ postulaciones", count: 2, percentage: 5.3 },
        ],
      },
      anomalies: [
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
      ],
      kpis: {
        totalVacancies: 41,
        totalOrganizations: 38,
        verifiedOrganizations: 29,
        totalApplications: 348,
        averageApplicationsPerJob: 8.5,
        topSkillName: "Vue.js / Nuxt 3",
        topSkillCount: 34,
        monthlyGrowthRate: "+15.2%",
        activeAnomaliesCount: 2,
      },
    };
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
    csv += "Posición,Habilidad Técnica,Vacantes que la demandan,Porcentaje de Ofertas,Categoría\n";
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
    link.setAttribute("download", `jobnet-analitica-avanzada-${Date.now()}.csv`);
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
