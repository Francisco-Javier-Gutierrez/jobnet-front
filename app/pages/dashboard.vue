<template>
  <div
    class="max-w-6xl mx-auto px-4 py-16 text-center text-on-surface-variant dark:text-slate-400"
  >
    <span
      class="material-symbols-outlined text-4xl animate-spin text-primary mb-3"
      >sync</span
    >
    <p class="text-sm font-medium">Redirigiendo al panel correspondiente...</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { data: sessionData } = useAuth();

const userRole = computed(() => {
  return ((sessionData.value?.user as any)?.tipoUsuario || "").toUpperCase();
});

const targetPath =
  userRole.value === "ADMIN"
    ? "/admin/analytics"
    : userRole.value === "MODERATOR" || userRole.value === "MODERADOR"
      ? "/mod/incidents"
      : "/applicants";

await navigateTo(
  {
    path: targetPath,
    query: route.query,
  },
  { replace: true },
);
</script>
