<template>
  <div class="max-w-4xl mx-auto px-4 py-8 w-full">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">
        Soporte Directo (Moderador)
      </h1>
      <p class="text-slate-400 text-sm">
        Resuelve disputas de reclutamiento y atiende dudas de candidatos y
        empresas en tiempo real.
      </p>
    </div>

    <div
      class="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden p-6 text-center text-slate-500"
    >
      <span class="material-symbols-outlined text-[48px] text-slate-700 mb-4"
        >support</span
      >
      <p class="text-sm font-semibold text-slate-400">Sin chats activos</p>
      <p class="text-xs text-slate-500 mt-1">
        No hay tickets o solicitudes de soporte abiertas en la cola.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Soporte Directo - JobNet",
});
</script>
