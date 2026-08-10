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
          Registro de organización
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
        <NuxtLink
          to="/register"
          role="tab"
          aria-selected="false"
          aria-label="Registrarse como Candidato"
          class="flex-1 py-2 text-sm font-semibold rounded-lg text-on-surface-variant dark:text-slate-300 hover:text-primary text-center transition"
        >
          Candidato
        </NuxtLink>
        <button
          type="button"
          role="tab"
          aria-selected="true"
          aria-label="Registrarse como organización"
          class="flex-1 py-2 text-sm font-semibold rounded-lg transition bg-primary text-white shadow-sm"
        >
          Organización
        </button>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div
          v-if="errorMessage"
          id="register-company-error"
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
          id="register-company-success"
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
            for="company_name"
          >
            Ingrese el nombre de la organización
          </label>
          <input
            id="company_name"
            v-model="companyName"
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
            for="tax_id"
          >
            Ingrese el RFC o identificador fiscal
          </label>
          <input
            id="tax_id"
            v-model="taxId"
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
            for="phone"
          >
            Ingrese el teléfono de contacto
          </label>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            required
            aria-required="true"
            :aria-invalid="!!errorMessage"
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <div>
          <label
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
            for="corporate_email"
          >
            Ingrese el correo electrónico de la organización
          </label>
          <input
            id="corporate_email"
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

        <div class="flex items-start gap-3 pt-2">
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
            <a
              href="#"
              class="text-primary hover:underline"
              aria-label="Ver los Términos y Condiciones"
              >Términos y Condiciones</a
            >
            y el
            <a
              href="#"
              class="text-primary hover:underline"
              aria-label="Ver el Aviso de Privacidad"
              >Aviso de Privacidad</a
            >
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
          <span v-else>Registrar</span>
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
  title: "Registro de organización - JobNet",
  description: "Crea una cuenta de organización en JobNet",
});

const companyName = ref("");
const taxId = ref("");
const phone = ref("");
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
        role: "company",
        companyName: companyName.value,
        taxId: taxId.value,
        phone: phone.value,
      },
    });

    if (res.success) {
      successMessage.value =
        "Registro de organización inicial exitoso. Redirigiendo a verificación OTP...";
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
