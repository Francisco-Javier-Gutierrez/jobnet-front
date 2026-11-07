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
          Crear cuenta
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

      <!-- Role Selector Tabs (Dark Mode Adapted) -->
      <div
        class="flex bg-[#F1F5F9] dark:bg-slate-800/80 p-1 rounded-xl mb-6 border border-outline-variant/30 dark:border-slate-700/60"
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
          class="flex-1 py-2 text-sm font-semibold rounded-lg text-on-surface-variant dark:text-slate-300 hover:text-primary text-center transition"
        >
          Organización
        </NuxtLink>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div
          v-if="errorMessage"
          id="register-error"
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
          id="register-success"
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
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
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
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <div>
          <label
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
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
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <!-- Password Requirements Box (Dark Mode Adapted) -->
        <div
          class="select-none pointer-events-none rounded-xl border border-outline-variant/60 dark:border-slate-800 bg-[#F1F5F9] dark:bg-slate-800/80 p-3 text-on-surface-variant dark:text-slate-300"
          aria-live="polite"
        >
          <p
            class="mb-2 text-sm font-semibold text-on-surface dark:text-slate-100"
          >
            Requisitos de contraseña
          </p>
          <div class="flex flex-col gap-1">
            <label
              v-for="rule in passwordRuleItems"
              :key="rule.key"
              class="flex items-center gap-2 text-xs"
              :class="
                rule.valid
                  ? 'text-secondary dark:text-emerald-400 font-medium'
                  : 'text-on-surface-variant dark:text-slate-400'
              "
            >
              <input
                type="checkbox"
                disabled
                :checked="rule.valid"
                class="h-4 w-4 rounded border-outline-variant/60 dark:border-slate-700 bg-white dark:bg-slate-800 text-secondary accent-secondary"
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
            class="w-4 h-4 text-primary bg-[#F1F5F9] dark:bg-slate-800 border-outline-variant/60 rounded focus:ring-primary mt-1"
          />
          <label
            for="terms"
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-normal"
          >
            Acepto los
            <button
              type="button"
              @click.prevent="showTermsModal = true"
              class="text-primary hover:underline cursor-pointer"
              aria-label="Ver los Términos de Servicio"
            >
              Términos de Servicio
            </button>
            y la
            <button
              type="button"
              @click.prevent="showTermsModal = true"
              class="text-primary hover:underline cursor-pointer"
              aria-label="Ver la Política de Privacidad"
            >
              Política de Privacidad</button
            >.
          </label>
        </div>

        <button
          type="submit"
          :disabled="loading || loadingGoogle"
          :aria-busy="loading"
          class="w-full h-12 bg-primary hover:bg-primary-container disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 transition shadow-sm hover:shadow"
        >
          <span
            v-if="loading"
            class="w-5 h-5 border-2 border-current/20 border-t-current rounded-full animate-spin"
            aria-hidden="true"
          ></span>
          <span v-else>Registrarse</span>
        </button>

        <!-- Separador -->
        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center">
            <div
              class="w-full border-t border-outline-variant/60 dark:border-slate-800"
            ></div>
          </div>
          <div class="relative flex justify-center text-xs">
            <span
              class="bg-surface-container-lowest dark:bg-slate-900 px-3 text-on-surface-variant dark:text-slate-400 font-medium"
            >
              o regístrate rápidamente con
            </span>
          </div>
        </div>

        <!-- Botón de Registro Rápido con Google -->
        <button
          type="button"
          @click="handleGoogleSignIn"
          :disabled="loadingGoogle || loading"
          class="w-full h-12 bg-surface hover:bg-surface-container-low dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-outline-variant/80 dark:border-slate-700 text-on-surface dark:text-slate-100 font-semibold text-sm rounded-xl flex items-center justify-center gap-3 transition shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Registrarse con Google"
        >
          <span
            v-if="loadingGoogle"
            class="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"
            aria-hidden="true"
          ></span>
          <template v-else>
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar con Google</span>
          </template>
        </button>

        <!-- Nota de Seguridad sobre Rol de Candidato -->
        <div class="mt-2 text-center px-1">
          <p
            class="text-[11px] text-on-surface-variant/85 dark:text-slate-400 leading-tight"
          >
            <span
              class="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400"
            >
              <span
                class="material-symbols-outlined text-[13px]"
                aria-hidden="true"
                >shield</span
              >
              Rol estrictamente Candidato:
            </span>
            El registro con Google crea exclusivamente cuentas de candidato.
            Para organizaciones, regístrate en la pestaña Organización con
            correo y contraseña.
          </p>
        </div>
      </form>
    </div>
  </div>

  <!-- Terms Modal -->
  <AppModal
    v-model="showTermsModal"
    title="Términos y Condiciones de Uso"
    icon="gavel"
    max-width="3xl"
    @close="showTermsModal = false"
  >
    <AppTermsContent />
  </AppModal>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
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
const loadingGoogle = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const router = useRouter();
const { signIn } = useAuth();

const handleGoogleSignIn = async () => {
  loadingGoogle.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await signIn("cognito", {
      callbackUrl: "/?google_login=1",
    });
  } catch (err: any) {
    console.error("Error during Google OAuth sign-in on register:", err);
    errorMessage.value =
      "Error al conectar con Google Sign-In. Intente nuevamente.";
    loadingGoogle.value = false;
  }
};

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
const showTermsModal = ref(false);
</script>
