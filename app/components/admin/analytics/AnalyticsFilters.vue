<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
  >
    <!-- Region Selector -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-2.5">
      <label class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1">
        <span class="material-symbols-outlined text-[18px] text-primary">location_on</span>
        <span>Región Geográfica:</span>
      </label>
      <div class="relative">
        <select
          :value="modelValue"
          @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
          class="bg-[#F1F5F9] dark:bg-slate-800 border border-outline-variant/50 dark:border-slate-700 text-on-surface dark:text-slate-100 text-xs font-semibold rounded-xl px-3.5 py-2.5 pr-8 appearance-none focus:outline-none focus:border-primary cursor-pointer transition shadow-sm w-full sm:w-auto"
        >
          <option
            v-for="region in regions"
            :key="region"
            :value="region"
          >
            {{ region }}
          </option>
        </select>
        <span class="material-symbols-outlined text-sm absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          expand_more
        </span>
      </div>
    </div>

    <!-- Actions (Sync & Export) -->
    <div class="flex items-center gap-2.5 self-end md:self-auto">
      <button
        @click="$emit('refresh')"
        :disabled="loading"
        class="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold bg-surface-container/60 hover:bg-surface-container dark:bg-slate-800 dark:hover:bg-slate-700 text-on-surface dark:text-slate-200 border border-outline-variant/50 dark:border-slate-700 rounded-xl transition shadow-sm disabled:opacity-50"
        title="Sincronizar métricas con el backend"
      >
        <span
          class="material-symbols-outlined text-[18px]"
          :class="{ 'animate-spin': loading }"
        >
          sync
        </span>
        <span>{{ loading ? "Actualizando..." : "Sincronizar" }}</span>
      </button>

      <button
        @click="$emit('export')"
        class="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold bg-primary hover:bg-primary-container text-white rounded-xl transition shadow-sm"
        title="Descargar reporte completo en formato CSV"
      >
        <span class="material-symbols-outlined text-[18px]">download</span>
        <span>Exportar CSV</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  regions: string[];
  loading?: boolean;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "refresh"): void;
  (e: "export"): void;
}>();
</script>
