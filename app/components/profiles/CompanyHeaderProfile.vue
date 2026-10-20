<template>
  <div>
    <!-- Header / Banner Section with Proportional Height -->
    <section
      class="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 h-40 md:h-52 rounded-2xl shadow-md mb-24 md:mb-28"
    >
      <!-- Subtle Decorative Overlay -->
      <div
        class="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_1px_1px,theme(colors.white)_1px,transparent_0)] bg-[size:20px_20px] rounded-2xl"
      ></div>

      <!-- Corporate Logo Overlap -->
      <div
        class="absolute -bottom-20 md:-bottom-24 left-1/2 -translate-x-1/2 w-48 h-48 md:w-60 md:h-60 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-4 border-surface dark:border-slate-800 flex items-center justify-center p-3 md:p-3.5 z-20 group transition-transform duration-300 hover:scale-105"
      >
        <img
          alt="Logotipo Corporativo"
          class="w-full h-full object-contain rounded-2xl"
          :src="company.logo"
        />
      </div>
    </section>

    <!-- Central Identity Card -->
    <section
      class="px-margin-mobile flex flex-col items-center text-center mt-2 mb-8"
    >
      <h1
        class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mt-2 mb-2 flex items-center gap-2"
      >
        {{ company.name }}
      </h1>
      <div class="flex flex-wrap items-center justify-center gap-2 mb-4">
        <div
          v-if="company.verified"
          @click="$emit('selectTab', 'verification')"
          class="flex items-center gap-1 bg-surface-container-high text-primary px-3 py-1 rounded-full cursor-pointer hover:bg-surface-container-highest transition-colors active:scale-95"
          role="button"
          tabindex="0"
          title="Consultar detalles del distintivo oficial de verificación"
        >
          <span class="material-symbols-outlined text-[16px] text-secondary"
            >verified</span
          >
          <span
            class="font-label-sm text-label-sm font-semibold text-on-surface-variant dark:text-slate-300"
            >Organización Verificada</span
          >
        </div>
        <div
          v-if="orgStatus === 'REVISION'"
          class="flex items-center gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold text-xs"
        >
          <span class="material-symbols-outlined text-[16px]">warning</span>
          <span>En Periodo de Revisión / Apelación</span>
        </div>
        <div
          v-else-if="orgStatus === 'SUSPENDIDA'"
          class="flex items-center gap-1.5 bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full font-bold text-xs"
        >
          <span class="material-symbols-outlined text-[16px]">block</span>
          <span>Cuenta Suspendida</span>
        </div>
      </div>
      <p
        class="font-body-md text-body-md text-on-surface-variant dark:text-slate-300 mb-6 max-w-lg"
      >
        {{ company.sector }}
      </p>
      <div
        class="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full max-w-2xl"
      >
        <a
          class="flex items-center gap-2 font-label-md text-label-md text-primary bg-surface-container hover:bg-surface-container-high transition-colors px-4 py-2 rounded-lg flex-1 min-w-[140px] justify-center"
          :href="company.website"
          target="_blank"
          rel="noopener"
        >
          <span class="material-symbols-outlined text-[20px]">language</span>
          {{ company.websiteDisplay }}
        </a>
        <div
          class="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant dark:text-slate-300 border border-outline-variant px-4 py-2 rounded-lg flex-1 min-w-[140px] justify-center"
        >
          <span class="material-symbols-outlined text-[20px]">location_on</span>
          {{ company.location }}
        </div>
        <button
          v-if="!isOwner"
          @click="$emit('report')"
          class="flex items-center gap-2 font-label-md text-label-md text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors px-4 py-2 rounded-lg flex-1 min-w-[140px] justify-center font-bold"
          title="Reportar esta organización"
        >
          <span class="material-symbols-outlined text-[20px]">flag</span>
          Reportar Organización
        </button>
        <button
          v-if="isStaff"
          @click="$emit('open-sanction')"
          class="flex items-center gap-2 font-label-md text-label-md text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors px-4 py-2 rounded-lg flex-1 min-w-[160px] justify-center font-bold shadow-sm"
          title="Gestionar sanción administrativa por infracción"
        >
          <span class="material-symbols-outlined text-[20px]">gavel</span>
          Gestionar Sanción
        </button>
      </div>

      <!-- Owner Management Actions -->
      <div
        v-if="isOwner"
        class="mt-6 flex flex-col sm:flex-row gap-4 w-full max-w-md"
      >
        <NuxtLink
          to="/company/edit"
          class="flex-1 bg-primary hover:bg-tertiary-container text-white font-label-md text-label-md px-4 py-2.5 rounded-lg transition-colors active:scale-95 duration-100 flex items-center justify-center gap-2 shadow-sm"
        >
          <span class="material-symbols-outlined text-[20px]">edit</span>
          Editar Perfil
        </NuxtLink>
        <NuxtLink
          to="/create-vacancy"
          class="flex-1 border border-primary text-primary hover:bg-surface-container font-label-md text-label-md px-4 py-2.5 rounded-lg transition-colors active:scale-95 duration-100 flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[20px]">add</span>
          Nueva Vacante
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { CompanyProfile } from "~/types";

withDefaults(
  defineProps<{
    company: CompanyProfile;
    isOwner: boolean;
    isStaff?: boolean;
    orgStatus?: string;
  }>(),
  {
    isStaff: false,
    orgStatus: "ACTIVO",
  },
);

defineEmits<{
  (e: "report"): void;
  (e: "open-sanction"): void;
  (e: "selectTab", tab: string): void;
}>();
</script>
