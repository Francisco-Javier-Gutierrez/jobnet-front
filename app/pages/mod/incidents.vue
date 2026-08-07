<template>
  <div
    class="max-w-5xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <div
      class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-on-background mb-1">
          Bandeja de Incidencias (Moderador)
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Audita y revisa los reportes de publicaciones de empleo e incidencias
          generadas en JobNet.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/mod/audit-logs"
          class="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">policy</span>
          <span>Tabla de Auditoría</span>
        </NuxtLink>
        <NuxtLink
          to="/mod/support"
          class="px-4 py-2 bg-surface border border-outline-variant hover:border-primary text-on-surface-variant dark:text-slate-300 hover:text-primary text-xs font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">forum</span>
          <span>Centro de Disputas</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Reusable Component -->
    <IncidentsPanel />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Bandeja de Incidencias - JobNet",
  description:
    "Bandeja de incidencias y reportes para moderadores y administradores en la plataforma JobNet",
});
</script>
