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
          Iniciar sesión
        </h1>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div
          v-if="errorMessage"
          id="login-error"
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
            :aria-describedby="errorMessage ? 'login-error' : undefined"
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <label
              class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300"
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
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <div
          class="space-y-2 text-sm text-on-surface-variant dark:text-slate-300"
        >
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
            class="w-5 h-5 border-2 border-current/20 border-t-current rounded-full animate-spin"
            aria-hidden="true"
          ></span>
          <span v-else>Ingresar</span>
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
          const errorMap: Record<string, string> = {
            NotAuthorizedException: "Credenciales inválidas",
            UserNotFoundException: "Credenciales inválidas",
            InvalidPasswordException: "Credenciales inválidas",
            UserNotConfirmedException: "Cuenta no confirmada",
            TooManyRequestsException: "Demasiados intentos. Intente más tarde",
            LimitExceededException: "Demasiados intentos. Intente más tarde",
          };
          errorMessage.value =
            errorMap[errorDetails.code] || "Credenciales inválidas";
        }
      } catch (e) {
        // Fallback for non-JSON errors (like standard NextAuth callback failures)
        errorMessage.value = result.error?.includes("ReadConfigError")
          ? "Error de configuración del servidor"
          : "Credenciales inválidas";
      }
    } else {
      // Success, route to dashboard or home based on role
      await new Promise((resolve) => setTimeout(resolve, 150));
      const userRole = (session.value?.user as any)?.tipoUsuario;
      if (
        userRole?.toUpperCase() === "EMPRESA" ||
        userRole?.toUpperCase() === "ORGANIZACION"
      ) {
        router.push("/applicants");
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
