<template>
  <div
    class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8 shadow-sm"
  >
    <h3
      class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2"
    >
      <span class="material-symbols-outlined text-[18px]">filter_list</span>
      Búsqueda y Filtros de Organizaciones
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <form
        @submit.prevent="executeServerSearch"
        class="md:col-span-2 flex gap-2"
      >
        <div class="relative flex-grow">
          <span
            class="absolute left-3.5 top-3.5 material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg"
            >search</span
          >
          <input
            v-model="searchInput"
            type="text"
            placeholder="Buscar por Nombre Comercial, Razón Social o RFC..."
            class="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 rounded-xl pl-10 pr-8 py-3 text-xs outline-none transition text-slate-800 dark:text-slate-200 shadow-inner"
          />
          <button
            v-if="searchInput"
            @click="clearSearchInput"
            type="button"
            class="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
            title="Limpiar búsqueda"
          >
            ✕
          </button>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow active:scale-95 disabled:opacity-50 flex-shrink-0"
        >
          <span
            v-if="loading"
            class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"
          ></span>
          <span v-else class="material-symbols-outlined text-base">search</span>
          <span>Buscar</span>
        </button>
      </form>

      <div>
        <AppSelect
          v-model="filterVerification"
          :options="[
            { value: 'ALL', label: 'Todos los Estatus de Verificación' },
            {
              value: 'VERIFIED',
              label: 'Verificada (Icono Activo)',
              icon: 'verified',
            },
            { value: 'NOT_VERIFIED', label: 'No Verificada' },
          ]"
        />
      </div>

      <div>
        <AppSelect
          v-model="filterAccountStatus"
          :options="[
            { value: 'ALL', label: 'Todos los Estatus de Cuenta' },
            { value: 'ACTIVO', label: 'Activa', icon: 'check_circle' },
            { value: 'REVISION', label: 'En Revisión', icon: 'warning' },
            {
              value: 'SUSPENDIDA',
              label: 'Suspendida (Bloqueada)',
              icon: 'block',
            },
          ]"
        />
      </div>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800"
    >
      <div class="md:col-span-2 flex items-center gap-2">
        <span
          class="text-xs text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap"
          >Fecha Registro:</span
        >
        <input
          v-model="filterDateStart"
          type="date"
          class="bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 outline-none w-full"
        />
        <span class="text-xs text-slate-400 dark:text-slate-500 font-bold"
          >a</span
        >
        <input
          v-model="filterDateEnd"
          type="date"
          class="bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 outline-none w-full"
        />
      </div>

      <div class="md:col-span-2 flex justify-end items-center">
        <button
          @click="clearFilters"
          class="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 font-bold transition flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-[14px]">backspace</span>
          Restablecer Filtros
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  loading: boolean;
  modelSearchInput: string;
  modelFilterVerification: string;
  modelFilterAccountStatus: string;
  modelFilterDateStart: string;
  modelFilterDateEnd: string;
}>();

const emit = defineEmits<{
  (e: "update:modelSearchInput", value: string): void;
  (e: "update:modelFilterVerification", value: string): void;
  (e: "update:modelFilterAccountStatus", value: string): void;
  (e: "update:modelFilterDateStart", value: string): void;
  (e: "update:modelFilterDateEnd", value: string): void;
  (e: "executeSearch"): void;
  (e: "clearSearchInput"): void;
  (e: "clearFilters"): void;
}>();

const searchInput = computed({
  get: () => props.modelSearchInput,
  set: (val) => emit("update:modelSearchInput", val),
});
const filterVerification = computed({
  get: () => props.modelFilterVerification,
  set: (val) => emit("update:modelFilterVerification", val),
});
const filterAccountStatus = computed({
  get: () => props.modelFilterAccountStatus,
  set: (val) => emit("update:modelFilterAccountStatus", val),
});
const filterDateStart = computed({
  get: () => props.modelFilterDateStart,
  set: (val) => emit("update:modelFilterDateStart", val),
});
const filterDateEnd = computed({
  get: () => props.modelFilterDateEnd,
  set: (val) => emit("update:modelFilterDateEnd", val),
});

const executeServerSearch = () => emit("executeSearch");
const clearSearchInput = () => emit("clearSearchInput");
const clearFilters = () => emit("clearFilters");
</script>
