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
        v-if="isOpen"
        class="fixed inset-0 z-[99960] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="google-role-modal-title"
        aria-describedby="google-role-modal-desc"
        data-modal-active="true"
      >
        <div
          class="w-full max-w-lg bg-surface-container-lowest dark:bg-slate-900 border border-amber-500/30 dark:border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 relative"
        >
          <!-- Header Icon -->
          <div class="flex items-center gap-3.5">
            <div
              class="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0"
            >
              <span
                class="material-symbols-outlined text-2xl"
                aria-hidden="true"
                >shield_lock</span
              >
            </div>
            <div>
              <h2
                id="google-role-modal-title"
                class="text-lg sm:text-xl font-bold text-on-background dark:text-slate-100"
              >
                Aviso de Seguridad: Acceso con Google
              </h2>
              <p
                class="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5"
              >
                Estatutos de Autenticación Federada y Segregación de Roles
              </p>
            </div>
          </div>

          <!-- Role Identification Card -->
          <div
            class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-200 text-xs space-y-1.5"
          >
            <div class="flex items-center justify-between">
              <span
                class="font-medium text-on-surface-variant dark:text-slate-400"
                >Cuenta vinculada:</span
              >
              <strong class="font-semibold text-primary break-all">{{
                userEmail
              }}</strong>
            </div>
            <div class="flex items-center justify-between">
              <span
                class="font-medium text-on-surface-variant dark:text-slate-400"
                >Rol institucional principal:</span
              >
              <span
                class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 uppercase tracking-wider"
              >
                {{ nativeRoleText }}
              </span>
            </div>
          </div>

          <!-- Descriptive Notice -->
          <div
            id="google-role-modal-desc"
            class="space-y-3 text-xs sm:text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed"
          >
            <p>
              De conformidad con los
              <strong>Términos y Condiciones de Uso</strong>
              (Cláusula 3.1) y por estrictos protocolos de seguridad
              institucional:
            </p>
            <div
              class="p-3 bg-surface-container-low dark:bg-slate-800/70 border border-outline-variant/60 dark:border-slate-700 rounded-xl space-y-2 text-xs"
            >
              <div class="flex items-start gap-2">
                <span
                  class="material-symbols-outlined text-primary text-base mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                  >check_circle</span
                >
                <p>
                  <strong>Sesión estrictamente como Candidato:</strong> Siempre
                  que decidas ingresar mediante Google, operarás de manera
                  <strong>estricta y exclusiva como CANDIDATO</strong>.
                </p>
              </div>
              <div class="flex items-start gap-2">
                <span
                  class="material-symbols-outlined text-amber-600 dark:text-amber-400 text-base mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                  >lock</span
                >
                <p>
                  <strong>Aislamiento de privilegios:</strong> No tendrás acceso
                  a herramientas administrativas, consolas de moderación ni
                  gestión de empresa dentro de esta sesión social.
                </p>
              </div>
            </div>
            <p class="text-xs text-on-surface-variant/80 dark:text-slate-400">
              Para ejercer funciones correspondientes a tu rol de
              <strong>{{ nativeRoleText }}</strong
              >, deberás finalizar esta sesión e ingresar mediante tu correo y
              contraseña habitual.
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              @click="handleAccept"
              class="w-full sm:flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-xs sm:text-sm text-center shadow-sm transition active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-base">check</span>
              <span>Entendido y Aceptar (Continuar como Candidato)</span>
            </button>
            <button
              type="button"
              @click="handleLogout"
              class="w-full sm:w-auto py-3 px-4 rounded-xl border border-outline-variant/60 dark:border-slate-700 font-semibold text-xs sm:text-sm text-on-surface dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800 transition active:scale-[0.99] whitespace-nowrap"
            >
              <span>Ingresar con Contraseña</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { data: session, signOut } = useAuth();
const route = useRoute();
const router = useRouter();

const isOpen = ref(false);

const user = computed(() => (session.value?.user as any) || null);
const userEmail = computed(() => user.value?.email || "");

const nativeRoleText = computed(() => {
  const role = String(user.value?.nativeRole || "").toUpperCase();
  if (role === "ADMIN") return "Administrador";
  if (role === "MODERATOR") return "Moderador";
  if (role === "ORGANIZACION" || role === "EMPRESA") return "Organización";
  return role || "Rol Privilegiado";
});

const evaluateNotice = () => {
  if (import.meta.server) return;
  const currentUser = user.value;
  if (!currentUser) {
    isOpen.value = false;
    return;
  }

  const isFederated = Boolean(currentUser.isFederated);
  const hasPrivileged = Boolean(currentUser.hasPrivilegedNativeAccount);

  if (!isFederated || !hasPrivileged) {
    isOpen.value = false;
    return;
  }

  const userKey = currentUser.id || currentUser.email;
  const storageKey = `jobnet_ack_google_candidate_${userKey}`;
  const alreadyAccepted = sessionStorage.getItem(storageKey);

  // If entering via direct redirect with ?google_login=1 or if not acknowledged in this session
  if (!alreadyAccepted || route.query.google_login === "1") {
    isOpen.value = true;
  }
};

onMounted(() => {
  evaluateNotice();
});

watch(
  () => [session.value, route.query],
  () => {
    evaluateNotice();
  },
  { deep: true },
);

const handleAccept = () => {
  const currentUser = user.value;
  if (currentUser) {
    const userKey = currentUser.id || currentUser.email;
    const storageKey = `jobnet_ack_google_candidate_${userKey}`;
    sessionStorage.setItem(storageKey, "accepted");
  }
  isOpen.value = false;

  // Clean up URL query parameter if present
  if (route.query.google_login) {
    const nextQuery = { ...route.query };
    delete nextQuery.google_login;
    router.replace({ query: nextQuery });
  }
};

const handleLogout = async () => {
  isOpen.value = false;
  await signOut({
    callbackUrl: "/login",
  });
};
</script>
