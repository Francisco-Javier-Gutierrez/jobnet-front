<template>
  <div class="max-w-4xl mx-auto px-4 py-8 w-full">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">
        Catálogo Maestro (Administrador)
      </h1>
      <p class="text-slate-400 text-sm">
        Gestiona la lista maestra de habilidades técnicas sugeridas y sectores
        industriales.
      </p>
    </div>

    <div
      class="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden p-6 text-center text-slate-500"
    >
      <span class="material-symbols-outlined text-[48px] text-slate-700 mb-4"
        >layers</span
      >
      <p class="text-sm font-semibold text-slate-400">
        Catálogos de Habilidades y Sectores cargados
      </p>
      <p class="text-xs text-slate-500 mt-1">
        El catálogo se gestiona de forma automática en base a las postulaciones.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Catálogo Maestro - Administrador",
});
</script>
