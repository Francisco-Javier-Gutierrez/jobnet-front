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
          class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full mb-2"
        >
          <span class="material-symbols-outlined text-sm">lock</span>
          <span>Ruta Privada - Blank User</span>
        </div>
        <h1
          class="text-xl font-bold tracking-tight text-on-background dark:text-slate-100"
        >
          Registro de Usuario Sin Rol Asignado
        </h1>
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300/80 mt-1 max-w-sm"
        >
          Crea una cuenta base neutral. El administrador podrá asignarle
          posteriormente el rol de <strong>ADMIN</strong> o
          <strong>MODERATOR</strong> desde la consola de AWS Cognito.
        </p>
      </div>

      <form @submit.prevent="handleRegisterSecret" class="space-y-5">
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
            placeholder="Ej: Persona Personal / Staff"
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <div>
          <label
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
            for="email"
          >
            Correo electrónico corporativo / personal
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="usuario@dominio.com"
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <div>
          <label
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
            for="password"
          >
            Contraseña de acceso
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
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
            Requisitos de contraseña de AWS Cognito
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
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-tight"
          >
            Acepto crear un usuario sin grupo asignado (Blank User) para
            revisión de administración.
          </label>
        </div>

        <button
          type="submit"
          :disabled="loading || !acceptTerms"
          class="w-full bg-primary hover:bg-primary-container text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
        >
          <span
            v-if="loading"
            class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
            aria-hidden="true"
          ></span>
          <span>{{
            loading ? "Creando usuario secreto..." : "Crear Usuario Neutral"
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
});

useSeoMeta({
  title: "Registro Secreto - JobNet",
  description:
    "Registro de usuario neutro sin rol predeterminado para administración",
});

const fullname = ref("");
const email = ref("");
const password = ref("");
const acceptTerms = ref(false);

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const router = useRouter();

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

const handleRegisterSecret = async () => {
  if (!acceptTerms.value) {
    errorMessage.value = "Debes confirmar la creación del usuario secreto.";
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
        role: "blank",
        fullname: fullname.value.trim(),
      },
    });

    if (res.success) {
      successMessage.value =
        "Usuario registrado sin rol asignado exitosamente. Redirigiendo a verificación de código OTP...";
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
      "Error al registrar el usuario secreto.";
  } finally {
    loading.value = false;
  }
};
</script>
