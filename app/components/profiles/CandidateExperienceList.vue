<template>
  <div>
    <h2
      class="font-headline-md text-headline-md text-on-background dark:text-slate-100 mb-md flex items-center gap-sm border-b border-surface-container dark:border-slate-800 pb-sm"
    >
      <span
        class="material-symbols-outlined text-indigo-600 dark:text-indigo-400"
        >work</span
      >
      Trayectoria Laboral
    </h2>

    <div v-if="experiencia && experiencia.length > 0" class="space-y-4">
      <div
        v-for="(exp, idx) in experiencia"
        :key="exp.id || idx"
        class="bg-surface-container-low/40 dark:bg-slate-800/40 border border-outline-variant/40 dark:border-slate-800 p-4 rounded-xl space-y-1 relative"
      >
        <div class="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h3
              class="font-bold text-sm text-on-background dark:text-slate-100"
            >
              {{ exp.puesto || "Cargo no especificado" }}
            </h3>
            <p
              class="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
            >
              {{ exp.organización || "Organización" }}
            </p>
          </div>
          <span
            class="text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800"
          >
            {{ exp.fechaInicio || "Inicio" }} —
            {{ exp.actualmente ? "Presente" : exp.fechaFin || "Fin" }}
          </span>
        </div>
        <p
          v-if="exp.descripcion"
          class="text-xs text-on-surface-variant dark:text-slate-300 mt-2 leading-relaxed whitespace-pre-line"
        >
          {{ exp.descripcion }}
        </p>
      </div>
    </div>
    <p
      v-else
      class="font-body-md text-body-md text-on-surface-variant dark:text-slate-400 italic"
    >
      No se ha registrado experiencia laboral en el historial.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ExperienciaItem } from "~/types";

defineProps<{
  experiencia: ExperienciaItem[];
}>();
</script>
