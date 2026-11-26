<template>
  <div
    v-if="anomalies && anomalies.length > 0"
    class="anomalous-concurrency-container relative overflow-hidden rounded-2xl border-2 border-rose-500/90 bg-rose-50/95 dark:bg-rose-950/40 p-4 sm:p-5 shadow-xl shadow-rose-500/15 mb-6 transition-all duration-300"
    role="alert"
    aria-live="assertive"
  >
    <!-- Top Hazard Bar (Parpadeo y Encabezado Crítico) -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-rose-200/80 dark:border-rose-900/60"
    >
      <div class="flex items-center gap-3">
        <!-- Parpadeo / Flashing Beacon -->
        <span class="relative flex h-3.5 w-3.5 flex-shrink-0">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-90"
          ></span>
          <span
            class="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600 animate-pulse"
          ></span>
        </span>

        <div class="flex flex-wrap items-center gap-2">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm animate-pulse"
          >
            <span class="material-symbols-outlined text-[14px]">emergency</span>
            <span>Alerta de Concurrencia Anómala</span>
          </span>
          <span class="text-xs font-semibold text-rose-800 dark:text-rose-200">
            {{ anomalies.length }}
            {{
              anomalies.length === 1
                ? "amenaza detectada"
                : "amenazas detectadas"
            }}
            en &lt; 1 hora (Prevención de Spam, Bots y Fraude)
          </span>
        </div>
      </div>

      <div
        class="flex items-center gap-2 text-xs font-medium text-rose-700 dark:text-rose-300"
      >
        <span class="material-symbols-outlined text-[16px] animate-spin"
          >autorenew</span
        >
        <span>Detección automática de patrones</span>
      </div>
    </div>

    <!-- Lista de Organizaciones con Actividad Concurrente Inusual -->
    <div class="space-y-3.5">
      <div
        v-for="item in anomalies"
        :key="item.id"
        class="bg-white/95 dark:bg-slate-900/90 border border-rose-300/80 dark:border-rose-800/80 rounded-xl p-4 shadow-sm hover:border-rose-500 transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <!-- Info Column -->
        <div class="space-y-1.5 flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <!-- Anomaly Type Badge -->
            <span
              v-if="
                item.category === 'BOT_SPAM' || item.type === 'RAPID_VACANCIES'
              "
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700"
            >
              <span class="material-symbols-outlined text-[13px]"
                >smart_toy</span
              >
              <span>Posible Bot / Spam de Vacantes</span>
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300/80 dark:border-rose-700"
            >
              <span class="material-symbols-outlined text-[13px]">warning</span>
              <span>Avalancha de Reportes / Fraude Masivo</span>
            </span>

            <!-- Threshold Exceeded Chip -->
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              <span class="material-symbols-outlined text-[12px] text-rose-500"
                >speed</span
              >
              <span
                >{{ item.count }} / Umbral: >{{ item.threshold }} ({{
                  item.timeWindow
                }})</span
              >
            </span>

            <span class="text-[11px] text-slate-600 dark:text-slate-300">
              {{ formatDetectedAt(item.detectedAt) }}
            </span>
          </div>

          <!-- Org Title & Description -->
          <div>
            <h4
              class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate"
            >
              <span class="material-symbols-outlined text-rose-600 text-[18px]"
                >corporate_fare</span
              >
              <span class="truncate">{{ item.organizationName }}</span>
              <span
                class="text-[11px] font-mono text-slate-600 dark:text-slate-300 font-normal"
                >({{ item.organizationId }})</span
              >
            </h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {{ item.description }}
            </p>
          </div>
        </div>

        <!-- Remediation Actions Column -->
        <div
          class="flex flex-wrap items-center gap-2 self-start lg:self-auto flex-shrink-0"
        >
          <!-- Primary Action: Sancionar / Congelar Preventivamente -->
          <button
            type="button"
            @click="handleSanction(item)"
            class="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition"
            title="Poner en revisión o suspender organización para evitar fraude o spam"
          >
            <span class="material-symbols-outlined text-[16px]">gavel</span>
            <span>Congelar Organización</span>
          </button>

          <!-- Audit Link -->
          <NuxtLink
            to="/mod/incidents"
            class="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition"
            title="Auditar denuncias y expediente de la organización"
          >
            <span class="material-symbols-outlined text-[16px]">policy</span>
            <span>Auditar</span>
          </NuxtLink>

          <!-- Dismiss Action -->
          <button
            type="button"
            @click="handleDismiss(item.id)"
            class="p-2 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Descartar esta alerta"
            aria-label="Descartar alerta"
          >
            <span class="material-symbols-outlined text-[18px]">close</span>
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
  (e: "sanction", org: { id: string; nombre: string; reason?: string }): void;
  (e: "dismiss", id: string): void;
}>();

const handleSanction = (item: AnomalyAlert) => {
  emit("sanction", {
    id: item.organizationId,
    nombre: item.organizationName,
    reason: `${item.title}: ${item.description}`,
  });
};

const handleDismiss = (id: string) => {
  emit("dismiss", id);
};

const formatDetectedAt = (value: string): string => {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Fecha de detección no disponible";

  const elapsedMinutes = Math.max(
    0,
    Math.round((Date.now() - timestamp) / 60000),
  );

  if (elapsedMinutes < 1) return "Detectado hace menos de un minuto";
  if (elapsedMinutes < 60) return `Detectado hace ${elapsedMinutes} min`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `Detectado hace ${elapsedHours} h`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  return `Detectado hace ${elapsedDays} d`;
};
</script>

<style scoped>
@keyframes alert-hazard-blink {
  0%,
  100% {
    border-color: rgba(244, 63, 94, 0.95);
    box-shadow: 0 0 16px rgba(244, 63, 94, 0.28);
  }
  50% {
    border-color: rgba(244, 63, 94, 0.35);
    box-shadow: 0 0 4px rgba(244, 63, 94, 0.08);
  }
}

.anomalous-concurrency-container {
  animation: alert-hazard-blink 2.2s infinite ease-in-out;
}
</style>
