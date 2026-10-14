<template>
  <div
    class="bg-gradient-to-r from-primary/10 via-surface-container-lowest to-secondary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between shadow-sm"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold"
      >
        <span class="material-symbols-outlined text-xl">work</span>
      </div>
      <div class="text-left">
        <h3 class="text-xs font-bold text-on-background">Bolsa de Vacantes</h3>
        <p class="text-[11px] text-on-surface-variant dark:text-slate-300">
          Explora las ofertas activas y postúlate
        </p>
      </div>
    </div>
    <NuxtLink
      to="/vacancies"
      class="px-3.5 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm active:scale-95 flex-shrink-0"
    >
      <span>Ver Vacantes</span>
      <span class="material-symbols-outlined text-sm">arrow_forward</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts"></script>
