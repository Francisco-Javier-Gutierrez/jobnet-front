<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- KPI 1: Vacantes Activas en la Región -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow transition"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
          Vacantes Analizadas
        </span>
        <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <span class="material-symbols-outlined text-[20px]">work</span>
        </div>
      </div>
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-2xl font-black text-on-surface dark:text-slate-100">
          {{ kpis.totalVacancies }}
        </span>
        <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
          <span class="material-symbols-outlined text-xs">trending_up</span>
          Activas
        </span>
      </div>
      <p class="text-[11px] text-on-surface-variant/80 dark:text-slate-500 mt-1">
        Ofertas laborales en la región seleccionada
      </p>
    </div>

    <!-- KPI 2: Total Organizaciones Registradas -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow transition"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
          Organizaciones Registradas
        </span>
        <div class="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
          <span class="material-symbols-outlined text-[20px]">apartment</span>
        </div>
      </div>
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-2xl font-black text-on-surface dark:text-slate-100">
          {{ kpis.totalOrganizations }}
        </span>
        <span class="text-xs font-semibold text-purple-600 dark:text-purple-400">
          {{ kpis.monthlyGrowthRate }}
        </span>
      </div>
      <p class="text-[11px] text-on-surface-variant/80 dark:text-slate-500 mt-1">
        {{ kpis.verifiedOrganizations }} empresas verificadas oficialmente
      </p>
    </div>

    <!-- KPI 3: Tasa Promedio de Postulaciones -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow transition"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
          Tasa Promedio Postulaciones
        </span>
        <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <span class="material-symbols-outlined text-[20px]">how_to_reg</span>
        </div>
      </div>
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-2xl font-black text-on-surface dark:text-slate-100">
          {{ kpis.averageApplicationsPerJob }}
        </span>
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
          por vacante
        </span>
      </div>
      <p class="text-[11px] text-on-surface-variant/80 dark:text-slate-500 mt-1">
        {{ kpis.totalApplications }} postulaciones procesadas
      </p>
    </div>

    <!-- KPI 4: Top Habilidad Técnica -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow transition"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
          Habilidad #1 en Demanda
        </span>
        <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <span class="material-symbols-outlined text-[20px]">military_tech</span>
        </div>
      </div>
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-lg font-black text-primary dark:text-indigo-400 truncate max-w-[180px]">
          {{ kpis.topSkillName }}
        </span>
      </div>
      <p class="text-[11px] text-on-surface-variant/80 dark:text-slate-500 mt-1">
        Requerida en {{ kpis.topSkillCount }} ofertas laborales
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AnalyticsKpis } from "~/composables/useAdminAnalytics";

defineProps<{
  kpis: AnalyticsKpis;
}>();
</script>
