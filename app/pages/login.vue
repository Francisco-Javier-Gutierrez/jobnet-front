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
        <!-- Banner de detección federada con Google -->
        <div
          v-if="isFederatedPrompt"
          id="login-federated-prompt"
          role="alert"
          class="bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 p-4 rounded-xl text-xs space-y-2.5"
        >
          <div class="flex items-start gap-2.5">
            <span
              class="material-symbols-outlined text-base mt-0.5 text-amber-500 flex-shrink-0"
              >account_circle</span
            >
            <div>
              <p class="font-bold text-sm">Cuenta registrada con Google</p>
              <p class="mt-0.5 leading-relaxed">
                Esta cuenta fue creada mediante Google Sign-In y no utiliza una
                contraseña local. Por favor, ingresa haciendo clic en el botón
                <strong>"Continuar con Google"</strong> a continuación.
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="handleGoogleSignIn"
            :disabled="loadingGoogle"
            class="w-full py-2.5 bg-white dark:bg-slate-800 border border-amber-500/40 rounded-lg font-semibold text-xs text-on-surface dark:text-slate-100 flex items-center justify-center gap-2 hover:bg-amber-50 dark:hover:bg-slate-750 transition shadow-sm"
          >
            <span
              v-if="loadingGoogle"
              class="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"
            ></span>
            <template v-else>
              <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
              <span>Acceder directamente con Google</span>
            </template>
          </button>
        </div>

        <!-- Banner Informativo -->
        <div
          v-if="infoMessage"
          role="status"
          class="bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg text-sm flex items-start gap-2"
        >
          <span
            class="material-symbols-outlined text-sm mt-0.5 text-blue-500 flex-shrink-0"
            aria-hidden="true"
            >info</span
          >
          <span>{{ infoMessage }}</span>
        </div>

        <!-- Banner de Éxito -->
        <div
          v-if="successMessage"
          role="status"
          class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 p-3 rounded-lg text-sm flex items-start gap-2"
        >
          <span
            class="material-symbols-outlined text-sm mt-0.5 text-emerald-500 flex-shrink-0"
            aria-hidden="true"
            >check_circle</span
          >
          <span>{{ successMessage }}</span>
        </div>

        <div
          v-else-if="errorMessage && !isFederatedPrompt"
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
          :disabled="loading || loadingGoogle"
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
              o accede directamente con
            </span>
          </div>
        </div>

        <!-- Botón de Acceso Rápido con Google (OAuth 2.0 enlazado a AWS Cognito) -->
        <button
          type="button"
          @click="handleGoogleSignIn"
          :disabled="loadingGoogle || loading"
          :class="[
            'w-full h-12 bg-surface hover:bg-surface-container-low dark:bg-slate-800 dark:hover:bg-slate-700/80 border text-on-surface dark:text-slate-100 font-semibold text-sm rounded-xl flex items-center justify-center gap-3 transition shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed',
            isFederatedPrompt
              ? 'border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 shadow-md shadow-primary/20 animate-pulse'
              : 'border-outline-variant/80 dark:border-slate-700',
          ]"
          aria-label="Iniciar sesión con Google"
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

        <!-- Nota de Seguridad sobre Segregación de Roles -->
        <div class="mt-2.5 text-center px-1">
          <p
            class="text-[11px] text-on-surface-variant/85 dark:text-slate-400 leading-normal"
          >
            <span
              class="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 align-middle"
            >
              <span
                class="material-symbols-outlined text-[13px] leading-none select-none shrink-0"
                aria-hidden="true"
                >shield</span
              >
              <span>Acceso exclusivo como Candidato:</span>
            </span>
            <span class="align-middle ml-1">
              Cuentas de Administrador, Moderador u Organización deben ingresar
              con correo y contraseña.
            </span>
          </p>
        </div>
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

const config = useRuntimeConfig();

const email = ref("");
const password = ref("");
const loading = ref(false);
const loadingGoogle = ref(false);
const errorMessage = ref("");
const infoMessage = ref("");
const successMessage = ref("");
const isFederatedPrompt = ref(false);

const route = useRoute();
const router = useRouter();
const { signIn, data: session } = useAuth();

onMounted(() => {
  if (route.query.unlinked === "true") {
    infoMessage.value =
      "No se realizó la vinculación de cuentas. Puedes continuar iniciando sesión con tu correo y contraseña habitual.";
  }
  if (route.query.linked === "success") {
    successMessage.value =
      "¡Cuentas vinculadas exitosamente! Ya puedes iniciar sesión con tu contraseña o con Google.";
  }
  if (route.query.email) {
    email.value = String(route.query.email);
  }

  if (route.query.error) {
    const errorParam = String(route.query.error);
    if (
      errorParam === "OAuthCallback" ||
      errorParam === "OAuthSignin" ||
      errorParam === "OAuthCreateAccount"
    ) {
      errorMessage.value =
        "No se pudo completar la autenticación con Google. Por favor, intenta de nuevo.";
    } else if (errorParam !== "CredentialsSignin") {
      errorMessage.value = errorParam;
    }
  }
});

const handleGoogleSignIn = async () => {
  loadingGoogle.value = true;
  errorMessage.value = "";
  infoMessage.value = "";
  successMessage.value = "";

  try {
    await signIn("cognito", {
      callbackUrl: "/?google_login=1",
    });
  } catch (err: any) {
    console.error("Error during Google OAuth sign-in:", err);
    errorMessage.value =
      "Error al conectar con Google Sign-In. Intente nuevamente.";
    loadingGoogle.value = false;
  }
};

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";
  infoMessage.value = "";
  successMessage.value = "";
  isFederatedPrompt.value = false;

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
        } else if (errorDetails.code === "FederatedUserLoginException") {
          isFederatedPrompt.value = true;
          errorMessage.value =
            errorDetails.message ||
            "Esta cuenta fue creada mediante Google Sign-In. Por favor, inicia sesión con el botón 'Continuar con Google'.";
        } else {
          const errorMap: Record<string, string> = {
            NotAuthorizedException: "Credenciales inválidas",
            UserNotFoundException: "Credenciales inválidas",
            InvalidPasswordException: "Credenciales inválidas",
            UserNotConfirmedException: "Cuenta no confirmada",
            TooManyRequestsException: "Demasiados intentos. Intente más tarde",
            LimitExceededException: "Demasiados intentos. Intente más tarde",
            AccountInactive:
              "Su cuenta se encuentra en estado inactivo neutral. El titular de AWS Cognito debe autorizar y asignar explícitamente el rol de moderación o administrativo para habilitar el acceso.",
          };
          errorMessage.value =
            errorDetails.message ||
            errorMap[errorDetails.code] ||
            "Credenciales inválidas";
        }
      } catch (e) {
        // Fallback for non-JSON errors (like standard NextAuth callback failures)
        if (
          result.error &&
          !result.error.includes("ReadConfigError") &&
          !result.error.includes("CredentialsSignin")
        ) {
          errorMessage.value = result.error;
        } else {
          errorMessage.value = result.error?.includes("ReadConfigError")
            ? "Error de configuración del servidor"
            : "Credenciales inválidas";
        }
      }
    } else {
      // Success, route to dashboard or home based on role
      await new Promise((resolve) => setTimeout(resolve, 150));
      const userRole = (session.value?.user as any)?.tipoUsuario;
      if (userRole?.toUpperCase() === "ORGANIZACION") {
        router.push("/applicants");
      } else if (userRole?.toUpperCase() === "ADMIN") {
        router.push("/admin");
      } else if (
        userRole?.toUpperCase() === "MODERATOR" ||
        userRole?.toUpperCase() === "MODERADOR"
      ) {
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
