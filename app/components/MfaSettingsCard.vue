<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <div
      class="flex items-center justify-between border-b border-outline-variant/40 pb-3 flex-wrap gap-2"
    >
      <h2
        class="text-base font-bold text-on-background dark:text-slate-100 flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-primary">shield_lock</span>
        Autenticación de Dos Factores (MFA / TOTP)
      </h2>
      <span
        v-if="isFederatedUser"
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
      >
        <span class="material-symbols-outlined text-xs">verified</span>
        Google OAuth
      </span>
      <span
        v-else-if="mfaEnabled"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
      >
        <span class="material-symbols-outlined text-xs">check_circle</span>
        MFA Activado
      </span>
      <span
        v-else
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
      >
        <span class="material-symbols-outlined text-xs">warning</span>
        MFA Inactivo
      </span>
    </div>

    <!-- Federated Users Notice (Google Sign-In) -->
    <div
      v-if="isFederatedUser"
      class="space-y-4 bg-surface-container-low/40 dark:bg-slate-800/40 p-5 rounded-2xl border border-outline-variant/50"
    >
      <div class="flex items-start gap-3.5">
        <div
          class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-outline-variant/40 flex items-center justify-center flex-shrink-0"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
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
        <div class="space-y-1.5 text-left">
          <div class="flex items-center gap-2 flex-wrap">
            <p class="text-xs font-bold text-on-background dark:text-slate-100">
              Seguridad y 2FA administrados por Google
            </p>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
            >
              Cuenta Federada
            </span>
          </div>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
          >
            Has iniciado sesión a través de Google Sign-In. La verificación en dos
            pasos (MFA / 2FA), las llaves de seguridad físicas y las alertas de
            acceso están protegidas directamente bajo tu cuenta de Google.
          </p>
        </div>
      </div>

      <div
        class="p-3 bg-surface-container-lowest dark:bg-slate-900 rounded-xl border border-outline-variant/40 flex items-start gap-2.5 text-xs text-on-surface-variant dark:text-slate-300"
      >
        <span class="material-symbols-outlined text-primary text-base mt-0.5"
          >info</span
        >
        <span>
          Para activar o configurar la verificación en dos pasos de tu cuenta,
          debes gestionarla directamente en tu perfil de Google.
        </span>
      </div>

      <div class="pt-1">
        <a
          href="https://myaccount.google.com/signinoptions/two-step-verification"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container hover:bg-surface-container-high dark:bg-slate-700/60 dark:hover:bg-slate-700 border border-outline-variant/60 dark:border-slate-600 text-on-surface dark:text-slate-100 font-bold text-xs rounded-xl transition shadow-xs active:scale-95"
        >
          <span>Gestionar 2FA en Google</span>
          <span class="material-symbols-outlined text-xs">open_in_new</span>
        </a>
      </div>
    </div>

    <!-- Standard MFA section for email/password users -->
    <template v-else>
      <p
        class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
      >
        Protege tu cuenta agregando una capa adicional de seguridad con un token
        temporal TOTP (Google Authenticator, Microsoft Authenticator o Authy).
      </p>

      <!-- Feedback alert -->
      <div
        v-if="statusMsg"
        class="p-3 rounded-xl text-xs font-semibold flex items-center gap-2"
        :class="
          statusSuccess
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200'
        "
      >
        <span class="material-symbols-outlined text-sm">{{
          statusSuccess ? "check_circle" : "error"
        }}</span>
        {{ statusMsg }}
      </div>

      <!-- Active State Actions -->
      <div
        v-if="mfaEnabled"
        class="space-y-3 bg-surface-container-low/40 dark:bg-slate-800/40 p-4 rounded-xl border border-outline-variant/50"
      >
        <div class="flex items-start gap-3">
          <span
            class="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-xl mt-0.5"
            >verified_user</span
          >
          <div class="space-y-1 text-left">
            <p class="text-xs font-bold text-on-background dark:text-slate-100">
              Tu cuenta se encuentra protegida con MFA TOTP
            </p>
            <p class="text-[11px] text-on-surface-variant dark:text-slate-400">
              Cada vez que inicies sesión, se solicitará tu contraseña de acceso
              y el código generado por tu aplicación de autenticador.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-2 flex-wrap">
          <button
            type="button"
            @click="goToSetupMfa"
            class="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary dark:text-indigo-400 font-bold text-xs rounded-xl transition flex items-center gap-1.5 active:scale-95"
          >
            <span class="material-symbols-outlined text-sm">qr_code_2</span>
            Reconfigurar Dispositivo MFA
          </button>

          <button
            type="button"
            @click="disableMfa"
            :disabled="disabling"
            class="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl transition disabled:opacity-50 flex items-center gap-1.5 active:scale-95"
          >
            <span class="material-symbols-outlined text-sm">no_encryption</span>
            {{ disabling ? "Desactivando..." : "Desactivar MFA" }}
          </button>
        </div>
      </div>

      <!-- Inactive State Actions -->
      <div
        v-else
        class="space-y-3 bg-surface-container-low/40 dark:bg-slate-800/40 p-4 rounded-xl border border-outline-variant/50"
      >
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-amber-500 text-xl mt-0.5"
            >shield</span
          >
          <div class="space-y-1 text-left">
            <p class="text-xs font-bold text-on-background dark:text-slate-100">
              Autenticación de dos factores desactivada
            </p>
            <p class="text-[11px] text-on-surface-variant dark:text-slate-400">
              Recomendado para prevenir accesos no autorizados a tu cuenta de
              JobNet.
            </p>
          </div>
        </div>

        <div class="pt-1">
          <button
            type="button"
            @click="goToSetupMfa"
            class="px-4 py-2.5 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-2 active:scale-95"
          >
            <span class="material-symbols-outlined text-sm">lock_reset</span>
            Configurar MFA / Vincular Autenticador
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  userId: string;
  initialMfaState?: boolean;
  isFederated?: boolean;
}>();

const emit = defineEmits<{
  (e: "mfa-updated", enabled: boolean): void;
}>();

const router = useRouter();
const config = useRuntimeConfig();

const mfaEnabled = ref(props.initialMfaState || false);
const disabling = ref(false);
const statusMsg = ref("");
const statusSuccess = ref(true);

const { data: sessionData } = useAuth();

const isFederatedUser = computed(() => {
  if (props.isFederated !== undefined) return props.isFederated;
  const user = sessionData.value?.user as any;
  if (!user) return false;
  return Boolean(
    user.isFederated ||
      user.provider === "cognito" ||
      (typeof user.id === "string" &&
        user.id.toLowerCase().startsWith("google_")),
  );
});

watch(
  () => props.initialMfaState,
  (newVal) => {
    mfaEnabled.value = Boolean(newVal);
  },
);

const goToSetupMfa = () => {
  router.push("/setup-mfa");
};

const disableMfa = async () => {
  if (!props.userId) return;
  disabling.value = true;
  statusMsg.value = "";

  const s = sessionData.value as Record<string, any> | null;
  const accessToken =
    sessionData.value?.user?.idToken || s?.accessToken || s?.idToken;

  try {
    // 1. Disable in Cognito if accessToken is present
    if (accessToken) {
      await $fetch("/api/mfa/disable", {
        method: "POST",
        body: { accessToken },
      }).catch((err) => {
        console.warn("Cognito disable MFA exception:", err);
      });
    }

    // 2. Disable in DynamoDB profile
    await $fetch<any>(`${config.public.apiUrl}/profile/${props.userId}`, {
      method: "POST",
      body: {
        mfaConfigured: false,
        mfaEnabled: false,
      },
    });

    mfaEnabled.value = false;
    statusSuccess.value = true;
    statusMsg.value = "MFA desactivado correctamente.";
    emit("mfa-updated", false);
    setTimeout(() => {
      statusMsg.value = "";
    }, 3000);
  } catch (error: any) {
    statusSuccess.value = false;
    statusMsg.value = error.message || "Error al desactivar MFA";
  } finally {
    disabling.value = false;
  }
};
</script>
