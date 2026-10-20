<template>
  <div class="w-full max-w-md" role="main">
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6"
    >
      <div class="text-center flex flex-col items-center">
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
        <div
          class="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-full mb-2"
        >
          <span class="material-symbols-outlined text-sm">shield_person</span>
          <span>Ruta Privada - Aspirante a Moderador</span>
        </div>
        <h1
          class="text-xl font-bold tracking-tight text-on-background dark:text-slate-100"
        >
          Registro Secreto de Moderadores
        </h1>
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300/80 mt-1 max-w-sm"
        >
          Ruta independiente para aspirantes a moderación. La cuenta se registrará
          en <strong>estado inactivo neutral</strong> hasta que el titular de AWS
          asigne explícitamente el rol en AWS Cognito.
        </p>
      </div>

      <form @submit.prevent="handleRegisterModerator" class="space-y-5">
        <div
          v-if="errorMessage"
          id="register-error"
          role="alert"
          class="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-3 rounded-xl text-xs flex items-start gap-2"
        >
          <span class="material-symbols-outlined text-base">error</span>
          <span>{{ errorMessage }}</span>
        </div>

        <div
          v-if="successMessage"
          id="register-success"
          role="status"
          class="bg-secondary/10 border border-secondary/20 text-secondary dark:text-emerald-400 p-3 rounded-xl text-xs flex items-start gap-2"
        >
          <span class="material-symbols-outlined text-base">check_circle</span>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Campo 1: Nombre -->
        <div>
          <label
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
            for="fullname"
          >
            Nombre Completo / Identificador
          </label>
          <input
            id="fullname"
            v-model="fullname"
            type="text"
            required
            placeholder="Ej: Lic. Carlos Mendoza / Staff Moderación"
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <!-- Campo 2: Correo Personal o Institucional -->
        <div>
          <label
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
            for="email"
          >
            Correo Personal o Institucional
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="moderador@institucion.org o personal@dominio.com"
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <!-- Campo 3: Contraseña -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label
              class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300"
              for="password"
            >
              Contraseña de acceso
            </label>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="text-xs text-primary hover:underline flex items-center gap-1"
              tabindex="-1"
            >
              <span class="material-symbols-outlined text-xs">
                {{ showPassword ? "visibility_off" : "visibility" }}
              </span>
              <span>{{ showPassword ? "Ocultar" : "Mostrar" }}</span>
            </button>
          </div>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="••••••••"
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <!-- Elemento visual RNF-5: Reglas de seguridad y formato en tiempo real -->
        <div
          class="rounded-xl border border-outline-variant/60 dark:border-slate-800 bg-[#F1F5F9] dark:bg-slate-800/80 p-3 text-on-surface-variant dark:text-slate-300 space-y-2.5"
          aria-live="polite"
        >
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold text-on-surface dark:text-slate-100 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-primary">verified_user</span>
              <span>Requisitos de Seguridad RNF-5</span>
            </p>
            <span
              v-if="allRulesPassed"
              class="inline-flex items-center gap-1 text-[10px] font-bold text-secondary dark:text-emerald-400 bg-secondary/10 px-2 py-0.5 rounded-full"
            >
              <span class="material-symbols-outlined text-xs">check</span>
              Cumple RNF-5
            </span>
            <span
              v-else
              class="text-[10px] font-medium text-slate-500 dark:text-slate-400"
            >
              {{ validRulesCount }} de 5 cumplidos
            </span>
          </div>

          <!-- Barra visual de progreso RNF-5 -->
          <div class="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-300 rounded-full"
              :class="progressColorClass"
              :style="{ width: `${(validRulesCount / 5) * 100}%` }"
            ></div>
          </div>

          <!-- Checklist de reglas RNF-5 -->
          <div class="flex flex-col gap-1.5 pt-0.5">
            <div
              v-for="rule in passwordRuleItems"
              :key="rule.key"
              class="flex items-center gap-2 text-xs transition-colors"
              :class="
                rule.valid
                  ? 'text-secondary dark:text-emerald-400 font-medium'
                  : 'text-on-surface-variant dark:text-slate-400'
              "
            >
              <span
                class="material-symbols-outlined text-sm shrink-0"
                :class="rule.valid ? 'text-secondary dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'"
              >
                {{ rule.valid ? "check_circle" : "radio_button_unchecked" }}
              </span>
              <span>{{ rule.label }}</span>
            </div>
          </div>
        </div>

        <!-- Confirmación de Estado Inactivo Neutral -->
        <div class="flex items-start gap-2 pt-1">
          <input
            id="terms"
            v-model="acceptTerms"
            type="checkbox"
            required
            class="mt-1 rounded border-outline-variant text-primary focus:ring-primary dark:bg-slate-800"
          />
          <label
            for="terms"
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-tight select-none cursor-pointer"
          >
            Acepto crear la cuenta en <strong>estado inactivo neutral</strong>. Reconozco
            que el acceso permanecerá bloqueado sin rol de Candidato hasta que el titular
            de AWS autorice y asigne explícitamente el rol de moderación en AWS Cognito.
          </label>
        </div>

        <button
          type="submit"
          :disabled="loading || !acceptTerms || !allRulesPassed"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          <span
            v-if="loading"
            class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
            aria-hidden="true"
          ></span>
          <span class="material-symbols-outlined text-sm" v-else>shield</span>
          <span>{{
            loading ? "Registrando moderador..." : "Registrar Aspirante a Moderador"
          }}</span>
        </button>
      </form>

      <div
        class="text-center pt-2 border-t border-outline-variant/20 dark:border-slate-800"
      >
        <NuxtLink
          to="/login"
          class="text-xs font-semibold text-primary hover:underline transition"
        >
          ← Volver a Inicio de Sesión
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
  alias: ["/register-mod", "/mod/register"],
});

useSeoMeta({
  title: "Registro de Moderadores - JobNet",
  description:
    "Ruta de registro independiente para aspirantes a moderación en JobNet",
});

const fullname = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const acceptTerms = ref(false);

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const router = useRouter();

// RNF-5 Rules Evaluation
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
    label: "Al menos una letra mayúscula (A-Z)",
    valid: passwordRules.value.uppercase,
  },
  {
    key: "lowercase",
    label: "Al menos una letra minúscula (a-z)",
    valid: passwordRules.value.lowercase,
  },
  {
    key: "number",
    label: "Al menos un dígito numérico (0-9)",
    valid: passwordRules.value.number,
  },
  {
    key: "special",
    label: "Al menos un carácter especial (@$!%*?&._-)",
    valid: passwordRules.value.special,
  },
]);

const validRulesCount = computed(() => {
  return passwordRuleItems.value.filter((r) => r.valid).length;
});

const allRulesPassed = computed(() => {
  return validRulesCount.value === 5;
});

const progressColorClass = computed(() => {
  if (validRulesCount.value <= 2) return "bg-rose-500";
  if (validRulesCount.value <= 4) return "bg-amber-500";
  return "bg-secondary dark:bg-emerald-400";
});

const handleRegisterModerator = async () => {
  if (!allRulesPassed.value) {
    errorMessage.value =
      "La contraseña debe cumplir con todos los requisitos de seguridad establecidos en el RNF-5.";
    return;
  }

  if (!acceptTerms.value) {
    errorMessage.value =
      "Debes confirmar la creación de la cuenta en estado neutral para moderación.";
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const res = await $fetch<any>("/api/auth/register", {
      method: "POST",
      body: {
        email: email.value.trim(),
        password: password.value,
        role: "moderator_pending",
        requestedRole: "MODERATOR",
        fullname: fullname.value.trim(),
      },
    });

    if (res.success) {
      successMessage.value =
        "Aspirante a moderador registrado en estado neutral. Redirigiendo a verificación OTP...";
      setTimeout(() => {
        router.push({
          path: "/verify-otp",
          query: { email: email.value.trim() },
        });
      }, 1500);
    }
  } catch (error: any) {
    errorMessage.value =
      error.data?.message ||
      error.message ||
      "Error al registrar al aspirante a moderador.";
  } finally {
    loading.value = false;
  }
};
</script>
