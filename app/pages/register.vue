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
        class="bg-slate-950 border border-slate-800 rounded-2xl shadow-xl p-8"
      >
        <div class="text-center mb-8 flex flex-col items-center">
          <NuxtLink
            to="/"
            class="inline-block mb-4"
            aria-label="Volver al inicio"
          >
            <img
              src="/logo.svg"
              alt="Logotipo de JobNet"
              class="h-16 w-auto filter brightness-0 invert"
            />
          </NuxtLink>
          <h1 class="text-2xl font-bold tracking-tight text-white mt-2">
            Crear tu Cuenta
          </h1>
          <p class="text-sm text-slate-400 mt-1">
            Únete a la red global de talento técnico
          </p>
        </div>

        <!-- Role Selector Tabs -->
        <div
          class="flex bg-slate-900 p-1 rounded-xl mb-6 border border-slate-800"
          role="tablist"
          aria-label="Tipo de registro"
        >
          <button
            type="button"
            role="tab"
            aria-selected="true"
            aria-label="Registrarse como Candidato"
            class="flex-1 py-2 text-sm font-semibold rounded-lg transition bg-indigo-600 text-white shadow"
          >
            Candidato
          </button>
          <NuxtLink
            to="/register-company"
            role="tab"
            aria-selected="false"
            aria-label="Registrarse como Empresa"
            class="flex-1 py-2 text-sm font-semibold rounded-lg text-slate-400 hover:text-slate-200 text-center transition"
          >
            Empresa
          </NuxtLink>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div
            v-if="errorMessage"
            id="register-error"
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
            id="register-success"
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
              for="fullname"
            >
              Nombre Completo
            </label>
            <input
              id="fullname"
              v-model="fullname"
              type="text"
              placeholder="Ej. Juan Pérez"
              required
              aria-required="true"
              :aria-invalid="!!errorMessage"
              :aria-describedby="
                errorMessage
                  ? 'register-error'
                  : successMessage
                    ? 'register-success'
                    : undefined
              "
              class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label
              class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
              for="email"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              required
              aria-required="true"
              :aria-invalid="!!errorMessage"
              class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label
              class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
              for="password"
            >
              Contraseña
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              required
              aria-required="true"
              :aria-invalid="!!errorMessage"
              class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div class="flex items-start gap-3">
            <input
              id="terms"
              v-model="acceptTerms"
              type="checkbox"
              required
              aria-required="true"
              class="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-800 rounded focus:ring-indigo-500 mt-1"
            />
            <label for="terms" class="text-xs text-slate-400 leading-normal">
              Acepto los
              <a
                href="#"
                class="text-indigo-400 hover:underline"
                aria-label="Ver los Términos de Servicio"
                >Términos de Servicio</a
              >
              y la
              <a
                href="#"
                class="text-indigo-400 hover:underline"
                aria-label="Ver la Política de Privacidad"
                >Política de Privacidad</a
              >.
            </label>
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
            <span v-else>Crear Cuenta</span>
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-slate-800/60 text-center">
          <p class="text-sm text-slate-400">
            ¿Ya tienes una cuenta?
            <NuxtLink
              to="/login"
              class="font-semibold text-indigo-400 hover:text-indigo-300 transition ml-1"
              aria-label="Ir a la pantalla de inicio de sesión"
            >
              Inicia sesión
            </NuxtLink>
          </p>
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
  title: "Crear Cuenta - JobNet",
  description: "Regístrate en JobNet para buscar empleo",
});

const fullname = ref("");
const email = ref("");
const password = ref("");
const acceptTerms = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const router = useRouter();

const handleRegister = async () => {
  if (!acceptTerms.value) {
    errorMessage.value = "Debes aceptar los términos y condiciones";
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const res = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        role: "candidate",
        fullname: fullname.value,
      },
    });

    if (res.success) {
      successMessage.value =
        "Registro inicial exitoso. Redirigiendo a verificación OTP...";
      setTimeout(() => {
        router.push({
          path: "/verify-otp",
          query: { email: email.value },
        });
      }, 1500);
    }
  } catch (error: any) {
    errorMessage.value =
      error.data?.message || error.message || "Error en el registro";
  } finally {
    loading.value = false;
  }
};
</script>
