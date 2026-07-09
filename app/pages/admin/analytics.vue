<template>
  <div
    class="max-w-4xl mx-auto px-6 py-8 w-full bg-slate-50 min-h-screen text-slate-800"
  >
    <div class="mb-8">
      <h1
        class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        Analítica de Negocio
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        Monitorea los KPI clave de crecimiento, registros de usuarios y
        postulaciones.
      </p>
    </div>

    <!-- Charts simulator -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <span class="text-xs text-slate-400 font-bold uppercase tracking-wider"
          >Crecimiento Mensual</span
        >
        <p class="text-2xl font-extrabold text-slate-900 mt-2">+43.2%</p>
        <div class="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
          <div
            class="bg-indigo-600 h-full rounded-full"
            style="width: 75%"
          ></div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <span class="text-xs text-slate-400 font-bold uppercase tracking-wider"
          >Tasa de Conversión</span
        >
        <p class="text-2xl font-extrabold text-slate-900 mt-2">18.4%</p>
        <div class="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
          <div
            class="bg-emerald-500 h-full rounded-full"
            style="width: 58%"
          ></div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <span class="text-xs text-slate-400 font-bold uppercase tracking-wider"
          >Usuarios Activos</span
        >
        <p class="text-2xl font-extrabold text-slate-900 mt-2">1,248</p>
        <div class="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
          <div
            class="bg-amber-500 h-full rounded-full"
            style="width: 89%"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use layout admin
definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "Analítica de Negocio - Administrador",
});
</script>
