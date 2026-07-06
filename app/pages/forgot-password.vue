<template>
  <div
    class="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_40%)] pointer-events-none"
    ></div>

    <div class="w-full max-w-md relative z-10">
      <div
        class="bg-slate-950 border border-slate-800 rounded-2xl shadow-xl p-8"
      >
        <div class="text-center mb-8 flex flex-col items-center">
          <NuxtLink to="/" class="inline-block mb-4">
            <img
              src="/logo.svg"
              alt="JobNet"
              class="h-12 w-auto filter brightness-0 invert"
            />
          </NuxtLink>
          <div
            class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-4"
          >
            <span class="material-symbols-outlined text-2xl">lock_reset</span>
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-white">
            Recupera tu acceso
          </h1>
          <p class="text-sm text-slate-400 mt-2">
            Ingresa tu correo para recibir un código de restablecimiento
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div
            v-if="errorMessage"
            class="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-start gap-2"
          >
            <span class="material-symbols-outlined text-sm mt-0.5">error</span>
            <span>{{ errorMessage }}</span>
          </div>

          <div
            v-if="successMessage"
            class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm flex items-start gap-2"
          >
            <span class="material-symbols-outlined text-sm mt-0.5"
              >check_circle</span
            >
            <span>{{ successMessage }}</span>
          </div>

          <div>
            <label
              class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
              for="email"
            >
              Correo Electrónico
            </label>
            <div class="relative">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                >mail</span
              >
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="ejemplo@correo.com"
                required
                class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full h-12 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
          >
            <span
              v-if="loading"
              class="material-symbols-outlined animate-spin text-lg"
              >progress_activity</span
            >
            <span v-else>Enviar Código</span>
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-slate-800/60 text-center">
          <NuxtLink
            to="/login"
            class="font-semibold text-emerald-400 hover:text-emerald-300 transition text-sm flex items-center justify-center gap-1"
          >
            <span class="material-symbols-outlined text-sm">arrow_back</span>
            Volver al inicio de sesión
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Recuperar Acceso - JobNet",
  description: "Inicia el restablecimiento de contraseña en JobNet",
});

const email = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const router = useRouter();

const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const res = await $fetch("/api/auth/forgot-password", {
      method: "POST",
      body: { email: email.value },
    });

    if (res.success) {
      successMessage.value =
        "Código enviado. Redirigiendo a la pantalla de restablecimiento...";
      setTimeout(() => {
        router.push({
          path: "/reset-password",
          query: { email: email.value },
        });
      }, 1500);
    }
  } catch (error: any) {
    errorMessage.value =
      error.data?.message || error.message || "Error al enviar código";
  } finally {
    loading.value = false;
  }
};
</script>
