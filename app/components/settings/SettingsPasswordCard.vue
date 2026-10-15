<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <div
      class="flex items-center justify-between border-b border-outline-variant/40 pb-3 flex-wrap gap-2"
    >
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">key</span>
        <h2 class="text-base font-bold text-on-background dark:text-slate-100">
          Cambiar Contraseña
        </h2>
      </div>
      <span
        v-if="isFederatedUser"
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
      >
        <span class="material-symbols-outlined text-xs">link</span>
        Cuenta Federada
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
          <span class="material-symbols-outlined text-primary text-xl"
            >key_off</span
          >
        </div>
        <div class="space-y-1.5 text-left">
          <div class="flex items-center gap-2 flex-wrap">
            <p class="text-xs font-bold text-on-background dark:text-slate-100">
              Contraseña administrada por Google
            </p>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
            >
              Sin Contraseña Local
            </span>
          </div>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
          >
            Tu cuenta no utiliza una contraseña independiente en JobNet porque
            inicias sesión mediante autenticación federada con Google. No es
            necesario ni posible modificar contraseñas en JobNet para este
            usuario.
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
          Si deseas cambiar la contraseña de tu cuenta principal o configurar
          métodos de recuperación de acceso, dirígete a la configuración de
          seguridad de tu cuenta de Google.
        </span>
      </div>

      <div class="pt-1">
        <a
          href="https://myaccount.google.com/signinoptions/password"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container hover:bg-surface-container-high dark:bg-slate-700/60 dark:hover:bg-slate-700 border border-outline-variant/60 dark:border-slate-600 text-on-surface dark:text-slate-100 font-bold text-xs rounded-xl transition shadow-xs active:scale-95"
        >
          <span>Gestionar Contraseña en Google</span>
          <span class="material-symbols-outlined text-xs">open_in_new</span>
        </a>
      </div>
    </div>

    <!-- Regular Password Change Form -->
    <template v-else>
      <p
        class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
      >
        Actualiza tu contraseña periódicamente para mantener tu cuenta segura.
      </p>

      <!-- Feedback message -->
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

      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label
            for="old-password"
            class="block text-xs font-bold text-on-surface mb-1.5"
            >Contraseña Actual</label
          >
          <input
            id="old-password"
            v-model="oldPassword"
            type="password"
            required
            class="w-full bg-surface-container-low dark:bg-slate-800/80 border border-outline-variant/40 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-on-background dark:text-slate-100 outline-none focus:border-primary transition"
          />
        </div>

        <div>
          <label
            for="new-password"
            class="block text-xs font-bold text-on-surface mb-1.5"
            >Nueva Contraseña</label
          >
          <input
            id="new-password"
            v-model="newPassword"
            type="password"
            required
            class="w-full bg-surface-container-low dark:bg-slate-800/80 border border-outline-variant/40 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-on-background dark:text-slate-100 outline-none focus:border-primary transition"
          />
          <p class="text-[10px] text-on-surface-variant dark:text-slate-400 mt-1">
            La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas,
            minúsculas y un número.
          </p>
        </div>

        <div>
          <label
            for="confirm-password"
            class="block text-xs font-bold text-on-surface mb-1.5"
            >Confirmar Nueva Contraseña</label
          >
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            required
            class="w-full bg-surface-container-low dark:bg-slate-800/80 border border-outline-variant/40 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-on-background dark:text-slate-100 outline-none focus:border-primary transition"
          />
        </div>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2.5 bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-2 active:scale-95"
          >
            <span
              v-if="isSubmitting"
              class="w-5 h-5 border-2 border-current/20 border-t-current rounded-full animate-spin"
              aria-hidden="true"
            ></span>
            <span v-else class="material-symbols-outlined text-sm"
              >lock_reset</span
            >
            {{ isSubmitting ? "Actualizando..." : "Actualizar Contraseña" }}
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isFederated?: boolean;
}>();

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

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isSubmitting = ref(false);
const statusMsg = ref("");
const statusSuccess = ref(true);

const handleChangePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    statusSuccess.value = false;
    statusMsg.value = "Las contraseñas nuevas no coinciden.";
    return;
  }

  isSubmitting.value = true;
  statusMsg.value = "";

  const s = sessionData.value as Record<string, any> | null;
  const accessToken =
    sessionData.value?.user?.idToken || s?.accessToken || s?.idToken;

  try {
    const res = await $fetch("/api/change-password", {
      method: "POST",
      body: {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
        accessToken,
      },
    });

    if (res && res.success) {
      statusSuccess.value = true;
      statusMsg.value = "¡Contraseña actualizada exitosamente!";
      oldPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";
    }
  } catch (error: any) {
    statusSuccess.value = false;
    statusMsg.value =
      error.data?.statusMessage ||
      error.message ||
      "Error al actualizar contraseña.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
