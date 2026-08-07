<template>
  <div>
    <h2 class="font-headline-md text-headline-md text-on-background dark:text-slate-100 mb-md flex items-center gap-sm border-b border-surface-container dark:border-slate-800 pb-sm">
      <span class="material-symbols-outlined text-purple-600 dark:text-purple-400">school</span>
      Formación Académica
    </h2>

    <div v-if="educacion && educacion.length > 0" class="space-y-4">
      <div
        v-for="(edu, idx) in educacion"
        :key="edu.id || idx"
        class="bg-surface-container-low/40 dark:bg-slate-800/40 border border-outline-variant/40 dark:border-slate-800 p-4 rounded-xl space-y-1 relative"
      >
        <div class="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h3 class="font-bold text-sm text-on-background dark:text-slate-100">
              {{ edu.grado || "Grado Académico" }}
            </h3>
            <p class="text-xs font-semibold text-purple-600 dark:text-purple-400">
              {{ edu.institucion || "Institución Educativa" }}
            </p>
          </div>
          <span class="text-[11px] font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
            {{ edu.anioInicio || "Año Inicio" }} —
            {{ edu.enCurso ? "En curso" : edu.anioGraduacion || "Graduación" }}
          </span>
        </div>
      </div>
    </div>
    <p v-else class="font-body-md text-body-md text-on-surface-variant dark:text-slate-400 italic">
      No se ha registrado formación académica en el historial.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  educacion: any[];
}>();
</script>
