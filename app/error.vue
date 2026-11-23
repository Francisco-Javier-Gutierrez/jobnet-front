<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center p-6 font-sans transition-colors duration-200"
  >
    <div
      class="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl"
    >
      <div
        class="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/60 rounded-full flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400"
      >
        <span class="material-symbols-outlined text-4xl">{{ iconName }}</span>
      </div>

      <div class="space-y-2">
        <h1
          class="text-6xl font-black tracking-tight text-indigo-600 dark:text-indigo-400"
        >
          {{ statusCode }}
        </h1>
        <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">
          {{ title }}
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          {{ message }}
        </p>
      </div>

      <button
        @click="handleError"
        class="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition active:scale-95 duration-100"
      >
        <span class="material-symbols-outlined text-lg">home</span>
        Volver al Inicio
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
});

const statusCode = computed(() => Number(props.error?.statusCode) || 404);
const is404 = computed(() => statusCode.value === 404);

const iconName = computed(() => (is404.value ? "search_off" : "error"));

const title = computed(() => {
  if (is404.value) return "Página no encontrada";
  return props.error?.statusMessage || "Ocurrió un error inesperado";
});

const message = computed(() => {
  if (is404.value) {
    return "La dirección a la que intentas acceder no existe o no está disponible en este momento.";
  }
  return (
    props.error?.message ||
    "Hemos registrado este inconveniente y estamos trabajando para solucionarlo."
  );
});

const handleError = () => {
  clearError({ redirect: "/" });
};
</script>
