<template>
  <div class="w-full max-w-lg mx-auto" role="main">
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-md p-6 sm:p-8"
    >
      <!-- Header con logos vinculados -->
      <div class="text-center mb-6 flex flex-col items-center">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div
            class="w-14 h-14 rounded-2xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/60 dark:border-slate-700 flex items-center justify-center shadow-sm"
          >
            <img
              src="/logo.svg"
              alt="JobNet"
              class="h-8 w-auto filter brightness-100 dark:brightness-0 dark:invert"
            />
          </div>

          <div
            class="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-lg animate-pulse"
              >link</span
            >
          </div>

          <div
            class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-outline-variant/60 dark:border-slate-700 flex items-center justify-center shadow-sm"
          >
            <svg class="w-7 h-7" viewBox="0 0 24 24">
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
          </div>
        </div>

        <h1
          class="text-xl sm:text-2xl font-bold tracking-tight text-on-background dark:text-slate-100"
        >
          ¿Deseas vincular tu cuenta con Google?
        </h1>
        <p
          class="text-xs sm:text-sm text-on-surface-variant dark:text-slate-300 mt-2 text-center max-w-sm"
        >
          Detectamos que ya posees una cuenta registrada en JobNet con el correo
          <strong class="text-primary font-semibold break-all">{{
            email
          }}</strong
          >.
        </p>
      </div>

      <!-- Banner explicativo de seguridad -->
      <div
        class="mb-6 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs flex items-start gap-2.5"
      >
        <span
          class="material-symbols-outlined text-base mt-0.5 flex-shrink-0 text-blue-500"
          >verified_user</span
        >
        <div>
          <span class="font-semibold block mb-0.5"
            >Seguridad y Protección de Identidad</span
          >
          Para verificar que eres el propietario de la cuenta existente y
          prevenir accesos no autorizados, ingresa tu contraseña actual de
          JobNet.
        </div>
      </div>

      <!-- Alerta de Error -->
      <div
        v-if="errorMessage"
        role="alert"
        class="mb-5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-3 rounded-xl text-sm flex items-start gap-2"
      >
        <span class="material-symbols-outlined text-sm mt-0.5" aria-hidden="true"
          >error</span
        >
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Alerta de Éxito -->
      <div
        v-if="successMessage"
        role="status"
        class="mb-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl text-sm flex items-start gap-2"
      >
        <span class="material-symbols-outlined text-sm mt-0.5" aria-hidden="true"
          >check_circle</span
        >
        <span>{{ successMessage }}</span>
      </div>

      <!-- Formulario de vinculación -->
      <form @submit.prevent="handleLinkAccount" class="space-y-4">
        <div>
          <label
            for="link-password"
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-1.5"
          >
            Contraseña actual de JobNet
          </label>
          <div class="relative">
            <input
              id="link-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Ingresa tu contraseña de JobNet"
              :disabled="loading"
              class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 pr-11 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition p-1"
              :aria-label="
                showPassword ? 'Ocultar contraseña' : 'Ver contraseña'
              "
            >
              <span class="material-symbols-outlined text-lg">{{
                showPassword ? "visibility_off" : "visibility"
              }}</span>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs pt-1">
          <NuxtLink
            to="/forgot-password"
            class="text-primary hover:underline font-medium"
          >
            ¿Olvidaste tu contraseña?
          </NuxtLink>
        </div>

        <!-- Botones de Acción -->
        <div class="pt-2 flex flex-col gap-2.5">
          <button
            type="submit"
            :disabled="loading || !password"
            class="w-full h-12 bg-primary hover:bg-primary-container disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-sm hover:shadow active:scale-[0.99]"
          >
            <span
              v-if="loading"
              class="w-5 h-5 border-2 border-current/20 border-t-current rounded-full animate-spin"
              aria-hidden="true"
            ></span>
            <template v-else>
              <span class="material-symbols-outlined text-base">link</span>
              <span>Confirmar y Vincular Cuentas</span>
            </template>
          </button>

          <button
            type="button"
            @click="handleDeclineLinking"
            :disabled="loading"
            class="w-full h-11 bg-surface-container-low hover:bg-surface-container dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-outline-variant/60 dark:border-slate-700 text-on-surface-variant dark:text-slate-300 font-medium text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition active:scale-[0.99]"
          >
            <span>No vincular, continuar solo con contraseña</span>
          </button>
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
  title: "Vincular Cuenta - JobNet",
  description: "Vinculación de cuenta existente con Google Sign-In",
});

const route = useRoute();
const router = useRouter();
const { signIn } = useAuth();
const { isMockEnabled } = useMockSession();

const email = computed(() => String(route.query.email || (isMockEnabled.value ? "juan.perez.mock@jobnet-demo.test" : "")));
const googleSub = computed(() => String(route.query.googleSub || (isMockEnabled.value ? "google-oauth2|mock-123456789" : "")));

const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

onMounted(() => {
  if (isMockEnabled.value) return;
  if (!email.value || !googleSub.value) {
    router.replace("/login");
  }
});

const handleDeclineLinking = () => {
  router.push({
    path: "/login",
    query: {
      unlinked: "true",
      email: email.value,
    },
  });
};

const handleLinkAccount = async () => {
  if (!password.value) return;
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const res: any = await $fetch("/api/auth/link-account", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        googleSub: googleSub.value,
      },
    });

    if (res.success) {
      successMessage.value =
        "¡Cuentas vinculadas exitosamente! Iniciando tu sesión...";

      // Autenticar automáticamente al usuario con su cuenta unificada
      const result = await signIn("credentials", {
        email: email.value,
        password: password.value,
        redirect: false,
      });

      if (!result?.error) {
        setTimeout(() => {
          router.push("/");
        }, 800);
      } else {
        setTimeout(() => {
          router.push({
            path: "/login",
            query: { linked: "success" },
          });
        }, 1200);
      }
    }
  } catch (error: any) {
    errorMessage.value =
      error.data?.statusMessage ||
      error.statusMessage ||
      error.message ||
      "Error al vincular cuentas. Verifica que tu contraseña sea correcta.";
  } finally {
    loading.value = false;
  }
};
</script>
