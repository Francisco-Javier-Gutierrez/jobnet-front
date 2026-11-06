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
        <span
          class="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400"
          >check_circle</span
        >
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

    <!-- Title & Navigation to Main Dashboard -->
    <div
      class="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <NuxtLink
            to="/admin"
            class="text-xs font-semibold text-primary dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            Volver al Panel Principal
          </NuxtLink>
        </div>
        <h1
          class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          Analítica Avanzada
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Demanda de habilidades técnicas, distribución regional y tasas de
          postulación en el Estado de México.
        </p>
      </div>

      <!-- Quick Action: Ir al Control de Organizaciones -->
      <NuxtLink
        to="/admin/organizations"
        class="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary text-xs font-semibold rounded-lg transition shadow-xs text-slate-700 dark:text-slate-200"
      >
        <span class="material-symbols-outlined text-base">account_balance</span>
        <span>Control Organizaciones</span>
      </NuxtLink>
    </div>

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
      <MonthlyOrgsChart :monthly-data="analyticsData.monthlyOrganizations" />
    </div>

    <!-- 3. Tasa promedio de postulaciones por oferta laboral -->
    <div class="mb-8">
      <ApplicationRateCard :rate-data="analyticsData.applicationRate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AnalyticsFilters from "~/components/admin/analytics/AnalyticsFilters.vue";
import AnalyticsKpiGrid from "~/components/admin/analytics/AnalyticsKpiGrid.vue";
import SkillsBarChart from "~/components/admin/analytics/SkillsBarChart.vue";
import MonthlyOrgsChart from "~/components/admin/analytics/MonthlyOrgsChart.vue";
import ApplicationRateCard from "~/components/admin/analytics/ApplicationRateCard.vue";
import { useAdminAnalytics } from "~/composables/useAdminAnalytics";

useSeoMeta({
  title: "Analítica Avanzada - JobNet Admin",
  description:
    "Demanda de habilidades técnicas, distribución regional, tasas de postulación y crecimiento organizacional.",
});

const {
  selectedRegion,
  analyticsData,
  regionsList,
  loading,
  refresh,
  exportCsv,
} = useAdminAnalytics();
</script>
