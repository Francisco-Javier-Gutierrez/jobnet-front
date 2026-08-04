<template>
  <header
    class="md:hidden fixed top-0 w-full z-50 bg-surface/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-outline-variant/60 dark:border-slate-800 h-16 flex items-center justify-between px-4 transition-transform duration-300 ease-in-out transition-colors duration-200"
    :class="isVisible ? 'translate-y-0' : '-translate-y-full'"
    role="banner"
  >
    <!-- Left side: Search & Theme Toggle -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <NuxtLink
        v-if="searchRoute"
        :to="searchRoute"
        class="transition p-2 flex items-center justify-center rounded-xl"
        :class="[
          isActive(searchRoute)
            ? 'bg-primary/10 text-primary dark:bg-indigo-950/60 dark:text-indigo-400 font-bold'
            : 'text-on-surface-variant dark:text-slate-300 hover:text-primary',
        ]"
        aria-label="Buscar"
      >
        <span class="material-symbols-outlined text-[24px]">search</span>
      </NuxtLink>
      <ThemeToggle />
    </div>

    <!-- Center: Logo -->
    <NuxtLink
      to="/"
      class="flex items-center justify-center absolute left-1/2 -translate-x-1/2"
      aria-label="Inicio de JobNet"
    >
      <img
        src="/logo.svg"
        alt="JobNet Logo"
        class="h-14 w-14 filter brightness-100 dark:brightness-0 dark:invert transition-all hover:scale-105"
      />
    </NuxtLink>

    <!-- Right side: Profile & Actions -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <template v-if="status === 'authenticated'">
        <NuxtLink
          to="/notifications"
          class="text-on-surface-variant dark:text-slate-300 hover:text-primary transition p-2 flex items-center justify-center rounded-xl"
          :class="[
            isActive('/notifications')
              ? 'bg-primary/10 text-primary dark:bg-indigo-950/60 dark:text-indigo-400 font-bold'
              : '',
          ]"
          aria-label="Notificaciones"
        >
          <span class="material-symbols-outlined text-[22px]"
            >notifications</span
          >
        </NuxtLink>
        <button
          @click="onSignOut"
          class="text-on-surface-variant dark:text-slate-300 hover:text-rose-600 transition p-2 flex items-center justify-center"
          aria-label="Cerrar sesión"
        >
          <span class="material-symbols-outlined text-[22px]">logout</span>
        </button>
        <NuxtLink
          :to="profileRoute"
          class="w-8 h-8 rounded-full border transition flex items-center justify-center text-xs font-bold shadow-sm active:scale-95"
          :class="[
            isActive(profileRoute)
              ? 'bg-primary text-white border-primary ring-2 ring-primary/30 dark:ring-indigo-400/40'
              : 'bg-primary/10 border-primary/20 text-primary hover:scale-105',
          ]"
          :aria-label="`Perfil de ${userName}`"
        >
          {{ userInitial }}
        </NuxtLink>
      </template>
      <template v-else>
        <NuxtLink
          to="/login"
          class="text-xs bg-primary hover:bg-primary-container text-white px-3 py-1.5 rounded-lg font-medium transition"
          aria-label="Iniciar sesión"
        >
          Entrar
        </NuxtLink>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  isVisible?: boolean;
}>();

const route = useRoute();
const { status, data, signOut } = useAuth();

const userRole = computed<string>(() => {
  if (status.value !== "authenticated") return "guest";
  const user = data.value?.user as any;
  const tipo = (user?.tipoUsuario || user?.role || "").toUpperCase();
  if (tipo === "ORGANIZACION" || tipo === "EMPRESA") return "organization";
  if (tipo === "ADMIN") return "admin";
  if (tipo === "MODERATOR" || tipo === "MODERADOR") return "moderator";
  return "candidate";
});

const userName = computed(
  () => data.value?.user?.name || data.value?.user?.email || "Usuario",
);
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

const isActive = (path: string | null): boolean => {
  if (!path) return false;
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};

const searchRoute = computed(() => {
  switch (userRole.value) {
    case "admin":
      return null;
    case "moderator":
      return null;
    case "organization":
      return "/companies";
    default:
      return "/feed";
  }
});

const profileRoute = computed(() => {
  if (userRole.value === "organization") return "/company/edit";
  return "/profile";
});

const onSignOut = async () => {
  await signOut({ callbackUrl: "/login" });
};
</script>
