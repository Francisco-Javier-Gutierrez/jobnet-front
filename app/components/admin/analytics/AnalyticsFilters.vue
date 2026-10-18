<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
  >
    <!-- Region Selector -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-2.5 min-w-[280px]">
      <AppSelect
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :options="regions"
        label="Región Geográfica"
        placeholder="Seleccionar región..."
      />
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
