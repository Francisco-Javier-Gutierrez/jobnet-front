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
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm p-8"
      >
        <div class="text-center mb-8 flex flex-col items-center">
          <NuxtLink
            to="/"
            class="inline-block mb-4"
            aria-label="Volver al inicio"
          >
            <img src="/logo.svg" alt="Logotipo de JobNet" class="h-24 w-auto" />
          </NuxtLink>
          <h1 class="text-2xl font-bold tracking-tight text-on-background mt-2">
            Crear cuenta
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

        <!-- Role Selector Tabs -->
        <div
          class="flex bg-[#F1F5F9] p-1 rounded-xl mb-6 border border-outline-variant/30"
          role="tablist"
          aria-label="Tipo de registro"
        >
          <button
            type="button"
            role="tab"
            aria-selected="true"
            aria-label="Registrarse como Candidato"
            class="flex-1 py-2 text-sm font-semibold rounded-lg transition bg-primary text-white shadow-sm"
          >
            Candidato
          </button>
          <NuxtLink
            to="/register-company"
            role="tab"
            aria-selected="false"
            aria-label="Registrarse como organización"
            class="flex-1 py-2 text-sm font-semibold rounded-lg text-on-surface-variant hover:text-primary text-center transition"
          >
            Organización
          </NuxtLink>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div
            v-if="errorMessage"
            id="register-error"
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
            id="register-success"
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
              for="fullname"
            >
              Ingrese su nombre completo
            </label>
            <input
              id="fullname"
              v-model="fullname"
              type="text"
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
              class="w-full bg-[#F1F5F9] border border-[#F1F5F9] hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background outline-none transition-colors"
            />
          </div>

          <div>
            <label
              class="block text-xs font-semibold tracking-wider text-on-surface-variant mb-2"
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
              class="w-full bg-[#F1F5F9] border border-[#F1F5F9] hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background outline-none transition-colors"
            />
          </div>

          <div>
            <label
              class="block text-xs font-semibold tracking-wider text-on-surface-variant mb-2"
              for="password"
            >
              Ingrese su contraseña
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              aria-required="true"
              :aria-invalid="!!errorMessage"
              class="w-full bg-[#F1F5F9] border border-[#F1F5F9] hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background outline-none transition-colors"
            />
          </div>

          <div
            class="select-none pointer-events-none rounded-xl border border-outline-variant/60 bg-[#F1F5F9] p-3 text-on-surface-variant"
            aria-live="polite"
          >
            <p class="mb-2 text-sm font-semibold text-on-surface">
              Requisitos de contraseña
            </p>
            <div class="flex flex-col gap-1">
              <label
                v-for="rule in passwordRuleItems"
                :key="rule.key"
                class="flex items-center gap-2 text-xs"
                :class="
                  rule.valid ? 'text-secondary' : 'text-on-surface-variant/60'
                "
              >
                <input
                  type="checkbox"
                  disabled
                  :checked="rule.valid"
                  class="h-4 w-4 rounded border-outline-variant/60 bg-white text-secondary accent-secondary"
                  aria-hidden="true"
                />
                <span>{{ rule.label }}</span>
              </label>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <input
              id="terms"
              v-model="acceptTerms"
              type="checkbox"
              required
              aria-required="true"
              class="w-4 h-4 text-primary bg-[#F1F5F9] border-outline-variant/60 rounded focus:ring-primary mt-1"
            />
            <label
              for="terms"
              class="text-xs text-on-surface-variant leading-normal"
            >
              Acepto los
              <a
                href="#"
                class="text-primary hover:underline"
                aria-label="Ver los Términos de Servicio"
                >Términos de Servicio</a
              >
              y la
              <a
                href="#"
                class="text-primary hover:underline"
                aria-label="Ver la Política de Privacidad"
                >Política de Privacidad</a
              >.
            </label>
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
            <span v-else>Registrarse</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Crear cuenta - JobNet",
  description: "Regístrate en JobNet para buscar empleo",
});

const fullname = ref("");
const email = ref("");
const password = ref("");
const passwordRules = computed(() => ({
  length: password.value.length >= 8,
  uppercase: /[A-Z]/.test(password.value),
  lowercase: /[a-z]/.test(password.value),
  number: /\d/.test(password.value),
  special: /[@$!%*?&._-]/.test(password.value),
}));
const passwordRuleItems = computed(() => [
  {
    key: "length",
    label: "Al menos 8 caracteres",
    valid: passwordRules.value.length,
  },
  {
    key: "uppercase",
    label: "Una letra mayúscula",
    valid: passwordRules.value.uppercase,
  },
  {
    key: "lowercase",
    label: "Una letra minúscula",
    valid: passwordRules.value.lowercase,
  },
  { key: "number", label: "Un número", valid: passwordRules.value.number },
  {
    key: "special",
    label: "Un carácter especial (@$!%*?&._-)",
    valid: passwordRules.value.special,
  },
]);
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
