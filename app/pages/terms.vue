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
          <div
            class="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant dark:text-slate-400"
          >
            <span>Última actualización: {{ currentTerms.effectiveDate }}</span>
            <span
              v-if="currentTerms.version"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20"
            >
              Versión {{ currentTerms.version }}
            </span>
            <span
              v-if="loading"
              class="inline-flex items-center gap-1 text-[11px] text-on-surface-variant animate-pulse"
            >
              <span
                class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"
              ></span>
              Sincronizando...
            </span>
          </div>
        </header>

        <!-- Summary Banner of changes / active policies -->
        <div
          v-if="currentTerms.summary"
          class="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-start gap-3 shadow-sm"
        >
          <span
            class="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5"
            >info</span
          >
          <div class="text-xs space-y-1">
            <p class="font-bold text-on-background dark:text-slate-200">
              Resumen de Políticas Vigentes
            </p>
            <p
              class="text-on-surface-variant dark:text-slate-300 leading-relaxed"
            >
              {{ currentTerms.summary }}
            </p>
          </div>
        </div>

        <!-- Content -->
        <AppTermsContent />
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter, useSeoMeta } from "#imports";
import { useTerms } from "~/composables/useTerms";

const router = useRouter();
const { currentTerms, loading, fetchCurrentTerms } = useTerms();

onMounted(() => {
  fetchCurrentTerms();
});

useSeoMeta({
  title: "Términos y Condiciones - JobNet",
  description:
    "Términos y condiciones de uso de la plataforma JobNet. Conoce tus derechos y obligaciones como usuario.",
});
</script>
