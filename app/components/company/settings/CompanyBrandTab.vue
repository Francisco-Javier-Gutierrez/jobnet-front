<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <h2
      class="text-base font-bold text-on-background flex items-center gap-2 border-b border-outline-variant/40 pb-3"
    >
      <span class="material-symbols-outlined text-primary">language</span>
      Presencia de Marca y Redes Oficiales
    </h2>

    <div class="flex flex-col gap-1.5">
      <label
        class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
        for="sitio-web"
        >Sitio Web Oficial</label
      >
      <input
        :value="website"
        @input="
          $emit('update:website', ($event.target as HTMLInputElement).value)
        "
        id="sitio-web"
        type="url"
        placeholder="https://www.tuempresa.com"
        class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label
        class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
        for="linkedin"
        >Perfil de LinkedIn Corporativo</label
      >
      <input
        :value="linkedin"
        @input="
          $emit('update:linkedin', ($event.target as HTMLInputElement).value)
        "
        id="linkedin"
        type="url"
        placeholder="https://linkedin.com/company/tuempresa"
        class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  website: string;
  linkedin: string;
}>();

const emit = defineEmits<{
  (e: "update:website", value: string): void;
  (e: "update:linkedin", value: string): void;
}>();
</script>
