<template>
  <div
    class="bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <main class="max-w-3xl mx-auto px-4 py-10 sm:py-14">
      <!-- Back link -->
      <button
        @click="router.back()"
        class="inline-flex items-center gap-1.5 text-primary hover:text-primary-container text-xs font-bold transition px-3 py-1.5 bg-primary/10 rounded-xl mb-8 cursor-pointer"
      >
        <span class="material-symbols-outlined text-sm">arrow_back</span>
        Volver
      </button>

      <article
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8"
      >
        <!-- Header -->
        <header class="space-y-3 border-b border-outline-variant/30 pb-6">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-3xl text-primary"
              >gavel</span
            >
            <h1
              class="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight"
            >
              Términos y Condiciones de Uso
            </h1>
          </div>
          <p class="text-xs text-on-surface-variant dark:text-slate-400">
            Última actualización: 13 de agosto de 2026
          </p>
        </header>

        <!-- Content -->
        <AppTermsContent />
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

useSeoMeta({
  title: "Términos y Condiciones - JobNet",
  description:
    "Términos y condiciones de uso de la plataforma JobNet. Conoce tus derechos y obligaciones como usuario.",
});
</script>
