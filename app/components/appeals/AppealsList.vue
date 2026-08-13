<template>
  <div
    class="lg:col-span-5 border-r border-outline-variant/60 flex flex-col h-full bg-surface-container-low/40"
  >
    <!-- Search and Filter Header -->
    <div class="p-4 border-b border-outline-variant/60 space-y-3">
      <div class="relative">
        <span
          class="absolute left-3 top-2.5 material-symbols-outlined text-on-surface-variant dark:text-slate-300 text-lg"
          >search</span
        >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por organización o motivo..."
          class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-indigo-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-background dark:text-slate-100 outline-none transition"
        />
      </div>

      <!-- Type filter tabs -->
      <div class="flex gap-1.5 p-1 bg-surface-container rounded-xl text-xs">
        <button
          @click="filterType = 'ALL'"
          :class="[
            'flex-1 py-1.5 px-3 rounded-lg font-bold transition text-center text-[11px]',
            filterType === 'ALL'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-background',
          ]"
        >
          Todos ({{ appealsLength }})
        </button>
        <button
          @click="filterType = 'ORGANIZACION'"
          :class="[
            'flex-1 py-1.5 px-3 rounded-lg font-bold transition text-center text-[11px]',
            filterType === 'ORGANIZACION'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-background',
          ]"
        >
          Organizaciones
        </button>
        <button
          @click="filterType = 'VACANTE'"
          :class="[
            'flex-1 py-1.5 px-3 rounded-lg font-bold transition text-center text-[11px]',
            filterType === 'VACANTE'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-background',
          ]"
        >
          Vacantes
        </button>
      </div>
    </div>

    <!-- Appeals Items List -->
    <div
      class="flex-grow overflow-y-auto max-h-[550px] divide-y divide-outline-variant/30"
    >
      <div
        v-if="isLoading"
        class="p-8 text-center text-xs text-on-surface-variant"
      >
        <span class="inline-block animate-spin mr-2">⏳</span> Cargando
        solicitudes de apelación...
      </div>
      <div
        v-else-if="filteredAppeals.length === 0"
        class="p-8 text-center text-xs text-on-surface-variant space-y-2"
      >
        <span class="material-symbols-outlined text-3xl opacity-40">gavel</span>
        <p>No se encontraron apelaciones activas.</p>
      </div>
      <div
        v-for="appeal in filteredAppeals"
        :key="appeal.id"
        @click="$emit('select-appeal', appeal)"
        :class="[
          'p-4 flex items-start gap-3 cursor-pointer transition hover:bg-surface-container-high/40',
          selectedAppealId === appeal.id
            ? 'bg-indigo-500/10 border-l-4 border-indigo-600 font-semibold'
            : '',
        ]"
      >
        <div
          class="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-700 dark:text-indigo-300 font-bold text-sm"
        >
          {{ appeal.name.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-grow min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h3
              class="text-xs font-bold text-on-background dark:text-slate-100 truncate"
            >
              {{ appeal.name }}
            </h3>
            <span
              class="text-[10px] text-on-surface-variant dark:text-slate-300/80"
              >{{ formatDate(appeal.createdAt) }}</span
            >
          </div>
          <p
            class="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold truncate mb-1"
          >
            {{ appeal.reason }}
          </p>
          <div
            class="flex items-center justify-between text-[10px] text-on-surface-variant"
          >
            <span
              class="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold"
            >
              {{ appeal.type || "ORGANIZACION" }}
            </span>
            <span class="font-bold text-amber-600 dark:text-amber-400">
              {{ appeal.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  appealsLength: number;
  filteredAppeals: any[];
  isLoading: boolean;
  selectedAppealId: string | null;
}>();

const emit = defineEmits<{
  (e: "select-appeal", appeal: any): void;
}>();

const searchQuery = defineModel<string>("searchQuery", { default: "" });
const filterType = defineModel<"ALL" | "ORGANIZACION" | "VACANTE">(
  "filterType",
  { default: "ALL" },
);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "Reciente";
  return new Date(dateStr).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};
</script>
