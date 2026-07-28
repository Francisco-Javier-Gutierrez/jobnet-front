<template>
  <div class="w-full max-w-md" role="main">
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8"
    >
      <div class="text-center mb-6 flex flex-col items-center">
        <NuxtLink
          to="/"
          class="inline-block mb-3"
          aria-label="Volver al inicio"
        >
          <img
            src="/logo.svg"
            alt="Logotipo de JobNet"
            class="h-20 sm:h-24 w-auto filter brightness-100 dark:brightness-0 dark:invert transition-all hover:scale-105"
          />
        </NuxtLink>
        <h1
          class="text-xl sm:text-2xl font-bold tracking-tight text-on-background dark:text-slate-100 mt-1"
        >
          Recuperar contraseña
        </h1>
        <div class="mt-2 w-full text-left">
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

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div
          v-if="errorMessage"
          id="forgot-error"
          role="alert"
          aria-live="assertive"
          class="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-3 rounded-lg text-sm flex items-start gap-2"
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
          id="forgot-success"
          role="status"
          aria-live="polite"
          class="bg-secondary/10 border border-secondary/20 text-secondary dark:text-emerald-400 p-3 rounded-lg text-sm flex items-start gap-2"
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
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
            for="email"
          >
            Ingrese su correo electrónico
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            aria-required="true"
            :aria-invalid="!!errorMessage"
            :aria-describedby="
              errorMessage
                ? 'forgot-error'
                : successMessage
                  ? 'forgot-success'
                  : undefined
            "
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
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
          <span v-else>Enviar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
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
