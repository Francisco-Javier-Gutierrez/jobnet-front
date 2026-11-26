<template>
  <!-- Dashboard Quick Stats KPIs -->
  <AppSkeletonLoader
    v-if="isLoading"
    type="stats"
    :count="4"
    class="mb-6"
    label="Cargando resumen de postulantes..."
  />
  <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 shadow-sm flex items-center gap-3"
    >
      <div
        class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0"
      >
        <span class="material-symbols-outlined text-xl">pending_actions</span>
      </div>
      <div>
        <span
          class="text-xs text-on-surface-variant dark:text-slate-400 font-medium block"
          >Pendientes</span
        >
        <span class="text-lg font-bold text-on-background">{{
          countByStatus("PENDIENTE")
        }}</span>
      </div>
    </div>

    <div
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 shadow-sm flex items-center gap-3"
    >
      <div
        class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0"
      >
        <span class="material-symbols-outlined text-xl">record_voice_over</span>
      </div>
      <div>
        <span
          class="text-xs text-on-surface-variant dark:text-slate-400 font-medium block"
          >En Contacto</span
        >
        <span class="text-lg font-bold text-on-background">{{
          countByStatus("EN_CONTACTO")
        }}</span>
      </div>
    </div>

    <div
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 shadow-sm flex items-center gap-3"
    >
      <div
        class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0"
      >
        <span class="material-symbols-outlined text-xl">verified</span>
      </div>
      <div>
        <span
          class="text-xs text-on-surface-variant dark:text-slate-400 font-medium block"
          >Seleccionados</span
        >
        <span class="text-lg font-bold text-on-background">{{
          countByStatus("SELECCIONADO")
        }}</span>
      </div>
    </div>

    <div
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 shadow-sm flex items-center gap-3"
    >
      <div
        class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0"
      >
        <span class="material-symbols-outlined text-xl">handshake</span>
      </div>
      <div>
        <span
          class="text-xs text-on-surface-variant dark:text-slate-400 font-medium block"
          >Contratados</span
        >
        <span class="text-lg font-bold text-on-background">{{
          countByStatus("CONTRATADO")
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApplicants } from "~/composables/useApplicants";
const { candidates, countByStatus, isLoading } = useApplicants();
</script>
