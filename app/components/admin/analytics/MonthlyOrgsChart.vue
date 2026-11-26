<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
  >
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-outline-variant/30 dark:border-slate-800"
    >
      <div>
        <div class="flex items-center gap-2">
          <span
            class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[22px]"
            >domain_add</span
          >
          <h2 class="text-base font-bold text-on-surface dark:text-slate-100">
            Volumen Mensual de Nuevas Organizaciones
          </h2>
        </div>
        <p class="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
          Organizaciones registradas por mes en los últimos 12 meses
        </p>
      </div>
      <span
        class="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
        :class="growthBadgeClass"
      >
        <span class="material-symbols-outlined text-[14px]">{{
          growthIcon
        }}</span>
        {{ monthlyGrowth.label }}
      </span>
    </div>

    <template v-if="hasData">
      <!-- Chart Body (SVG Columns) -->
      <div class="mt-6 flex-1 flex flex-col justify-end">
        <!-- Top Max Value Indicator -->
        <div
          class="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 mb-2 px-1"
        >
          <span>Máx: {{ maxCount }} orgs</span>
          <span
            class="font-semibold flex items-center gap-0.5"
            :class="trendClass"
          >
            <span class="material-symbols-outlined text-[12px]">{{
              growthIcon
            }}</span>
            {{ trendLabel }}
          </span>
        </div>

        <!-- Bars Container -->
        <div
          class="h-44 sm:h-52 w-full flex items-end justify-between gap-1 sm:gap-2 px-1 pb-2 border-b border-outline-variant/40 dark:border-slate-800"
        >
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
              :class="
                isLatest(item)
                  ? 'bg-gradient-to-t from-purple-700 to-indigo-500 shadow-md'
                  : 'bg-gradient-to-t from-purple-400/80 to-purple-500/90 dark:from-purple-900/60 dark:to-purple-500/60'
              "
              :style="{
                height:
                  item.count > 0
                    ? `${Math.max((item.count / maxCount) * 100, 8)}%`
                    : '0%',
              }"
            ></div>

            <!-- Month Label -->
            <span
              class="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center group-hover:text-primary transition font-medium"
            >
              {{ formatShortMonth(item.month) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Bottom Metrics -->
      <div
        class="mt-4 pt-3 border-t border-outline-variant/30 dark:border-slate-800 grid grid-cols-3 gap-2 text-center"
      >
        <div>
          <p class="text-[10px] text-slate-400 dark:text-slate-500">
            Nuevas este mes
          </p>
          <p class="text-sm font-bold text-on-surface dark:text-slate-100">
            {{ currentTotal }} orgs
          </p>
        </div>
        <div>
          <p class="text-[10px] text-slate-400 dark:text-slate-500">
            Promedio / Mes
          </p>
          <p class="text-sm font-bold text-on-surface dark:text-slate-100">
            {{ averageMonthly }} orgs
          </p>
        </div>
        <div>
          <p class="text-[10px] text-slate-400 dark:text-slate-500">
            Pico Más Alto
          </p>
          <p class="text-sm font-bold text-purple-600 dark:text-purple-400">
            {{ maxCount }} en {{ peakMonth }}
          </p>
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <div
      v-else
      class="mt-6 flex-1 flex flex-col items-center justify-center py-12 text-center"
    >
      <span
        class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700"
        >domain_disabled</span
      >
      <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Aún no hay organizaciones registradas en los últimos 12 meses.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MonthlyOrgItem } from "~/composables/useAdminAnalytics";

const props = defineProps<{
  monthlyData: MonthlyOrgItem[];
}>();

const series = computed(() => props.monthlyData || []);

const maxCount = computed(() =>
  series.value.length > 0
    ? Math.max(...series.value.map((item) => item.count))
    : 0,
);

const hasData = computed(() => maxCount.value > 0);

const currentTotal = computed(
  () => series.value[series.value.length - 1]?.count || 0,
);

const previousTotal = computed(
  () => series.value[series.value.length - 2]?.count || 0,
);

const averageMonthly = computed(() => {
  if (series.value.length === 0) return 0;
  const sum = series.value.reduce((acc, item) => acc + item.count, 0);
  return Math.round(sum / series.value.length);
});

const peakMonth = computed(() => {
  if (series.value.length === 0) return "—";
  const peak = series.value.reduce((best, item) =>
    item.count > best.count ? item : best,
  );
  return peak.count > 0 ? peak.month.split(" ")[0] : "—";
});

const monthlyGrowth = computed<{
  label: string;
  tone: "up" | "down" | "neutral";
}>(() => {
  if (!hasData.value) {
    return { label: "Sin datos este mes", tone: "neutral" };
  }

  if (previousTotal.value === 0) {
    return {
      label: currentTotal.value === 0 ? "0% este mes" : "N/D este mes",
      tone: "neutral",
    };
  }

  const growth =
    ((currentTotal.value - previousTotal.value) / previousTotal.value) * 100;

  return {
    label: `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}% este mes`,
    tone: growth > 0 ? "up" : growth < 0 ? "down" : "neutral",
  };
});

const growthIcon = computed(() => {
  if (monthlyGrowth.value.tone === "up") return "trending_up";
  if (monthlyGrowth.value.tone === "down") return "trending_down";
  return "remove";
});

const growthBadgeClass = computed(() => {
  if (monthlyGrowth.value.tone === "up") {
    return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300";
  }
  if (monthlyGrowth.value.tone === "down") {
    return "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300";
  }
  return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";
});

const trendClass = computed(() => {
  if (monthlyGrowth.value.tone === "up") {
    return "text-emerald-600 dark:text-emerald-400";
  }
  if (monthlyGrowth.value.tone === "down") {
    return "text-rose-600 dark:text-rose-400";
  }
  return "text-slate-500 dark:text-slate-400";
});

const trendLabel = computed(() => {
  if (monthlyGrowth.value.tone === "up") return "Tendencia al alza";
  if (monthlyGrowth.value.tone === "down") return "Tendencia a la baja";
  return "Sin variación";
});

const isLatest = (item: MonthlyOrgItem) => {
  if (series.value.length === 0) return false;
  return series.value[series.value.length - 1].month === item.month;
};

const formatShortMonth = (fullMonth: string) => {
  return fullMonth.split(" ")[0];
};
</script>
