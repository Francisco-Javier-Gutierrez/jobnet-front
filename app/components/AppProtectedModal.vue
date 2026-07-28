<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
        @click.self="closeProtectedModal"
      >
        <div
          class="w-full max-w-sm sm:max-w-md bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-center space-y-5 relative"
          role="dialog"
          aria-modal="true"
          aria-labelledby="protected-modal-title"
        >
          <!-- Close button top-right -->
          <button
            @click="closeProtectedModal"
            class="absolute top-3.5 right-3.5 text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 p-1.5 rounded-lg transition"
            aria-label="Cerrar modal"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>

          <!-- Lock Icon Header -->
          <div
            class="mx-auto w-14 h-14 rounded-full bg-primary/10 dark:bg-indigo-500/20 border border-primary/20 flex items-center justify-center text-primary dark:text-indigo-400"
          >
            <span class="material-symbols-outlined text-2xl" aria-hidden="true"
              >lock</span
            >
          </div>

          <div class="space-y-2">
            <h2
              id="protected-modal-title"
              class="text-lg sm:text-xl font-bold text-on-background dark:text-slate-100"
            >
              Acción Protegida
            </h2>
            <p
              class="text-xs sm:text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed px-1 sm:px-3"
            >
              {{ modalMessage }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3 pt-2">
            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="closeProtectedModal"
                class="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant/60 dark:border-slate-700 font-semibold text-xs sm:text-sm text-on-surface dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                @click="goToLogin"
                class="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-xs sm:text-sm text-center shadow-sm transition"
              >
                Iniciar Sesión
              </button>
            </div>

            <div>
              <button
                type="button"
                @click="goToRegister"
                class="text-xs font-semibold text-primary dark:text-indigo-400 hover:underline transition"
              >
                ¿Aún no tienes cuenta? Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const router = useRouter();
const { isModalOpen, modalMessage, closeProtectedModal } = useProtectedAction();

const goToLogin = () => {
  closeProtectedModal();
  router.push("/login");
};

const goToRegister = () => {
  closeProtectedModal();
  router.push("/register");
};
</script>
