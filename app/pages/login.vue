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
            Iniciar sesión
          </h1>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div
            v-if="errorMessage"
            id="login-error"
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
              :aria-describedby="errorMessage ? 'login-error' : undefined"
              class="w-full bg-[#F1F5F9] border border-[#F1F5F9] hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background outline-none transition-colors"
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label
                class="block text-xs font-semibold tracking-wider text-on-surface-variant"
                for="password"
              >
                Ingrese su contraseña
              </label>
            </div>
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

          <div class="space-y-2 text-sm text-on-surface-variant">
            <p>
              ¿Todavía no tienes una cuenta?
              <NuxtLink
                to="/register"
                class="font-semibold text-primary hover:underline transition"
                aria-label="Registrarse en JobNet"
              >
                ¡Regístrate aquí!
              </NuxtLink>
            </p>
            <p>
              ¿Olvidaste tu contraseña?
              <NuxtLink
                to="/forgot-password"
                class="font-semibold text-primary hover:underline transition"
                aria-label="Recuperar contraseña olvidada"
              >
                ¡Recuperala!
              </NuxtLink>
            </p>
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
            <span v-else>Ingresar</span>
          </button>
        </form>
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
const { signIn, data: session } = useAuth();

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
      // Success, route to dashboard or home based on role
      await new Promise((resolve) => setTimeout(resolve, 150));
      const userRole = (session.value?.user as any)?.tipoUsuario;
      if (userRole?.toUpperCase() === "EMPRESA") {
        router.push("/dashboard");
      } else if (userRole?.toUpperCase() === "ADMIN") {
        router.push("/admin/organizations");
      } else if (userRole?.toUpperCase() === "MODERATOR") {
        router.push("/mod/incidents");
      } else {
        router.push("/");
      }
    }
  } catch (error: any) {
    errorMessage.value = error.message || "Ocurrió un error inesperado";
  } finally {
    loading.value = false;
  }
};
</script>
