<template>
  <!-- LEFT COLUMN: Postulantes List (4 Cols) -->
  <div
    class="lg:col-span-4 bg-surface-container-low dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 flex flex-col min-h-[620px] max-h-[850px] shadow-sm"
  >
    <div
      class="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/60"
    >
      <h2
        class="text-xs font-bold uppercase tracking-wider text-on-background flex items-center gap-1.5"
      >
        <span class="material-symbols-outlined text-sm text-primary"
          >person_search</span
        >
        Postulantes ({{ filteredCandidates.length }})
      </h2>
      <span
        class="text-[10px] text-on-surface-variant dark:text-slate-400 font-semibold"
      >
        Haz clic para ver datos
      </span>
    </div>

    <!-- Candidate Cards Container -->
    <div
      v-if="isLoading"
      class="flex flex-col gap-3 py-12 items-center justify-center text-center"
    >
      <span class="material-symbols-outlined text-3xl text-primary animate-spin"
        >sync</span
      >
      <p
        class="text-xs text-on-surface-variant dark:text-slate-400 font-medium"
      >
        Cargando postulantes...
      </p>
    </div>

    <div
      v-else-if="filteredCandidates.length === 0"
      class="flex flex-col items-center justify-center flex-grow py-12 text-center text-on-surface-variant dark:text-slate-400"
    >
      <span
        class="material-symbols-outlined text-4xl mb-2 text-slate-300 dark:text-slate-600"
        >person_off</span
      >
      <p class="text-xs font-bold mb-1">Sin postulantes en esta vista</p>
      <p class="text-[11px] text-slate-400">
        No hay candidatos que coincidan con la vacante o filtro seleccionado.
      </p>
    </div>

    <div v-else class="flex flex-col gap-2.5 flex-grow overflow-y-auto pr-1">
      <button
        type="button"
        v-for="candidate in filteredCandidates"
        :key="`${candidate.id}-${candidate.jobId}`"
        @click="selectCandidate(candidate)"
        class="w-full text-left p-3.5 rounded-xl border transition cursor-pointer relative group select-none block focus:outline-none"
        :class="[
          isSelectedCandidate(candidate)
            ? 'bg-primary/15 border-primary ring-2 ring-primary/50 shadow-md dark:bg-primary/30'
            : 'bg-surface-container-lowest dark:bg-slate-950 border-outline-variant/60 hover:border-primary/60 hover:bg-surface-container-low',
        ]"
      >
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <div class="flex items-center gap-2">
            <div
              class="w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm transition"
              :class="
                isSelectedCandidate(candidate)
                  ? 'bg-primary text-white'
                  : 'bg-primary/10 text-primary dark:bg-primary/20'
              "
            >
              {{ candidate.name.substring(0, 2).toUpperCase() }}
            </div>
            <div>
              <h3 class="text-xs font-bold text-on-background line-clamp-1">
                {{ candidate.name }}
              </h3>
              <span
                class="text-[10px] text-on-surface-variant dark:text-slate-400 block line-clamp-1"
              >
                {{ candidate.titularProfesional }}
              </span>
            </div>
          </div>

          <!-- Status Badge -->
          <span
            class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide flex-shrink-0"
            :class="getStatusBadgeClass(candidate.status)"
          >
            {{ getStatusLabel(candidate.status) }}
          </span>
        </div>

        <!-- Job title if viewing all vacancies -->
        <div
          v-if="!selectedJobId"
          class="text-[10px] text-primary font-semibold mb-1.5 flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-[12px]">work</span>
          {{ candidate.job }}
        </div>

        <div
          class="flex items-center justify-between text-[10px] text-on-surface-variant dark:text-slate-400 pt-2 border-t border-outline-variant/30"
        >
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[12px]"
              >calendar_today</span
            >
            {{ candidate.time }}
          </span>

          <span class="text-primary font-bold flex items-center gap-0.5">
            Ver Detalles
            <span class="material-symbols-outlined text-[12px]"
              >chevron_right</span
            >
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import { useApplicants } from "~/composables/useApplicants";
import { useApplicantActions } from "~/composables/useApplicantActions";

const {
  filteredCandidates,
  isLoading,
  selectedCandidate,
  isMobileDetailModalOpen,
  candidateDetailPanel,
  selectedJobId,
} = useApplicants();
const { getStatusBadgeClass, getStatusLabel } = useApplicantActions();

const isSelectedCandidate = (c: any) => {
  if (!selectedCandidate.value || !c) return false;
  return (
    selectedCandidate.value.id === c.id &&
    selectedCandidate.value.jobId === c.jobId
  );
};

const selectCandidate = (candidate: any) => {
  console.log("ATS Candidate selected:", candidate);
  selectedCandidate.value = candidate;
  isMobileDetailModalOpen.value = true;

  nextTick(() => {
    if (candidateDetailPanel.value) {
      candidateDetailPanel.value.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
};
</script>
