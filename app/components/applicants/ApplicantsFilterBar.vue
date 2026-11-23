<template>
  <!-- Filters Bar -->
  <div
    class="bg-surface-container-low dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 mb-6 shadow-sm flex flex-col gap-4"
  >
    <!-- Top Row: Vacancy Selector + Search -->
    <div
      class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
    >
      <!-- Vacancy Selector -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap"
      >
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

        <!-- AI Comparison Button (DeepSeek ATS) -->
        <button
          type="button"
          @click="handleOpenAiModal"
          :disabled="!selectedJobId"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm active:scale-95 border cursor-pointer"
          :class="[
            selectedJobId
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-transparent shadow-indigo-500/20'
              : 'bg-surface-container-high text-on-surface-variant/40 border-outline-variant/40 cursor-not-allowed opacity-60',
          ]"
          :title="
            selectedJobId
              ? 'Comparativa y ranking inteligente de candidatos con IA'
              : 'Selecciona una vacante para activar la comparativa IA'
          "
        >
          <span class="material-symbols-outlined text-sm">auto_awesome</span>
          <span>Comparativa IA</span>
        </button>
      </div>

      <!-- Search Input (AppSearchInput) -->
      <div class="w-full md:w-64 flex-shrink-0">
        <AppSearchInput
          v-model="searchQuery"
          placeholder="Buscar candidato o habilidad..."
        />
      </div>
    </div>

    <!-- Bottom Row: Stage Filters Tabs (AppTabs) -->
    <div class="w-full min-w-0">
      <AppTabs :tabs="stageTabs" v-model="selectedStageFilter" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApplicants } from "~/composables/useApplicants";
import { useApplicantAiRanking } from "~/composables/useApplicantAiRanking";

const {
  selectedJobId,
  jobSelectOptions,
  fetchApplicants,
  stageTabs,
  selectedStageFilter,
  searchQuery,
} = useApplicants();

const { openRankingModal } = useApplicantAiRanking();

const handleOpenAiModal = () => {
  if (selectedJobId.value) {
    openRankingModal(selectedJobId.value);
  }
};
</script>
