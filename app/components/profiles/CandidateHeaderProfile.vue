<template>
  <section class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative z-20">
    <!-- Decorative top color bar -->
    <div class="bg-primary h-2 w-full rounded-t-xl"></div>

    <div class="p-lg md:p-xl flex flex-col items-center text-center">
      <!-- Profile Picture -->
      <div class="relative mb-4">
        <img
          :alt="profile.nombre"
          class="w-32 h-32 rounded-full object-cover shadow-sm border-4 border-surface-container-lowest"
          :src="profile.fotoPerfil || defaultAvatar"
        />
      </div>

      <!-- Name -->
      <h1 class="font-headline-lg text-headline-lg text-on-surface mb-1">
        {{ profile.nombre || "Sin Nombre" }}
      </h1>

      <!-- Location -->
      <p
        v-if="locationText"
        class="font-body-md text-body-md text-on-surface-variant dark:text-slate-300 flex items-center gap-1 mb-3"
      >
        <span class="material-symbols-outlined text-[16px]">location_on</span>
        {{ locationText }}
      </p>

      <!-- Status Badge -->
      <div class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md mb-6 inline-flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-secondary"></span>
        {{ profile.estadoBusqueda || "En búsqueda activa" }}
      </div>

      <!-- Action Buttons -->
      <div class="w-full flex gap-3 max-w-sm mb-2">
        <NuxtLink
          v-if="isOwner"
          to="/settings"
          class="flex-1 bg-primary hover:bg-tertiary-container text-on-primary h-12 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <span class="material-symbols-outlined">edit</span>
          Editar Perfil
        </NuxtLink>
        <a
          v-else
          :href="`mailto:${profile.email}`"
          class="flex-1 bg-primary hover:bg-tertiary-container text-on-primary h-12 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <span class="material-symbols-outlined">mail</span>
          Contactar
        </a>

        <!-- Enlaces Web Dropdown -->
        <div v-if="webLinks.length > 0" class="relative flex-1">
          <button
            @click.stop="toggleDropdown"
            class="w-full bg-surface-container-low text-on-surface h-12 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 transition-transform active:scale-95 border border-outline-variant"
            id="webLinksBtn"
          >
            Enlaces Web
            <span
              class="material-symbols-outlined text-[20px] transition-transform duration-200"
              :class="{ 'rotate-180': showDropdown }"
              >expand_more</span
            >
          </button>
          <div
            v-if="showDropdown"
            class="absolute top-full right-0 min-w-[220px] sm:w-full mt-2 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden"
            id="webLinksDropdown"
          >
            <a
              v-for="link in webLinks"
              :key="link.name"
              class="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-on-surface dark:text-slate-200"
              :href="link.url"
              target="_blank"
              rel="noopener"
            >
              <span class="material-symbols-outlined text-primary text-base">{{ link.icon }}</span>
              <span class="truncate">{{ link.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{
  profile: Record<string, any>;
  defaultAvatar: string;
  locationText: string;
  isOwner: boolean;
  webLinks: Array<{ name: string; url: string; icon: string }>;
}>();

const showDropdown = ref(false);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

onMounted(() => {
  if (import.meta.client) {
    document.addEventListener("click", closeDropdown);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener("click", closeDropdown);
  }
});
</script>
