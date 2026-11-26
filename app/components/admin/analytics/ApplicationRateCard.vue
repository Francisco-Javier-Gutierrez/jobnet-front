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
            class="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[22px]"
            >leaderboard</span
          >
          <h2 class="text-base font-bold text-on-surface dark:text-slate-100">
            Tasa Promedio de Postulaciones por Oferta
          </h2>
        </div>
        <p class="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
          Ratio de atracción de talento: número medio de aspirantes por vacante
          laboral
        </p>
      </div>
      <span
        class="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
      >
        <span class="material-symbols-outlined text-[14px]">speed</span>
        {{ rateData.totalApplications }} postulaciones
      </span>
    </div>

    <div
      v-if="rateData.totalJobs === 0"
      class="mt-4 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400"
    >
      Aún no hay vacantes activas para calcular la tasa de postulaciones.
    </div>

    <!-- Main Metric Display & Modality Breakdown -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      <!-- Big Gauge / Rate Indicator (cols 5) -->
      <div
        class="md:col-span-5 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-500/10 via-slate-50 to-indigo-500/10 dark:from-emerald-950/30 dark:via-slate-900 dark:to-indigo-950/30 rounded-2xl border border-emerald-500/20"
      >
        <span
          class="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider"
        >
          Promedio General
        </span>
        <div class="my-2 flex items-baseline gap-1">
          <span class="text-5xl font-black text-on-surface dark:text-slate-100">
            {{ rateData.averagePerJob }}
          </span>
          <span
            class="text-sm font-semibold text-slate-500 dark:text-slate-400"
          >
            postulaciones
          </span>
        </div>
        <div
          class="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium"
        >
          <span class="material-symbols-outlined text-sm">check_circle</span>
          <span>Por cada vacante publicada</span>
        </div>
        <div
          class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-3"
        >
          <div
            class="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full"
            :style="{
              width: `${Math.min((rateData.averagePerJob / 15) * 100, 100)}%`,
            }"
          ></div>
        </div>
      </div>

      <!-- Comparison by Modality (cols 7) -->
      <div class="md:col-span-7 space-y-3">
        <p
          class="text-xs font-bold text-on-surface dark:text-slate-200 flex items-center justify-between"
        >
          <span>Comportamiento por Modalidad de Empleo</span>
          <span class="text-[11px] font-normal text-slate-400"
            >Promedio / vacante</span
          >
        </p>

        <!-- Remoto -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span
              class="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-xs text-indigo-500"
                >public</span
              >
              Remoto Nacional
            </span>
            <span class="font-bold text-indigo-600 dark:text-indigo-400">
              {{ rateData.byModality.Remoto }} post.
            </span>
          </div>
          <div
            class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-indigo-500 rounded-full transition-all duration-300"
              :style="{
                width: `${Math.min((rateData.byModality.Remoto / 16) * 100, 100)}%`,
              }"
            ></div>
          </div>
        </div>

        <!-- Híbrido -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span
              class="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-xs text-purple-500"
                >domain</span
              >
              Híbrido Regional
            </span>
            <span class="font-bold text-purple-600 dark:text-purple-400">
              {{ rateData.byModality.Híbrido }} post.
            </span>
          </div>
          <div
            class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-purple-500 rounded-full transition-all duration-300"
              :style="{
                width: `${Math.min((rateData.byModality.Híbrido / 16) * 100, 100)}%`,
              }"
            ></div>
          </div>
        </div>

        <!-- Presencial -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span
              class="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-xs text-emerald-500"
                >apartment</span
              >
              Presencial en Sitio
            </span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">
              {{ rateData.byModality.Presencial }} post.
            </span>
          </div>
          <div
            class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-emerald-500 rounded-full transition-all duration-300"
              :style="{
                width: `${Math.min((rateData.byModality.Presencial / 16) * 100, 100)}%`,
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Distribution Segments -->
    <div
      class="mt-6 pt-3 border-t border-outline-variant/30 dark:border-slate-800"
    >
      <p
        class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2"
      >
        Distribución de Vacantes según Volumen de Postulantes:
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div
          v-for="dist in rateData.distribution"
          :key="dist.range"
          class="bg-surface-container/60 dark:bg-slate-800/60 p-2.5 rounded-xl border border-outline-variant/30 dark:border-slate-800"
        >
          <p class="text-[10px] text-slate-400 dark:text-slate-500 truncate">
            {{ dist.range }}
          </p>
          <p
            class="text-xs font-bold text-on-surface dark:text-slate-100 mt-0.5"
          >
            {{ dist.count }} vacantes ({{ dist.percentage }}%)
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApplicationRateData } from "~/composables/useAdminAnalytics";

defineProps<{
  rateData: ApplicationRateData;
}>();
</script>
