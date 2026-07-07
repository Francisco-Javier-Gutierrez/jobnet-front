<template>
  <div
    class="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_40%)] pointer-events-none"
      aria-hidden="true"
    ></div>

    <div class="w-full max-w-lg relative z-10" role="main">
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
            Registra tu Empresa
          </h1>
          <p class="text-sm text-slate-400 mt-1">
            Encuentra el talento ideal para tu equipo
          </p>
        </div>

        <!-- Role Selector Tabs -->
        <div
          class="flex bg-slate-900 p-1 rounded-xl mb-6 border border-slate-800"
          role="tablist"
          aria-label="Tipo de registro"
        >
          <NuxtLink
            to="/register"
            role="tab"
            aria-selected="false"
            aria-label="Registrarse como Candidato"
            class="flex-1 py-2 text-sm font-semibold rounded-lg text-slate-400 hover:text-slate-200 text-center transition"
          >
            Candidato
          </NuxtLink>
          <button
            type="button"
            role="tab"
            aria-selected="true"
            aria-label="Registrarse como Empresa"
            class="flex-1 py-2 text-sm font-semibold rounded-lg transition bg-indigo-600 text-white shadow"
          >
            Empresa
          </button>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <div
            v-if="errorMessage"
            id="register-company-error"
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
            id="register-company-success"
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
              for="company_name"
            >
              Nombre Comercial de la Empresa
            </label>
            <input
              id="company_name"
              v-model="companyName"
              type="text"
              placeholder="Ej. TechFlow Solutions"
              required
              aria-required="true"
              :aria-invalid="!!errorMessage"
              :aria-describedby="
                errorMessage
                  ? 'register-company-error'
                  : successMessage
                    ? 'register-company-success'
                    : undefined
              "
              class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label
              class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
              for="tax_id"
            >
              RFC o Identificador Fiscal
            </label>
            <input
              id="tax_id"
              v-model="taxId"
              type="text"
              placeholder="Ej. RFC o Tax ID"
              required
              aria-required="true"
              :aria-invalid="!!errorMessage"
              class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label
              class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
              for="corporate_email"
            >
              Correo Electrónico Corporativo
            </label>
            <input
              id="corporate_email"
              v-model="email"
              type="email"
              placeholder="reclutamiento@empresa.com"
              required
              aria-required="true"
              :aria-invalid="!!errorMessage"
              class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                required
                aria-required="true"
                :aria-invalid="!!errorMessage"
                class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
              />
            </div>
            <div>
              <label
                class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
                for="confirm_password"
              >
                Confirmar Contraseña
              </label>
              <input
                id="confirm_password"
                v-model="confirmPassword"
                type="password"
                required
                aria-required="true"
                :aria-invalid="!!errorMessage"
                class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
              />
            </div>
          </div>

          <div class="flex items-start gap-3 pt-2">
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
                class="text-emerald-400 hover:underline"
                aria-label="Ver los Términos y Condiciones"
                >Términos y Condiciones</a
              >
              y el
              <a
                href="#"
                class="text-emerald-400 hover:underline"
                aria-label="Ver el Aviso de Privacidad"
                >Aviso de Privacidad</a
              >
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
            <span v-else class="flex items-center gap-1">
              Crear Cuenta Empresarial
              <span class="material-symbols-outlined text-lg" aria-hidden="true"
                >arrow_forward</span
              >
            </span>
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-slate-800/60 text-center">
          <p class="text-sm text-slate-400">
            ¿Ya tienes una cuenta corporativa?
            <NuxtLink
              to="/login"
              class="font-semibold text-indigo-400 hover:text-indigo-300 transition ml-1"
              aria-label="Ir a la pantalla de inicio de sesión"
            >
              Iniciar sesión
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
  title: "Registro de Empresa - JobNet",
  description: "Crea una cuenta corporativa en JobNet",
});

const companyName = ref("");
const taxId = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const acceptTerms = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const router = useRouter();

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Las contraseñas no coinciden";
    return;
  }

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
        role: "company",
        companyName: companyName.value,
        taxId: taxId.value,
      },
    });

    if (res.success) {
      successMessage.value =
        "Registro corporativo inicial exitoso. Redirigiendo a verificación OTP...";
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
