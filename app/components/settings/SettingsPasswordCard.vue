<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <div class="flex items-center gap-2 border-b border-outline-variant/40 pb-3">
      <span class="material-symbols-outlined text-primary">key</span>
      <h2 class="text-base font-bold text-on-background dark:text-slate-100">
        Cambiar Contraseña
      </h2>
    </div>

    <p class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed">
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
          <span v-if="isSubmitting" class="material-symbols-outlined animate-spin text-sm"
            >progress_activity</span
          >
          <span v-else class="material-symbols-outlined text-sm">lock_reset</span>
          {{ isSubmitting ? "Actualizando..." : "Actualizar Contraseña" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const { data: sessionData } = useAuth();

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

  const accessToken =
    (sessionData.value as any)?.accessToken ||
    (sessionData.value as any)?.idToken;

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
      error.data?.statusMessage || error.message || "Error al actualizar contraseña.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
