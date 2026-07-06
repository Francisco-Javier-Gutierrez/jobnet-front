<template>
  <div
    class="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_40%)] pointer-events-none"
    ></div>

    <div class="w-full max-w-md relative z-10">
      <div
        class="bg-slate-950 border border-slate-800 rounded-2xl shadow-xl p-8"
      >
        <div class="text-center mb-8 flex flex-col items-center">
          <NuxtLink to="/" class="inline-block mb-4">
            <img
              src="/logo.svg"
              alt="JobNet"
              class="h-16 w-auto filter brightness-0 invert"
            />
          </NuxtLink>
          <h1 class="text-2xl font-bold tracking-tight text-white mt-2">
            Bienvenido de nuevo
          </h1>
          <p class="text-sm text-slate-400 mt-1">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div
            v-if="errorMessage"
            class="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-start gap-2"
          >
            <span class="material-symbols-outlined text-sm mt-0.5">error</span>
            <span>{{ errorMessage }}</span>
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
              class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label
                class="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                for="password"
              >
                Contraseña
              </label>
              <NuxtLink
                to="/forgot-password"
                class="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
              >
                ¿Olvidaste tu contraseña?
              </NuxtLink>
            </div>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full h-12 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
          >
            <span
              v-if="loading"
              class="material-symbols-outlined animate-spin text-lg"
              >progress_activity</span
            >
            <span v-else>Iniciar Sesión</span>
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-slate-800/60 text-center">
          <p class="text-sm text-slate-400">
            ¿No tienes una cuenta?
            <NuxtLink
              to="/register"
              class="font-semibold text-emerald-400 hover:text-emerald-300 transition ml-1"
            >
              Regístrate aquí
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
  title: "Iniciar Sesión - JobNet",
  description: "Inicia sesión en la plataforma JobNet",
});

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const router = useRouter();
const { signIn } = useAuth();

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const result = await signIn("credentials", {
      email: email.value,
      password: password.value,
      redirect: false,
    });

    if (result?.error) {
      try {
        const errorDetails = JSON.parse(result.error);

        if (errorDetails.code === "ChallengeRequired") {
          // Redirect to MFA code input
          router.push({
            path: "/mfa",
            query: {
              challenge: errorDetails.challengeName,
              session: errorDetails.session,
              email: errorDetails.email,
            },
          });
        } else if (errorDetails.code === "UserNotConfirmedException") {
          // Redirect to verify code
          router.push({
            path: "/verify-otp",
            query: { email: email.value },
          });
        } else {
          errorMessage.value = errorDetails.message || "Error de autenticación";
        }
      } catch (e) {
        // Fallback for non-JSON errors (like standard NextAuth callback failures)
        errorMessage.value = result.error.includes("ReadConfigError")
          ? "Error de configuración del servidor"
          : result.error;
      }
    } else {
      // Success, route to dashboard or home
      router.push("/");
    }
  } catch (error: any) {
    errorMessage.value = error.message || "Ocurrió un error inesperado";
  } finally {
    loading.value = false;
  }
};
</script>
