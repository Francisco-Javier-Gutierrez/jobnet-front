<template>
  <header
    class="md:hidden fixed top-0 w-full z-50 bg-surface/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-outline-variant/60 dark:border-slate-800 h-16 flex items-center justify-between px-4 transition-transform duration-300 ease-in-out transition-colors duration-200 select-none"
    :class="isVisible ? 'translate-y-0' : '-translate-y-full'"
    role="banner"
  >
    <!-- Left side: Hamburger Button + Brand Logo + App Name -->
    <div class="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
      <button
        type="button"
        @click="$emit('toggle-menu')"
        class="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container/60 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer"
        aria-label="Abrir menú de navegación"
        title="Menú"
      >
        <span class="material-symbols-outlined text-[24px]">menu</span>
      </button>

      <NuxtLink
        to="/"
        class="flex items-center gap-2 group"
        aria-label="Inicio de JobNet"
      >
        <img
          src="/logo.svg"
          alt="JobNet Logo"
          class="h-8 w-8 filter brightness-100 dark:brightness-0 dark:invert transition-transform group-hover:scale-105"
        />
        <span class="font-extrabold text-base tracking-tight text-on-surface dark:text-slate-100">
          Job<span class="text-primary dark:text-indigo-400">Net</span>
        </span>
      </NuxtLink>
    </div>

    <!-- Right side: Clean, un-crowded action cluster -->
    <div class="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
      <!-- Search (Omnibox Trigger) -->
      <button
        type="button"
        @click="openCommandPalette"
        class="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container/60 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer"
        aria-label="Abrir buscador global y comandos (Ctrl+K)"
        title="Buscar (Ctrl+K)"
      >
        <span class="material-symbols-outlined text-[22px]">search</span>
      </button>

      <!-- Theme Toggle -->
      <ThemeToggle mode="icon" />

      <!-- Authenticated Profile & Notifications -->
      <template v-if="status === 'authenticated'">
        <!-- Notifications with active indicator -->
        <NuxtLink
          to="/notifications"
          class="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container/60 dark:hover:bg-slate-800 transition active:scale-95 relative"
          :class="[isActive('/notifications') ? 'text-primary bg-primary/10 dark:bg-indigo-950/60 font-bold' : '']"
          aria-label="Notificaciones"
        >
          <span class="material-symbols-outlined text-[22px]">notifications</span>
        </NuxtLink>

        <!-- User Profile Avatar Pill -->
        <NuxtLink
          :to="profileRoute"
          class="w-8 h-8 rounded-full border transition flex items-center justify-center text-xs font-bold shadow-xs active:scale-95 overflow-hidden ml-0.5"
          :class="[
            isActive(profileRoute)
              ? 'bg-primary text-white border-primary ring-2 ring-primary/30 dark:ring-indigo-400/40'
              : 'bg-primary/10 border-primary/20 text-primary hover:scale-105',
          ]"
          :aria-label="`Perfil de ${userName}`"
        >
          <img
            v-if="profilePic"
            :src="profilePic"
            alt="Foto de perfil"
            class="w-full h-full object-cover"
          />
          <span v-else>{{ userInitial }}</span>
        </NuxtLink>
      </template>

      <!-- Guest Login Button -->
      <template v-else>
        <NuxtLink
          to="/login"
          class="text-xs bg-primary hover:bg-primary-container text-white px-3.5 py-1.5 rounded-xl font-bold transition shadow-xs active:scale-95 ml-1"
          aria-label="Iniciar sesión"
        >
          Entrar
        </NuxtLink>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useCommandPalette } from "~/composables/useCommandPalette";
import { useProfileState } from "~/composables/useProfileState";

const props = defineProps<{
  isVisible?: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-menu"): void;
}>();

const route = useRoute();
const { status, data, signOut } = useAuth();
const { profilePic, hasFetched, fetchProfilePic } = useProfileState();
const { openCommandPalette } = useCommandPalette();

watchEffect(() => {
  if (
    status.value === "authenticated" &&
    data.value?.user?.id &&
    !hasFetched.value
  ) {
    fetchProfilePic(data.value.user.id as string);
  }
});

const userRole = computed<string>(() => {
  if (status.value !== "authenticated") return "guest";
  const user = data.value?.user;
  const tipo = (user?.tipoUsuario || "").toUpperCase();
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
    case "moderator":
    case "organization":
      return null;
    default:
      return "/vacancies";
  }
});

const profileRoute = computed(() => {
  return "/profile";
});

const onSignOut = async () => {
  await signOut({ callbackUrl: "/login" });
};
</script>
