<template>
  <div
    class="max-w-5xl mx-auto px-6 py-8 w-full bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-200"
  >
    <div class="mb-8">
      <h1
        class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        Reportes de Fraude (Administrador)
      </h1>
      <p
        class="text-slate-500 dark:text-slate-400 text-sm mt-1"
      >
        Monitorea y audita los registros de bloqueos históricos y sospechas de
        fraude de vacantes y organizaciones.
      </p>
    </div>

    <!-- Reusable Component -->
    <IncidentsPanel />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Reportes de Fraude - Administrador",
  description: "Monitorea y audita registros de bloqueos y sospechas de fraude."
});
</script>
