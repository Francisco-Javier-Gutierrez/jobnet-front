<template>
  <div class="md:hidden">
    <!-- Fixed Mobile Top Header -->
    <header
      class="fixed top-0 w-full z-50 bg-white dark:bg-slate-950 border-b border-outline-variant/60 dark:border-slate-800 h-16 flex items-center justify-between px-4 transition-transform duration-300 ease-in-out select-none shadow-xs"
      :class="headerVisibilityClass"
      role="banner"
    >
      <!-- Left side: Animated Hamburger Toggle + Brand Logo + App Name -->
      <div class="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <button
          type="button"
          @click="toggleMenu"
          class="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container/60 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer"
          :class="
            isMobileMenuOpen
              ? 'bg-primary/10 text-primary dark:bg-indigo-950/60 dark:text-indigo-400'
              : ''
          "
          :aria-expanded="isMobileMenuOpen"
          aria-label="Alternar menú de navegación"
          :title="isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
        >
          <span
            class="material-symbols-outlined text-[24px] transition-transform duration-200"
            :class="
              isMobileMenuOpen
                ? 'rotate-90 text-primary dark:text-indigo-400'
                : 'rotate-0'
            "
          >
            {{ isMobileMenuOpen ? "close" : "menu" }}
          </span>
        </button>

        <NuxtLink
          to="/"
          class="flex items-center group"
          aria-label="Inicio"
          @click="closeMenu"
        >
          <img
            src="/logo.svg"
            alt="Logo"
            class="h-9 w-9 filter brightness-100 dark:brightness-0 dark:invert transition-transform group-hover:scale-105"
          />
        </NuxtLink>
      </div>

      <!-- Right side: Quick Action Cluster -->
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

        <!-- Dynamic Auth State Cluster (ClientOnly to prevent SSR hydration mismatches) -->
        <ClientOnly>
          <template v-if="effectiveStatus === 'authenticated'">
            <!-- Notifications with active indicator -->
            <NuxtLink
              to="/notifications"
              @click="closeMenu"
              class="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container/60 dark:hover:bg-slate-800 transition active:scale-95 relative"
              :class="[
                isActive('/notifications')
                  ? 'text-primary bg-primary/10 dark:bg-indigo-950/60 font-bold'
                  : '',
              ]"
              aria-label="Notificaciones"
            >
              <span class="material-symbols-outlined text-[22px]"
                >notifications</span
              >
            </NuxtLink>

            <!-- User Profile Avatar Pill -->
            <NuxtLink
              :to="profileRoute"
              @click="closeMenu"
              class="w-8 h-8 rounded-full border transition flex items-center justify-center text-xs font-bold shadow-xs active:scale-95 overflow-hidden ml-0.5"
              :class="[
                isActive(profileRoute)
                  ? 'bg-primary text-white border-primary ring-2 ring-primary/30 dark:ring-indigo-400/40'
                  : 'bg-primary/10 border-primary/20 text-primary hover:scale-105',
              ]"
              :aria-label="`Perfil de ${userName}`"
            >
              <img
                v-if="userAvatar"
                :src="userAvatar"
                alt="Foto de perfil"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ userInitial }}</span>
            </NuxtLink>
          </template>

          <template v-else>
            <!-- Guest Login Button -->
            <NuxtLink
              to="/login"
              @click="closeMenu"
              class="text-xs bg-primary hover:bg-primary-container text-white px-3 py-1.5 rounded-xl font-bold transition shadow-xs active:scale-95 ml-0.5"
              aria-label="Iniciar sesión"
            >
              Entrar
            </NuxtLink>
          </template>

          <template #fallback>
            <div
              class="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-700/50 animate-pulse ml-0.5"
            ></div>
          </template>
        </ClientOnly>
      </div>
    </header>

    <!-- Backdrop Blur Dimmer for Open Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 top-16 bg-black/60 z-40"
        @click="closeMenu"
      />
    </Transition>

    <!-- Slide-Down Desplegable Mobile Navigation Menu -->
    <Transition
      enter-active-class="transition duration-250 ease-out transform"
      enter-from-class="-translate-y-4 opacity-0 scale-98"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="-translate-y-4 opacity-0 scale-98"
    >
      <nav
        v-if="isMobileMenuOpen"
        class="fixed top-16 inset-x-0 bottom-0 z-40 bg-white dark:bg-slate-950 flex flex-col justify-between p-4 overflow-y-auto border-t border-outline-variant/40 dark:border-slate-800 shadow-2xl select-none"
        aria-label="Menú desplegable móvil"
      >
        <div class="flex-1 space-y-4 pb-4">
          <!-- Quick Search Bar inside Dropdown -->
          <button
            type="button"
            @click="
              closeMenu();
              openCommandPalette();
            "
            class="w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-on-surface-variant dark:text-slate-400 bg-surface-container/60 hover:bg-surface-container dark:bg-slate-800/60 rounded-xl border border-outline-variant/40 dark:border-slate-700/60 transition cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            <div class="flex items-center gap-2.5">
              <span
                class="material-symbols-outlined text-[18px] text-primary dark:text-indigo-400"
                >search</span
              >
              <span
                class="font-medium text-on-surface-variant dark:text-slate-300"
                >Buscar empleo, empresa o comando...</span
              >
            </div>
            <span
              class="text-[10px] font-bold text-on-surface-variant/60 bg-surface dark:bg-slate-700/60 px-1.5 py-0.5 rounded border border-outline-variant/30"
              >Ctrl+K</span
            >
          </button>

          <!-- Primary CTA Button per Role -->
          <div v-if="primaryAction">
            <button
              type="button"
              @click="handleNavClick(primaryAction, closeMenu)"
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 text-white text-xs font-bold shadow-md shadow-primary/20 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              <span class="material-symbols-outlined text-[18px] font-bold"
                >add</span
              >
              <span>{{ primaryAction.label }}</span>
            </button>
          </div>

          <!-- Categorized Navigation Sections -->
          <div class="space-y-4 pt-1">
            <div
              v-for="section in navSections"
              :key="section.title"
              class="space-y-1"
            >
              <p
                class="px-3 text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant/60 dark:text-slate-500 select-none"
              >
                {{ section.title }}
              </p>
              <div class="space-y-0.5">
                <a
                  v-for="item in section.items"
                  :key="item.to"
                  href="#"
                  @click.prevent="handleNavClick(item, closeMenu)"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150"
                  :class="[
                    isActive(item.to)
                      ? 'bg-primary/10 text-primary dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold shadow-2xs'
                      : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800 hover:text-on-surface dark:hover:text-white',
                  ]"
                >
                  <span
                    class="material-symbols-outlined text-[20px]"
                    :class="
                      isActive(item.to)
                        ? 'text-primary dark:text-indigo-400'
                        : 'text-on-surface-variant dark:text-slate-400'
                    "
                  >
                    {{ item.icon }}
                  </span>
                  <span>{{ item.label }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Actions (Theme Toggle & Account Management) -->
        <div
          class="flex-shrink-0 pt-3 border-t border-outline-variant/60 dark:border-slate-800 space-y-3 mt-auto bg-white dark:bg-slate-950"
        >
          <!-- Appearance Toggle -->
          <div
            class="flex items-center justify-between px-3 py-2 bg-surface-container/50 dark:bg-slate-800/60 rounded-xl"
          >
            <span
              class="text-xs font-semibold text-on-surface-variant dark:text-slate-400"
              >Apariencia</span
            >
            <ThemeToggle mode="pills" />
          </div>

          <!-- Dynamic Auth State Card (ClientOnly) -->
          <ClientOnly>
            <!-- Authenticated Profile Card & Logout -->
            <div v-if="effectiveStatus === 'authenticated'" class="space-y-2">
              <NuxtLink
                :to="profileRoute"
                @click="closeMenu"
                class="flex items-center justify-between p-2.5 bg-surface-container/40 dark:bg-slate-800/40 hover:bg-surface-container/80 rounded-xl transition group"
              >
                <div class="flex items-center gap-3 overflow-hidden min-w-0">
                  <div
                    v-if="userAvatar"
                    class="w-9 h-9 rounded-full border border-primary/20 flex-shrink-0 group-hover:scale-105 transition overflow-hidden"
                  >
                    <img
                      :src="userAvatar"
                      alt="Foto de perfil"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 group-hover:scale-105 transition"
                  >
                    {{ userInitial }}
                  </div>
                  <div class="truncate min-w-0 flex-1">
                    <p
                      class="text-xs font-bold text-on-surface dark:text-slate-200 truncate group-hover:text-primary transition"
                    >
                      {{ userName }}
                    </p>
                    <p
                      class="text-[10px] text-on-surface-variant dark:text-slate-400 capitalize truncate"
                    >
                      {{ roleBadge }}
                    </p>
                  </div>
                </div>
                <span
                  class="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary transition"
                  >arrow_forward_ios</span
                >
              </NuxtLink>

              <button
                @click="onSignOutClick"
                class="w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer"
              >
                <span class="material-symbols-outlined text-[18px]"
                  >logout</span
                >
                <span>Cerrar sesión</span>
              </button>
            </div>

            <!-- Guest Login & Register Buttons -->
            <div v-else class="grid grid-cols-2 gap-2">
              <NuxtLink
                to="/login"
                @click="closeMenu"
                class="flex items-center justify-center gap-1.5 h-10 text-xs font-bold text-white bg-primary hover:bg-primary-container rounded-xl transition shadow-sm active:scale-95"
              >
                <span class="material-symbols-outlined text-[18px]">login</span>
                <span>Iniciar Sesión</span>
              </NuxtLink>
              <NuxtLink
                to="/register"
                @click="closeMenu"
                class="flex items-center justify-center gap-1.5 h-10 text-xs font-bold text-primary dark:text-indigo-400 bg-primary/10 hover:bg-primary/20 dark:bg-indigo-950/60 rounded-xl transition active:scale-95"
              >
                <span>Crear Cuenta</span>
              </NuxtLink>
            </div>

            <template #fallback>
              <div
                class="h-10 bg-slate-200/50 dark:bg-slate-700/50 animate-pulse rounded-xl"
              ></div>
            </template>
          </ClientOnly>
        </div>
      </nav>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useAppNavigation } from "~/composables/useAppNavigation";
import { useCommandPalette } from "~/composables/useCommandPalette";

const props = defineProps<{
  isVisible?: boolean;
}>();

const route = useRoute();
const { openCommandPalette } = useCommandPalette();
const {
  effectiveStatus,
  userRole,
  userName,
  userInitial,
  userAvatar,
  roleBadge,
  profileRoute,
  primaryAction,
  navSections,
  isActive,
  handleNavClick,
  onSignOut,
} = useAppNavigation();

const isMobileMenuOpen = ref(false);

const headerVisibilityClass = computed(() => {
  // If the menu is open, the header MUST remain visible at top
  if (isMobileMenuOpen.value) return "translate-y-0";
  return props.isVisible ? "translate-y-0" : "-translate-y-full";
});

const toggleMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMenu = () => {
  isMobileMenuOpen.value = false;
};

const onSignOutClick = async () => {
  closeMenu();
  await onSignOut();
};

// Close mobile menu automatically on route change
watch(
  () => route.fullPath,
  () => {
    closeMenu();
  },
);

// Close on Escape key press
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && isMobileMenuOpen.value) {
    closeMenu();
  }
};

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("keydown", handleKeyDown);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("keydown", handleKeyDown);
  }
});
</script>
