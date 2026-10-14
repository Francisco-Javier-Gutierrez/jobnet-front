<template>
  <div
    class="max-w-4xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <div class="mb-6 flex items-center justify-between">
      <button
        @click="goBack"
        class="inline-flex items-center gap-1.5 text-primary hover:text-primary-container text-xs font-bold transition px-3 py-1.5 bg-primary/10 rounded-xl"
      >
        <span class="material-symbols-outlined text-sm">arrow_back</span>
        Volver a Edición
      </button>

      <div
        class="px-3 py-1.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-xl text-xs font-bold flex items-center gap-1.5"
      >
        <span class="material-symbols-outlined text-sm">visibility</span>
        Modo Previsualización
      </div>
    </div>

    <div v-if="post" class="max-w-xl mx-auto">
      <PostCard :post="post" :is-detail="true" />
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-3xl shadow-sm px-6"
    >
      <div
        class="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-4"
      >
        <span class="material-symbols-outlined text-[32px]">error</span>
      </div>
      <h2 class="text-lg font-bold text-on-background mb-2">
        Previsualización no encontrada
      </h2>
      <p
        class="text-on-surface-variant dark:text-slate-300 text-xs max-w-sm mb-6"
      >
        No se encontraron datos en borrador para mostrar la previsualización.
      </p>
      <button
        @click="goBack"
        class="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-xl text-sm font-bold transition shadow-md"
      >
        Regresar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { usePreviewStore } from "~/stores/preview";

const router = useRouter();
const previewStore = usePreviewStore();

const post = computed(() => previewStore.previewPost);

const goBack = () => {
  router.back();
};

useSeoMeta({
  title: "Previsualización de Publicación - JobNet",
});
</script>
