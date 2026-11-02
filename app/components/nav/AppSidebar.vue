<template>
  <aside
    class="hidden md:flex flex-col fixed top-0 left-0 h-screen w-64 bg-surface-container-lowest dark:bg-slate-900 border-r border-outline-variant/60 dark:border-slate-800 z-40 p-4 transition-colors duration-200 select-none shadow-xs"
  >
    <!-- Top Brand & Navigation Section (Scrollable if height is small) -->
    <div class="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1">
      <!-- Brand Logo & Title -->
      <div class="px-2 pt-1 pb-1">
        <NuxtLink
          to="/"
          aria-label="Inicio"
          class="flex items-center gap-3 group"
        >
          <img
            src="/logo.svg"
            alt="Logo"
            class="h-10 w-10 filter brightness-100 dark:brightness-0 dark:invert transition-transform group-hover:scale-105"
          />
        </NuxtLink>
      </div>

      <!-- Quick Omnibox Search Trigger (Ctrl+K) -->
      <div class="px-1">
        <button
          type="button"
          @click="openCommandPalette"
          class="w-full flex items-center justify-between px-3 py-2 text-xs text-on-surface-variant dark:text-slate-400 bg-surface-container/60 hover:bg-surface-container dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl border border-outline-variant/40 dark:border-slate-700/60 transition group cursor-pointer shadow-2xs"
          title="Abrir buscador global y comandos (Ctrl+K)"
        >
          <div class="flex items-center gap-2">
            <span
              class="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform"
              >search</span
            >
            <span
              class="font-medium text-on-surface-variant dark:text-slate-300"
              >Buscar...</span
            >
          </div>
          <kbd
            class="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-surface dark:bg-slate-900 rounded border border-outline-variant/60 dark:border-slate-700 text-on-surface-variant dark:text-slate-400"
          >
            Ctrl K
          </kbd>
        </button>
      </div>

      <!-- Primary Action CTA Button (Standalone & Prominent) -->
      <div v-if="primaryAction" class="px-1">
        <button
          type="button"
          @click="handleNavClick(primaryAction)"
          class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 cursor-pointer active:scale-[0.98]"
        >
          <span class="material-symbols-outlined text-[18px] font-bold"
            >add</span
          >
          <span>{{ primaryAction.label }}</span>
        </button>
      </div>

      <!-- Categorized Navigation Sections -->
      <nav class="space-y-4 pt-1" aria-label="Navegación principal">
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
              @click.prevent="handleNavClick(item)"
              class="flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-150 group"
              :class="[
                isActive(item.to)
                  ? 'bg-primary/10 text-primary dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold shadow-2xs'
                  : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800 hover:text-on-surface dark:hover:text-white',
              ]"
            >
              <span
                class="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110"
                :class="
                  isActive(item.to)
                    ? 'text-primary dark:text-indigo-400'
                    : 'text-on-surface-variant dark:text-slate-400 group-hover:text-primary dark:group-hover:text-indigo-400'
                "
              >
                {{ item.icon }}
              </span>
              <span class="truncate">{{ item.label }}</span>
            </a>
          </div>
        </div>
      </nav>
    </div>

    <!-- Bottom System Actions (Always Fixed at bottom, never cut off) -->
    <div
      class="flex-shrink-0 pt-3 border-t border-outline-variant/60 dark:border-slate-800 space-y-3 mt-auto bg-surface-container-lowest dark:bg-slate-900 z-10"
    >
      <!-- Appearance Toggle -->
      <div
        class="flex items-center justify-between px-3 py-2 bg-surface-container/50 dark:bg-slate-800/60 rounded-xl"
      >
        <span
          class="text-xs font-semibold text-on-surface-variant dark:text-slate-400"
          >Apariencia</span
        >
        <ThemeToggle />
      </div>

      <!-- User Profile & Logout (ClientOnly to prevent hydration mismatch) -->
      <ClientOnly>
        <div
          v-if="effectiveStatus === 'authenticated'"
          class="flex items-center justify-between px-3 py-2"
        >
          <NuxtLink
            :to="profileRoute"
            class="flex items-center gap-3 overflow-hidden group min-w-0"
          >
            <div
              v-if="userAvatar"
              class="w-8 h-8 rounded-full border border-primary/20 flex-shrink-0 group-hover:scale-105 transition overflow-hidden"
            >
              <img
                :src="userAvatar"
                alt="Foto de perfil"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 group-hover:scale-105 transition"
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
          </NuxtLink>
          <button
            @click="onSignOut"
            class="text-on-surface-variant dark:text-slate-400 hover:text-rose-600 transition p-1.5 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <span class="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>

        <!-- Guest Login Button (Unauthenticated) -->
        <div v-else class="space-y-2 px-1">
          <NuxtLink
            to="/login"
            class="w-full flex items-center justify-center gap-2 h-10 text-xs font-bold text-white bg-primary hover:bg-primary-container rounded-xl transition shadow-sm"
          >
            <span class="material-symbols-outlined text-[18px]">login</span>
            <span>Iniciar Sesión</span>
          </NuxtLink>
        </div>

        <template #fallback>
          <div class="px-3 py-2 h-12 flex items-center gap-3 animate-pulse">
            <div
              class="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-700/50"
            ></div>
            <div class="space-y-1 flex-1">
              <div
                class="h-3 bg-slate-200/50 dark:bg-slate-700/50 rounded w-20"
              ></div>
              <div
                class="h-2 bg-slate-200/50 dark:bg-slate-700/50 rounded w-12"
              ></div>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAppNavigation } from "~/composables/useAppNavigation";
import { useCommandPalette } from "~/composables/useCommandPalette";

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
</script>
