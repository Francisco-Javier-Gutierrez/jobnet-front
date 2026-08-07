<template>
<!-- Filters Bar: Vacancy Selector + Stages + Search Bar -->
    <div
      class="bg-surface-container-low dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 mb-6 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4"
    >
      <!-- Vacancy Selector -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap"
        >
          <span class="material-symbols-outlined text-sm text-primary"
            >work</span
          >
          Vacante Publicada:
        </label>
        <div class="w-full sm:w-72">
          <AppSelect
            v-model="selectedJobId"
            @change="fetchApplicants"
            :options="jobSelectOptions"
            placeholder="Selecciona una vacante..."
          />
        </div>
      </div>

      <!-- Stage Filters Tabs (AppTabs) -->
      <div class="flex-grow max-w-full">
        <AppTabs :tabs="stageTabs" v-model="selectedStageFilter" />
      </div>

      <!-- Search Input (AppSearchInput) -->
      <div class="w-full lg:w-64">
        <AppSearchInput
          v-model="searchQuery"
          placeholder="Buscar candidato o habilidad..."
        />
      </div>
    </div>

    </template>

<script setup lang="ts">
import { useApplicants } from '~/composables/useApplicants'
const { selectedJobId, jobSelectOptions, fetchApplicants, stageTabs, selectedStageFilter, searchQuery } = useApplicants()
</script>
