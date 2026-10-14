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
        v-if="mfaEnabled"
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
            Cada vez que inicies sesión, se solicitará tu contraseña de acceso y
            el código generado por tu aplicación de autenticador.
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
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  userId: string;
  initialMfaState?: boolean;
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

watch(
  () => props.initialMfaState,
  (newVal) => {
    mfaEnabled.value = Boolean(newVal);
  },
);

const goToSetupMfa = () => {
  router.push("/setup-mfa");
};

const { data: sessionData } = useAuth();

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
