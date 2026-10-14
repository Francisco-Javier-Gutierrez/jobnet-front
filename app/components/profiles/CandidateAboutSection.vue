<template>
  <div class="space-y-8">
    <!-- Sobre mí -->
    <div>
      <h2
        class="font-headline-md text-headline-md text-on-background dark:text-slate-100 mb-md flex items-center gap-sm border-b border-surface-container pb-sm"
      >
        <span class="material-symbols-outlined">person</span>
        Sobre mí
      </h2>
      <p
        v-if="profile.biografia"
        class="font-body-md text-body-md text-on-surface-variant dark:text-slate-300 leading-relaxed"
      >
        {{ profile.biografia }}
      </p>
      <p
        v-else
        class="font-body-md text-body-md text-on-surface-variant dark:text-slate-300 italic"
      >
        Este candidato aún no ha agregado una biografía.
      </p>
    </div>

    <!-- Sectores -->
    <div v-if="sectors.length > 0">
      <h2
        class="font-headline-md text-headline-md text-on-background dark:text-slate-100 mb-md flex items-center gap-sm border-b border-surface-container pb-sm"
      >
        <span class="material-symbols-outlined">business_center</span>
        Sectores de Interés
      </h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="sector in sectors"
          :key="sector"
          class="bg-surface-container text-secondary font-label-md text-label-md px-4 py-2 rounded-full border border-surface-container-high hover:bg-secondary-container hover:text-on-secondary-container transition-colors"
        >
          {{ sector }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  profile: Record<string, any>;
  sectors: string[];
}>();
</script>
