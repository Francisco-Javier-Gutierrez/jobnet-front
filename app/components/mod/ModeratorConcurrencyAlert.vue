<template>
  <div
    v-if="anomalies && anomalies.length > 0"
    class="relative overflow-hidden rounded-2xl border border-amber-500/60 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-950/20 p-4 sm:p-5 shadow-sm mb-6 transition-all duration-200"
    role="alert"
    aria-live="polite"
  >
    <!-- Header: Sober, compact, without exaggerations -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-3 border-b border-amber-200/70 dark:border-amber-900/40"
    >
      <div class="flex items-center gap-2.5">
        <span class="relative flex h-2.5 w-2.5 flex-shrink-0">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"
          ></span>
        </span>

        <h3
          class="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">warning</span>
          <span>Concurrencia anómala detectada</span>
        </h3>

        <span
          class="text-[11px] font-medium text-amber-800/80 dark:text-amber-300/80"
        >
          {{ anomalies.length }}
          {{ anomalies.length === 1 ? "caso inusual" : "casos inusuales" }}
          (&lt; 1 hora)
        </span>
      </div>

      <div
        class="text-[11px] text-amber-800/70 dark:text-amber-300/70 flex items-center gap-1"
      >
        <span class="material-symbols-outlined text-xs">shield</span>
        <span>Panel del Moderador</span>
      </div>
    </div>

    <!-- Anomalies list -->
    <div class="space-y-3">
      <div
        v-for="item in anomalies"
        :key="item.id"
        class="bg-surface dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs hover:border-amber-400 dark:hover:border-amber-600 transition"
      >
        <!-- Info column -->
        <div class="space-y-1 flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-1.5">
            <!-- Anomaly Category Badge -->
            <span
              v-if="item.category === 'BOT_SPAM' || item.type === 'RAPID_VACANCIES'"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-800"
            >
              <span class="material-symbols-outlined text-xs">smart_toy</span>
              <span>Spam / Bot de Vacantes</span>
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-300/60 dark:border-rose-800"
            >
              <span class="material-symbols-outlined text-xs">report</span>
              <span>Avalancha de Reportes</span>
            </span>

            <!-- Threshold Chip -->
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-surface-container-low dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 border border-outline-variant/40"
            >
              <span>{{ item.count }} / Umbral: >{{ item.threshold }} ({{ item.timeWindow }})</span>
            </span>
          </div>

          <!-- Title and Description -->
          <div>
            <h4
              class="text-xs font-bold text-on-surface dark:text-slate-100 flex items-center gap-1.5 truncate"
            >
              <span class="material-symbols-outlined text-xs text-amber-600">corporate_fare</span>
              <span class="truncate">{{ item.organizationName }}</span>
              <span
                class="text-[10px] font-mono text-on-surface-variant/70 dark:text-slate-400 font-normal"
                >({{ item.organizationId }})</span
              >
            </h4>
            <p class="text-[11px] text-on-surface-variant dark:text-slate-300 mt-0.5">
              {{ item.description }}
            </p>
          </div>
        </div>

        <!-- Moderator actions -->
        <div class="flex items-center gap-2 flex-shrink-0 self-start md:self-auto">
          <!-- Action: Pausar preventivamente -->
          <button
            type="button"
            @click="handlePause(item)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold rounded-lg shadow-xs transition"
            title="Pausar preventivamente la cuenta y colocarla en estado de revisión"
          >
            <span class="material-symbols-outlined text-[15px]">pause_circle</span>
            <span>Pausar preventivamente</span>
          </button>

          <!-- Dismiss button -->
          <button
            type="button"
            @click="handleDismiss(item.id)"
            class="p-1.5 text-on-surface-variant hover:text-on-surface dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-surface-container-low dark:hover:bg-slate-800 transition"
            title="Descartar esta alerta"
            aria-label="Descartar alerta"
          >
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AnomalyAlert } from "~/composables/useAdminAnalytics";

const props = defineProps<{
  anomalies: AnomalyAlert[];
}>();

const emit = defineEmits<{
  (e: "pause", org: { id: string; nombre: string; reason?: string }): void;
  (e: "dismiss", id: string): void;
}>();

const handlePause = (item: AnomalyAlert) => {
  emit("pause", {
    id: item.organizationId,
    nombre: item.organizationName,
    reason: `Pausado preventivamente por concurrencia anómala: ${item.title} (${item.count} en ${item.timeWindow})`,
  });
};

const handleDismiss = (id: string) => {
  emit("dismiss", id);
};
</script>
