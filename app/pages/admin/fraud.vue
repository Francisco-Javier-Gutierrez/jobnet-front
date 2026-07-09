<template>
  <div class="max-w-4xl mx-auto px-4 py-8 w-full">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">
        Reportes de Fraude (Administrador)
      </h1>
      <p class="text-slate-400 text-sm">
        Monitorea y audita los registros de bloqueos históricos y sospechas de
        fraude.
      </p>
    </div>

    <div
      class="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden p-6 text-center text-slate-500"
    >
      <span class="material-symbols-outlined text-[48px] text-slate-700 mb-4"
        >find_in_page</span
      >
      <p class="text-sm font-semibold text-slate-400">Todo en orden</p>
      <p class="text-xs text-slate-500 mt-1">
        No hay alertas de fraude activas o actividades sospechosas detectadas
        por el sistema.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use layout admin
definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "Reportes de Fraude - Administrador",
});
</script>
