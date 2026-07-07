<template>
  <div
    class="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_40%)] pointer-events-none"
      aria-hidden="true"
    ></div>

    <div class="w-full max-w-md relative z-10" role="main">
      <div
        class="bg-slate-950 border border-slate-800 rounded-2xl shadow-xl p-8 flex flex-col gap-6"
      >
        <div class="text-center flex flex-col items-center">
          <NuxtLink
            to="/"
            class="inline-block mb-4"
            aria-label="Volver al inicio"
          >
            <img
              src="/logo.svg"
              alt="Logotipo de JobNet"
              class="h-12 w-auto filter brightness-0 invert"
            />
          </NuxtLink>
          <div
            class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-4"
            aria-hidden="true"
          >
            <span class="material-symbols-outlined text-2xl">lock_reset</span>
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-white">
            Crea una nueva contraseña
          </h1>
          <p class="text-sm text-slate-400 mt-2">
            Introduce el código recibido e ingresa tu nueva contraseña
          </p>
        </div>

        <form @submit.prevent="handleReset" class="space-y-5">
          <div
            v-if="errorMessage"
            id="reset-error"
            role="alert"
            aria-live="assertive"
            class="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-start gap-2"
          >
            <span
              class="material-symbols-outlined text-sm mt-0.5"
              aria-hidden="true"
              >error</span
            >
            <span>{{ errorMessage }}</span>
          </div>

          <div
            v-if="successMessage"
            id="reset-success"
            role="status"
            aria-live="polite"
            class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm flex items-start gap-2"
          >
            <span
              class="material-symbols-outlined text-sm mt-0.5"
              aria-hidden="true"
              >check_circle</span
            >
            <span>{{ successMessage }}</span>
          </div>

          <div>
            <label
              class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
              for="code"
            >
              Código de Confirmación
            </label>
            <div class="relative">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
                >dialpad</span
              >
              <input
                id="code"
                v-model="code"
                type="text"
                placeholder="Ingresa el código recibido"
                required
                aria-required="true"
                :aria-invalid="!!errorMessage"
                :aria-describedby="
                  errorMessage
                    ? 'reset-error'
                    : successMessage
                      ? 'reset-success'
                      : undefined
                "
                class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
              for="password"
            >
              Nueva Contraseña
            </label>
            <div class="relative">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
                >lock</span
              >
              <input
                id="password"
                v-model="newPassword"
                type="password"
                placeholder="Mínimo 8 caracteres"
                required
                aria-required="true"
                :aria-invalid="!!errorMessage"
                class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl pl-12 pr-4 py-3 text-sm text-white outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
              for="confirm_password"
            >
              Confirmar Nueva Contraseña
            </label>
            <div class="relative">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
                >lock_clock</span
              >
              <input
                id="confirm_password"
                v-model="confirmPassword"
                type="password"
                placeholder="Confirma tu nueva contraseña"
                required
                aria-required="true"
                :aria-invalid="!!errorMessage"
                class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl pl-12 pr-4 py-3 text-sm text-white outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            :aria-busy="loading"
            class="w-full h-12 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
          >
            <span
              v-if="loading"
              class="material-symbols-outlined animate-spin text-lg"
              aria-hidden="true"
              >progress_activity</span
            >
            <span v-else>Actualizar Contraseña</span>
          </button>
        </form>

        <div class="text-center pt-2">
          <NuxtLink
            to="/login"
            class="font-semibold text-emerald-400 hover:text-emerald-300 transition text-sm flex items-center justify-center gap-1"
            aria-label="Volver a la pantalla de inicio de sesión"
          >
            <span class="material-symbols-outlined text-sm" aria-hidden="true"
              >arrow_back</span
            >
            Volver al inicio de sesión
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Nueva Contraseña - JobNet",
  description: "Restablece tu contraseña en JobNet",
});

const route = useRoute();
const router = useRouter();

const email = ref((route.query.email as string) || "");
const code = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const handleReset = async () => {
  if (!email.value) {
    errorMessage.value =
      "El correo electrónico es requerido. Vuelve a iniciar el proceso.";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "Las contraseñas no coinciden";
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const res = await $fetch("/api/auth/reset-password", {
      method: "POST",
      body: {
        email: email.value,
        code: code.value,
        newPassword: newPassword.value,
      },
    });

    if (res.success) {
      successMessage.value =
        "¡Contraseña restablecida con éxito! Redirigiendo al inicio de sesión...";
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  } catch (error: any) {
    errorMessage.value =
      error.data?.message ||
      error.message ||
      "Código inválido o error al restablecer contraseña";
  } finally {
    loading.value = false;
  }
};
</script>
