<template>
  <!-- 1. ICON MODE: Instant 1-tap toggle (ideal for mobile header & compact spaces) -->
  <button
    v-if="mode === 'icon'"
    @click.prevent.stop="handleDirectToggle"
    type="button"
    class="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 shadow-sm border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 flex-shrink-0"
    :title="`Modo ${isDark ? 'Oscuro' : 'Claro'} activo. Haz clic para cambiar`"
    aria-label="Cambiar tema de color"
  >
    <ClientOnly>
      <span
        v-if="isDark"
        class="material-symbols-outlined text-[20px] text-amber-400 transform transition-transform duration-300 rotate-0 dark:rotate-[360deg]"
      >
        dark_mode
      </span>
      <span
        v-else
        class="material-symbols-outlined text-[20px] text-amber-500 transform transition-transform duration-300 rotate-0"
      >
        light_mode
      </span>
      <template #fallback>
        <span class="material-symbols-outlined text-[20px] text-amber-500">
          light_mode
        </span>
      </template>
    </ClientOnly>
  </button>

  <!-- 2. PILLS MODE: Segmented control (ideal for desktop sidebars & settings pages) -->
  <div
    v-else-if="mode === 'pills'"
    class="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 w-full"
  >
    <ClientOnly>
      <button
        @click="setTheme('light')"
        type="button"
        class="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200"
        :class="[
          theme === 'light'
            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-amber-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
        ]"
        title="Tema Claro"
      >
        <span class="material-symbols-outlined text-[16px] text-amber-500"
          >light_mode</span
        >
        <span class="truncate">Claro</span>
      </button>

      <button
        @click="setTheme('dark')"
        type="button"
        class="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200"
        :class="[
          theme === 'dark'
            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-amber-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
        ]"
        title="Tema Oscuro"
      >
        <span class="material-symbols-outlined text-[16px] text-indigo-400"
          >dark_mode</span
        >
        <span class="truncate">Oscuro</span>
      </button>

      <button
        @click="setTheme('system')"
        type="button"
        class="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200"
        :class="[
          theme === 'system'
            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-amber-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
        ]"
        title="Seguir Sistema"
      >
        <span class="material-symbols-outlined text-[16px] text-slate-400"
          >desktop_windows</span
        >
        <span class="truncate">Auto</span>
      </button>
      <template #fallback>
        <div class="h-6 w-full animate-pulse bg-slate-200/50 dark:bg-slate-700/50 rounded-lg"></div>
      </template>
    </ClientOnly>
  </div>

  <!-- 3. DROPDOWN MODE: Popover selector -->
  <div v-else class="relative inline-block text-left" ref="dropdownRef">
    <button
      @click.prevent.stop="toggleDropdown"
      type="button"
      class="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 shadow-sm border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      :title="`Tema: ${theme}`"
      aria-label="Cambiar tema"
    >
      <ClientOnly>
        <span
          v-if="isDark"
          class="material-symbols-outlined text-[20px] text-amber-400"
          >dark_mode</span
        >
        <span v-else class="material-symbols-outlined text-[20px] text-amber-500"
          >light_mode</span
        >
        <template #fallback>
          <span class="material-symbols-outlined text-[20px] text-amber-500"
            >light_mode</span
          >
        </template>
      </ClientOnly>
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute w-44 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/40 py-1.5 z-50 overflow-hidden"
        :class="[
          placement === 'up'
            ? 'bottom-full mb-2 left-0'
            : 'top-full mt-2 right-0',
        ]"
      >
        <button
          @click="selectTheme('light')"
          class="w-full flex items-center gap-3 px-3.5 py-2 text-sm font-medium transition-colors"
          :class="[
            theme === 'light'
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 font-semibold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80',
          ]"
        >
          <span class="material-symbols-outlined text-[18px] text-amber-500"
            >light_mode</span
          >
          <span>Claro</span>
          <span
            v-if="theme === 'light'"
            class="ml-auto material-symbols-outlined text-[16px] text-indigo-500"
            >check</span
          >
        </button>

        <button
          @click="selectTheme('dark')"
          class="w-full flex items-center gap-3 px-3.5 py-2 text-sm font-medium transition-colors"
          :class="[
            theme === 'dark'
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 font-semibold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80',
          ]"
        >
          <span class="material-symbols-outlined text-[18px] text-indigo-400"
            >dark_mode</span
          >
          <span>Oscuro</span>
          <span
            v-if="theme === 'dark'"
            class="ml-auto material-symbols-outlined text-[16px] text-indigo-500"
            >check</span
          >
        </button>

        <button
          @click="selectTheme('system')"
          class="w-full flex items-center gap-3 px-3.5 py-2 text-sm font-medium transition-colors"
          :class="[
            theme === 'system'
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 font-semibold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80',
          ]"
        >
          <span class="material-symbols-outlined text-[18px] text-slate-400"
            >desktop_windows</span
          >
          <span>Sistema</span>
          <span
            v-if="theme === 'system'"
            class="ml-auto material-symbols-outlined text-[16px] text-indigo-500"
            >check</span
          >
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { ThemeMode } from "~/composables/useTheme";

const props = withDefaults(
  defineProps<{
    mode?: "icon" | "pills" | "dropdown";
    placement?: "up" | "down";
  }>(),
  {
    mode: "icon",
    placement: "down",
  },
);

const { theme, isDark, setTheme, toggleTheme } = useTheme();
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const handleDirectToggle = () => {
  toggleTheme();
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectTheme = (mode: ThemeMode) => {
  setTheme(mode);
  isOpen.value = false;
};

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("touchstart", handleClickOutside);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("click", handleClickOutside);
    window.removeEventListener("touchstart", handleClickOutside);
  }
});
</script>
