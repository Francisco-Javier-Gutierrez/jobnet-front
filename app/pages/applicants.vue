<template>
  <div
    class="max-w-7xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <!-- Header -->
    <div
      class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1
          class="text-2xl font-bold text-on-background flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-primary text-3xl"
            >dashboard_customize</span
          >
          Tablero ATS
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Analiza individualmente el perfil, carta de presentación y CV de cada
          postulante por vacante y etapa.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="fetchApplicants"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:bg-surface text-xs font-bold transition shadow-sm active:scale-95"
          title="Actualizar postulantes"
        >
          <span
            class="material-symbols-outlined text-sm"
            :class="{ 'animate-spin': isLoading }"
            >refresh</span
          >
          Refrescar Datos
        </button>
      </div>
    </div>

    <!-- Alert Messages -->
    <div
      v-if="successMsg"
      class="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm animate-fadeIn"
    >
      <span class="material-symbols-outlined text-sm">check_circle</span>
      {{ successMsg }}
    </div>

    <!-- Realtime Chat Informative Banner (RF-47) -->
    <div
      class="mb-6 bg-sky-500/10 border border-sky-500/20 p-4 rounded-2xl flex items-start gap-3 text-xs text-sky-900 dark:text-sky-200 shadow-sm"
    >
      <span
        class="material-symbols-outlined text-sky-600 dark:text-sky-400 text-xl flex-shrink-0"
        >info</span
      >
      <div>
        <p class="font-bold text-sky-950 dark:text-sky-100">
          Mensajería Privada en Tiempo Real
        </p>
        <p class="text-sky-800 dark:text-sky-300">
          El canal de chat directo se habilita automáticamente cuando avanzas a
          un aspirante a la etapa de
          <strong>"En Contacto"</strong> o superior.
        </p>
      </div>
    </div>

    <ApplicantsKpiCards />
    <ApplicantsFilterBar />

    <!-- Master-Detail Dashboard Panel View -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <CandidateList />
      <CandidateDetailPanel />
    </div>

    <CandidateModals />

    <!-- Standardized ATS Applicant Document Viewer -->
    <AppDocumentViewer
      v-model="isPdfViewerOpen"
      :url="selectedPdfUrl"
      :title="`CV de ${selectedPdfCandidateName}`"
      :candidate-id="selectedPdfCandidateId"
    />
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from "#imports";

import { useApplicants } from "~/composables/useApplicants";
import { useApplicantActions } from "~/composables/useApplicantActions";

useSeoMeta({
  title: "Tablero ATS - JobNet",
  description:
    "Análisis individual de candidatos, cartas de presentación y CVs por vacante en JobNet",
});

const applicants = useApplicants();
const actions = useApplicantActions();

const {
  isLoading,
  fetchApplicants,
  fetchMyJobs,
  isPdfViewerOpen,
  selectedPdfUrl,
  selectedPdfCandidateName,
  selectedPdfCandidateId,
} = applicants;
const { successMsg } = actions;

// Expose to template
onMounted(async () => {
  await fetchMyJobs();
});
</script>
