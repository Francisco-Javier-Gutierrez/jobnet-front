<template>
  <div
    class="min-h-screen bg-background text-on-background flex items-center justify-center p-4"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(53,37,205,0.06),transparent_40%)] pointer-events-none"
      aria-hidden="true"
    ></div>

    <div class="w-full max-w-md relative z-10" role="main">
      <div
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm p-8 flex flex-col gap-6"
      >
        <div class="text-center flex flex-col items-center">
          <NuxtLink
            to="/"
            class="inline-block mb-4"
            aria-label="Volver al inicio"
          >
            <img src="/logo.svg" alt="Logotipo de JobNet" class="h-24 w-auto" />
          </NuxtLink>
          <h1 class="text-2xl font-bold tracking-tight text-on-background">
            Nueva contraseña
          </h1>
          <div class="mt-3 w-full text-left">
            <NuxtLink
              to="/login"
              class="font-semibold text-primary hover:underline transition text-sm inline-flex items-center gap-1"
              aria-label="Volver a la pantalla de inicio de sesión"
            >
              <span class="material-symbols-outlined text-sm" aria-hidden="true"
                >arrow_back</span
              >
              Volver al inicio de sesión
            </NuxtLink>
          </div>
        </div>

        <form @submit.prevent="handleReset" class="space-y-5">
          <div
            v-if="errorMessage"
            id="reset-error"
            role="alert"
            aria-live="assertive"
            class="bg-rose-500/10 border border-rose-500/20 text-rose-600 p-3 rounded-lg text-sm flex items-start gap-2"
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
            class="bg-secondary/10 border border-secondary/20 text-secondary p-3 rounded-lg text-sm flex items-start gap-2"
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
              class="block text-xs font-semibold tracking-wider text-on-surface-variant mb-2"
              for="code"
            >
              Ingrese el código de confirmación
            </label>
            <input
              id="code"
              v-model="code"
              type="text"
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
              class="w-full bg-[#F1F5F9] border border-[#F1F5F9] hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background outline-none transition-colors"
            />
          </div>

          <div>
            <label
              class="block text-xs font-semibold tracking-wider text-on-surface-variant mb-2"
              for="password"
            >
              Ingrese su nueva contraseña
            </label>
            <input
              id="password"
              v-model="newPassword"
              type="password"
              required
              aria-required="true"
              :aria-invalid="!!errorMessage"
              class="w-full bg-[#F1F5F9] border border-[#F1F5F9] hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background outline-none transition-colors"
            />
          </div>

          <div>
            <label
              class="block text-xs font-semibold tracking-wider text-on-surface-variant mb-2"
              for="confirm_password"
            >
              Ingrese nuevamente su contraseña
            </label>
            <input
              id="confirm_password"
              v-model="confirmPassword"
              type="password"
              required
              aria-required="true"
              :aria-invalid="!!errorMessage"
              class="w-full bg-[#F1F5F9] border border-[#F1F5F9] hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            :aria-busy="loading"
            class="w-full h-12 bg-primary hover:bg-primary-container disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 transition shadow-sm hover:shadow"
          >
            <span
              v-if="loading"
              class="material-symbols-outlined animate-spin text-lg"
              aria-hidden="true"
              >progress_activity</span
            >
            <span v-else>Actualizar</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-on-surface-variant">
            ¿No recibiste el código?
            <button
              type="button"
              @click="handleResend"
              :disabled="resendLoading"
              :aria-busy="resendLoading"
              aria-label="Reenviar el código de restablecimiento por correo"
              class="font-semibold text-primary hover:underline transition ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ resendLoading ? "Reenviando..." : "Reenviar" }}
            </button>
          </p>
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
const resendLoading = ref(false);
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

const handleResend = async () => {
  if (!email.value) {
    errorMessage.value =
      "El correo electrónico es requerido para reenviar el código. Vuelve a iniciar el proceso.";
    return;
  }

  resendLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const res = await $fetch("/api/auth/forgot-password", {
      method: "POST",
      body: { email: email.value },
    });
    if (res.success) {
      successMessage.value = "Código reenviado con éxito. Revisa tu correo.";
    }
  } catch (error: any) {
    errorMessage.value =
      error.data?.message || error.message || "Error al reenviar el código";
  } finally {
    resendLoading.value = false;
  }
};
</script>
