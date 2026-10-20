<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
  >
    <div class="flex items-center gap-3 mb-4">
      <div
        class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"
      >
        <span class="material-symbols-outlined text-xl">link</span>
      </div>
      <div>
        <h3 class="text-base font-bold text-on-background dark:text-slate-100">
          Cuentas Vinculadas
        </h3>
        <p class="text-xs text-on-surface-variant dark:text-slate-300">
          Gestiona los métodos de inicio de sesión rápido e identidades federadas.
        </p>
      </div>
    </div>

    <div
      class="border border-outline-variant/60 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low/40 dark:bg-slate-800/40"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-outline-variant/60 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm"
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
        <div>
          <div class="flex items-center gap-2">
            <span
              class="font-semibold text-sm text-on-background dark:text-slate-100"
              >Google</span
            >
            <span
              v-if="isFederated"
              class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
            >
              <span class="material-symbols-outlined text-xs">check_circle</span>
              Vinculada
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20"
            >
              No vinculada
            </span>
          </div>
          <p class="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
            {{
              isFederated
                ? (userEmail || "Cuenta de Google conectada")
                : "Permite iniciar sesión rápidamente sin escribir tu contraseña"
            }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="!isFederated"
          type="button"
          @click="handleLinkGoogle"
          :disabled="linking"
          class="px-4 py-2 bg-primary hover:bg-primary-container text-white font-medium text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
        >
          <span
            v-if="linking"
            class="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"
            aria-hidden="true"
          ></span>
          <span v-else class="material-symbols-outlined text-sm">add_link</span>
          <span>Vincular Google</span>
        </button>
        <span
          v-else
          class="text-xs text-on-surface-variant dark:text-slate-400 font-medium px-2 py-1"
        >
          Activa para inicio de sesión
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isFederated: boolean;
  userEmail?: string;
}>();

const { signIn } = useAuth();
const linking = ref(false);

const handleLinkGoogle = async () => {
  linking.value = true;
  try {
    await signIn("cognito", {
      callbackUrl: "/settings",
    });
  } catch (err) {
    console.error("Error al iniciar vinculación con Google:", err);
    linking.value = false;
  }
};
</script>
