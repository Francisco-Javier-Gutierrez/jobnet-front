<template>
  <div
    v-if="showAuthModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300"
  >
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl text-center space-y-5 transform transition-all scale-100"
    >
      <div
        class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner"
      >
        <span class="material-symbols-outlined text-3xl">lock</span>
      </div>
      <div class="space-y-2">
        <h3 class="text-lg font-bold text-on-background">Acción Protegida</h3>
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
        >
          Para dar me gusta, guardar en marcadores o interactuar con
          publicaciones, necesitas contar con una cuenta profesional en JobNet.
        </p>
      </div>
      <div class="grid grid-cols-2 gap-3 pt-2">
        <button
          @click="$emit('close')"
          class="bg-slate-100 hover:bg-slate-200 text-on-surface-variant dark:text-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl transition"
        >
          Cancelar
        </button>
        <button
          @click="$emit('login')"
          class="bg-primary hover:bg-primary-container text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-sm"
        >
          Iniciar Sesión
        </button>
      </div>
      <p class="text-[10px] text-on-surface-variant dark:text-slate-300/70">
        ¿Aún no tienes cuenta?
        <NuxtLink to="/register" class="text-primary font-bold hover:underline"
          >Registrarse</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  showAuthModal: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "login"): void;
}>();
</script>
