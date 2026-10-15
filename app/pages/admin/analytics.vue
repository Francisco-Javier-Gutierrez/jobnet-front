<template>
  <div
    class="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200"
    role="main"
  >
    <!-- Success Feedback Toast/Banner -->
    <div
      v-if="successMsg"
      class="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-fade-in"
    >
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400">check_circle</span>
        <span>{{ successMsg }}</span>
      </div>
      <button
        @click="successMsg = ''"
        class="text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-300"
        aria-label="Cerrar notificación"
      >
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    </div>

    <!-- Small, Clean & Relevant Title (Sin banners descriptivos de V2) -->
    <div class="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Monitoreo y Métricas
        </h1>
      </div>

      <!-- Quick Action: Ir al Control de Organizaciones -->
      <NuxtLink
        to="/admin/organizations"
        class="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary text-xs font-semibold rounded-lg transition shadow-sm text-slate-700 dark:text-slate-200"
      >
        <span class="material-symbols-outlined text-base">account_balance</span>
        <span>Control Organizaciones</span>
      </NuxtLink>
    </div>

    <!-- Alerta Visual Parpadeante de Concurrencia Anómala (< 1 hora: Bots / Spam / Fraude) -->
    <AnomalousConcurrencyAlert
      v-if="hasActiveAnomalies"
      :anomalies="activeAnomalies"
      @sanction="handleSanctionFromAlert"
      @dismiss="dismissAnomaly"
    />

    <!-- Filters Bar -->
    <div class="mb-6">
      <AnalyticsFilters
        v-model="selectedRegion"
        :regions="regionsList"
        :loading="loading"
        @refresh="refresh"
        @export="exportCsv"
      />
    </div>

    <!-- Executive KPI Grid -->
    <div class="mb-8">
      <AnalyticsKpiGrid :kpis="analyticsData.kpis" />
    </div>

    <!-- Core Analytical Grid (Top 10 Skills & Monthly Orgs) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- 1. Top 10 Habilidades Técnicas más demandadas en la región -->
      <SkillsBarChart
        :skills="analyticsData.topSkills"
        :region="selectedRegion"
      />

      <!-- 2. Volumen mensual de nuevas organizaciones registradas -->
      <MonthlyOrgsChart
        :monthly-data="analyticsData.monthlyOrganizations"
      />
    </div>

    <!-- 3. Tasa promedio de postulaciones por oferta laboral -->
    <div class="mb-8">
      <ApplicationRateCard
        :rate-data="analyticsData.applicationRate"
      />
    </div>

    <!-- Modal de Sanciones Administrativas / Congelamiento Preventivo -->
    <SanctionModal
      v-model="isSanctionModalOpen"
      :selected-org="selectedOrg"
      :sanction-steps="sanctionSteps"
      v-model:suspension-reason-input="suspensionReasonInput"
      v-model:grace-days-input="graceDaysInput"
      :get-org-status-key="getOrgStatusKey"
      @apply-sanction="handleApplySanction"
    />
  </div>
</template>

<script setup lang="ts">
import AnalyticsFilters from "~/components/admin/analytics/AnalyticsFilters.vue";
import AnalyticsKpiGrid from "~/components/admin/analytics/AnalyticsKpiGrid.vue";
import SkillsBarChart from "~/components/admin/analytics/SkillsBarChart.vue";
import MonthlyOrgsChart from "~/components/admin/analytics/MonthlyOrgsChart.vue";
import ApplicationRateCard from "~/components/admin/analytics/ApplicationRateCard.vue";
import AnomalousConcurrencyAlert from "~/components/admin/analytics/AnomalousConcurrencyAlert.vue";
import SanctionModal from "~/components/admin/organizations/SanctionModal.vue";
import { useAdminAnalytics } from "~/composables/useAdminAnalytics";
import { useOrgActions } from "~/composables/useOrgActions";

definePageMeta({
  alias: ["/admin/dashboard"],
});

useSeoMeta({
  title: "Monitoreo y Métricas - JobNet Admin",
  description:
    "Monitoreo del sistema, métricas del mercado laboral y detección de concurrencia anómala.",
});

const {
  selectedRegion,
  analyticsData,
  activeAnomalies,
  hasActiveAnomalies,
  dismissAnomaly,
  regionsList,
  loading,
  refresh,
  exportCsv,
} = useAdminAnalytics();

const {
  successMsg,
  isSanctionModalOpen,
  selectedOrg,
  suspensionReasonInput,
  graceDaysInput,
  sanctionSteps,
  openSanctionModal,
  applySanction,
} = useOrgActions(async () => {
  await refresh();
});

const handleSanctionFromAlert = (org: {
  id: string;
  nombre: string;
  reason?: string;
}) => {
  openSanctionModal({
    id: org.id,
    nombre: org.nombre,
    companyId: org.id,
  });
  if (org.reason) {
    suspensionReasonInput.value = org.reason;
  }
};

const handleApplySanction = async (
  actionType: "INITIATE" | "CANCEL" | "CONFIRM",
  reason?: string,
) => {
  const currentOrgId = selectedOrg.value?.id;
  await applySanction(actionType, reason);

  // Descartar automáticamente la alerta asociada una vez tomada la acción de sanción
  if (currentOrgId) {
    const matching = activeAnomalies.value.find(
      (a) => a.organizationId === currentOrgId,
    );
    if (matching) {
      dismissAnomaly(matching.id);
    }
  }
};
</script>
