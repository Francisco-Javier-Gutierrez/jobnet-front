<template>
  <div>
    <h2 class="font-headline-md text-headline-md text-on-background dark:text-slate-100 mb-md flex items-center gap-sm border-b border-surface-container pb-sm">
      <span class="material-symbols-outlined text-emerald-600 dark:text-emerald-400">psychology</span>
      Competencias Técnicas
    </h2>
    <div v-if="skills.length > 0" class="flex flex-wrap gap-2">
      <span
        v-for="skill in skills"
        :key="skill"
        class="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 shadow-sm"
      >
        {{ skill }}
      </span>
    </div>
    <p
      v-else
      class="font-body-md text-body-md text-on-surface-variant dark:text-slate-300 italic"
    >
      No se han seleccionado competencias técnicas aún.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  skills: string[];
}>();
</script>
