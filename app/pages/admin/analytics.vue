<template>
  <div class="max-w-4xl mx-auto px-4 py-8 w-full">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">
        Analítica de Negocio (Administrador)
      </h1>
      <p class="text-slate-400 text-sm">
        Monitorea los KPI clave de crecimiento, registros de usuarios y
        postulaciones.
      </p>
    </div>

    <!-- Charts simulator -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
        <span class="text-xs text-slate-400 font-bold uppercase tracking-wider"
          >Crecimiento Mensual</span
        >
        <p class="text-2xl font-extrabold text-white mt-2">+43.2%</p>
        <div class="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
          <div
            class="bg-indigo-500 h-full rounded-full"
            style="width: 75%"
          ></div>
        </div>
      </div>
      <div class="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
        <span class="text-xs text-slate-400 font-bold uppercase tracking-wider"
          >Tasa de Conversión</span
        >
        <p class="text-2xl font-extrabold text-white mt-2">18.4%</p>
        <div class="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
          <div
            class="bg-emerald-500 h-full rounded-full"
            style="width: 58%"
          ></div>
        </div>
      </div>
      <div class="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
        <span class="text-xs text-slate-400 font-bold uppercase tracking-wider"
          >Usuarios Activos</span
        >
        <p class="text-2xl font-extrabold text-white mt-2">1,248</p>
        <div class="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
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
useSeoMeta({
  title: "Analítica de Negocio - Administrador",
});
</script>
