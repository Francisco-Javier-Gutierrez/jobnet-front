<template>
  <div
    class="max-w-4xl mx-auto px-6 py-8 w-full bg-slate-50 min-h-screen text-slate-800"
  >
    <div class="mb-8">
      <h1
        class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        Reportes de Fraude
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        Monitorea y audita los registros de bloqueos históricos y sospechas de
        fraude.
      </p>
    </div>

    <div
      class="bg-white border border-slate-200 rounded-2xl overflow-hidden p-12 text-center text-slate-400 shadow-sm"
    >
      <span class="material-symbols-outlined text-[64px] text-slate-200 mb-4"
        >find_in_page</span
      >
      <h3 class="text-lg font-bold text-slate-800">Todo en orden</h3>
      <p class="text-sm text-slate-500 mt-2">
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
