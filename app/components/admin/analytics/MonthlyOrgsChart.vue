<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
  >
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-outline-variant/30 dark:border-slate-800">
      <div>
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[22px]">domain_add</span>
          <h2 class="text-base font-bold text-on-surface dark:text-slate-100">
            Volumen Mensual de Nuevas Organizaciones
          </h2>
        </div>
        <p class="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
          Evolución del registro institucional acumulado en los últimos 12 meses
        </p>
      </div>
      <span class="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
        <span class="material-symbols-outlined text-[14px]">trending_up</span>
        +15.2% este mes
      </span>
    </div>

    <!-- Chart Body (SVG Columns) -->
    <div class="mt-6 flex-1 flex flex-col justify-end">
      <!-- Top Max Value Indicator -->
      <div class="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 mb-2 px-1">
        <span>Máx: {{ maxCount }} orgs</span>
        <span class="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
          <span class="material-symbols-outlined text-[12px]">verified</span>
          Tendencia al alza
        </span>
      </div>

      <!-- Bars Container -->
      <div class="h-44 sm:h-52 w-full flex items-end justify-between gap-1 sm:gap-2 px-1 pb-2 border-b border-outline-variant/40 dark:border-slate-800">
        <div
          v-for="item in monthlyData"
          :key="item.month"
          class="flex-1 flex flex-col items-center group relative h-full justify-end"
        >
          <!-- Floating Value Tooltip on hover -->
          <div
            class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-8 px-2 py-0.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold rounded shadow pointer-events-none z-10 whitespace-nowrap"
          >
            {{ item.count }} organizaciones
          </div>

          <!-- The Bar -->
          <div
            class="w-full max-w-[28px] rounded-t-lg transition-all duration-300 group-hover:brightness-110"
            :class="isLatest(item) ? 'bg-gradient-to-t from-purple-700 to-indigo-500 shadow-md' : 'bg-gradient-to-t from-purple-400/80 to-purple-500/90 dark:from-purple-900/60 dark:to-purple-500/60'"
            :style="{ height: `${Math.max((item.count / maxCount) * 100, 8)}%` }"
          ></div>

          <!-- Month Label -->
          <span class="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center group-hover:text-primary transition font-medium">
            {{ formatShortMonth(item.month) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Bottom Metrics -->
    <div class="mt-4 pt-3 border-t border-outline-variant/30 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
      <div>
        <p class="text-[10px] text-slate-400 dark:text-slate-500">Total Actual</p>
        <p class="text-sm font-bold text-on-surface dark:text-slate-100">{{ currentTotal }} orgs</p>
      </div>
      <div>
        <p class="text-[10px] text-slate-400 dark:text-slate-500">Promedio / Mes</p>
        <p class="text-sm font-bold text-on-surface dark:text-slate-100">{{ averageMonthly }} orgs</p>
      </div>
      <div>
        <p class="text-[10px] text-slate-400 dark:text-slate-500">Pico Más Alto</p>
        <p class="text-sm font-bold text-purple-600 dark:text-purple-400">{{ maxCount }} en Oct</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MonthlyOrgItem } from "~/composables/useAdminAnalytics";

const props = defineProps<{
  monthlyData: MonthlyOrgItem[];
}>();

const maxCount = computed(() => {
  if (!props.monthlyData || props.monthlyData.length === 0) return 40;
  return Math.max(...props.monthlyData.map((d) => d.count), 10);
});

const currentTotal = computed(() => {
  if (!props.monthlyData || props.monthlyData.length === 0) return 0;
  return props.monthlyData[props.monthlyData.length - 1]?.count || 0;
});

const averageMonthly = computed(() => {
  if (!props.monthlyData || props.monthlyData.length === 0) return 0;
  const sum = props.monthlyData.reduce((acc, curr) => acc + curr.count, 0);
  return Math.round(sum / props.monthlyData.length);
});

const isLatest = (item: MonthlyOrgItem) => {
  if (!props.monthlyData || props.monthlyData.length === 0) return false;
  return props.monthlyData[props.monthlyData.length - 1].month === item.month;
};

const formatShortMonth = (fullMonth: string) => {
  return fullMonth.split(" ")[0];
};
</script>
