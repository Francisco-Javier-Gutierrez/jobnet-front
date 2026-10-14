<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4"
    >
      <div
        class="w-12 h-12 bg-indigo-600/10 text-indigo-600 rounded-xl flex items-center justify-center"
      >
        <span class="material-symbols-outlined">domain</span>
      </div>
      <div>
        <span
          class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider"
          >Total Organizaciones</span
        >
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {{ orgsLength }}
        </h2>
      </div>
    </div>

    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4"
    >
      <div
        class="w-12 h-12 bg-emerald-600/10 text-emerald-600 rounded-xl flex items-center justify-center"
      >
        <span class="material-symbols-outlined">verified</span>
      </div>
      <div>
        <span
          class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider"
          >Verificadas</span
        >
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {{ verifiedCount }}
        </h2>
      </div>
    </div>

    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4"
    >
      <div
        class="w-12 h-12 bg-amber-600/10 text-amber-600 rounded-xl flex items-center justify-center"
      >
        <span class="material-symbols-outlined">gavel</span>
      </div>
      <div>
        <span
          class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider"
          >En Revisión</span
        >
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {{ inReviewCount }}
        </h2>
      </div>
    </div>

    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4"
    >
      <div
        class="w-12 h-12 bg-rose-600/10 text-rose-600 rounded-xl flex items-center justify-center"
      >
        <span class="material-symbols-outlined">block</span>
      </div>
      <div>
        <span
          class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider"
          >Suspendidas</span
        >
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {{ suspendedCount }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  orgsLength: number;
  verifiedCount: number;
  inReviewCount: number;
  suspendedCount: number;
}>();
</script>
