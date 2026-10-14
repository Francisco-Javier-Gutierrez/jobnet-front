<template>
  <div
    class="max-w-6xl mx-auto px-4 py-16 text-center text-on-surface-variant dark:text-slate-400"
  >
    <span
      class="material-symbols-outlined text-4xl animate-spin text-primary mb-3"
      >sync</span
    >
    <p class="text-sm font-medium">Redirigiendo al Tablero ATS...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  redirect: "/applicants",
});

const route = useRoute();
await navigateTo(
  {
    path: "/applicants",
    query: route.query,
  },
  { replace: true },
);
</script>
