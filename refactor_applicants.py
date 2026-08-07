import os
import re

BASE_DIR = r"C:\Users\ZEPHYRUS G16\Develop\jobnet-workspace\jobnet-front"

# Create directories
for d in ['app/components/applicants', 'app/composables']:
    os.makedirs(os.path.join(BASE_DIR, d), exist_ok=True)

with open(os.path.join(BASE_DIR, "app/pages/applicants.vue"), "r", encoding="utf-8") as f:
    original_vue = f.read()

# We won't do AST parsing, we'll just extract substrings and create simplified components, 
# wait, replacing complex UI blocks with regex could be risky.
# Let's extract the known blocks based on HTML comments!

# Extract KPI block
kpi_pattern = re.compile(r"(<!-- Dashboard Quick Stats KPIs -->.*?)(?=<!-- Filters Bar: Vacancy Selector \+ Stages \+ Search Bar -->)", re.DOTALL)
kpis_match = kpi_pattern.search(original_vue)
kpis_html = kpis_match.group(1) if kpis_match else ""

# Extract Filters block
filters_pattern = re.compile(r"(<!-- Filters Bar: Vacancy Selector \+ Stages \+ Search Bar -->.*?)(?=<!-- Master-Detail Dashboard Panel View -->)", re.DOTALL)
filters_match = filters_pattern.search(original_vue)
filters_html = filters_match.group(1) if filters_match else ""

# Extract Master-Detail (Left & Right)
master_detail_pattern = re.compile(r"(<!-- LEFT COLUMN: Postulantes List \(4 Cols\) -->.*?)(?=<!-- Modals Section -->)", re.DOTALL)
master_detail_match = master_detail_pattern.search(original_vue)
master_detail_html = master_detail_match.group(1) if master_detail_match else ""

# Wait, `master_detail_html` contains both left list and right panel. Let's separate them.
left_col_pattern = re.compile(r"(<!-- LEFT COLUMN: Postulantes List \(4 Cols\) -->.*?)(?=<!-- RIGHT MAIN PANEL: Candidate Detailed Inspector \(8 Cols\) -->)", re.DOTALL)
right_col_pattern = re.compile(r"(<!-- RIGHT MAIN PANEL: Candidate Detailed Inspector \(8 Cols\) -->.*?)(?=</div>\s*<!-- Modals Section -->)", re.DOTALL)
left_match = left_col_pattern.search(master_detail_html)
right_match = right_col_pattern.search(master_detail_html)

left_html = left_match.group(1) if left_match else ""
right_html = right_match.group(1) if right_match else ""

# Extract Modals section
modals_pattern = re.compile(r"(<!-- Modals Section -->.*?)<!-- Standardized ATS Applicant Document Viewer -->", re.DOTALL)
modals_match = modals_pattern.search(original_vue)
modals_html = modals_match.group(1) if modals_match else ""

# Now let's construct the components.

# ApplicantsKpiCards.vue
with open(os.path.join(BASE_DIR, "app/components/applicants/ApplicantsKpiCards.vue"), "w", encoding="utf-8") as f:
    f.write(f"""<template>
{kpis_html}</template>

<script setup lang="ts">
import {{ useApplicants }} from '~/composables/useApplicants'
const {{ candidates, countByStatus }} = useApplicants()
</script>
""")

# ApplicantsFilterBar.vue
with open(os.path.join(BASE_DIR, "app/components/applicants/ApplicantsFilterBar.vue"), "w", encoding="utf-8") as f:
    f.write(f"""<template>
{filters_html}</template>

<script setup lang="ts">
import {{ useApplicants }} from '~/composables/useApplicants'
const {{ selectedJobId, jobSelectOptions, fetchApplicants, stageTabs, selectedStageFilter, searchQuery }} = useApplicants()
</script>
""")

# CandidateList.vue
with open(os.path.join(BASE_DIR, "app/components/applicants/CandidateList.vue"), "w", encoding="utf-8") as f:
    f.write(f"""<template>
{left_html}</template>

<script setup lang="ts">
import {{ nextTick }} from 'vue'
import {{ useApplicants }} from '~/composables/useApplicants'
import {{ useApplicantActions }} from '~/composables/useApplicantActions'

const {{ filteredCandidates, isLoading, selectedCandidate, isMobileDetailModalOpen, candidateDetailPanel, selectedJobId }} = useApplicants()
const {{ getStatusBadgeClass, getStatusLabel }} = useApplicantActions()

const isSelectedCandidate = (c: any) => {{
  if (!selectedCandidate.value || !c) return false;
  return (
    selectedCandidate.value.id === c.id &&
    selectedCandidate.value.jobId === c.jobId
  );
}};

const selectCandidate = (candidate: any) => {{
  console.log("ATS Candidate selected:", candidate);
  selectedCandidate.value = candidate;
  isMobileDetailModalOpen.value = true;

  nextTick(() => {{
    if (candidateDetailPanel.value) {{
      candidateDetailPanel.value.scrollIntoView({{
        behavior: "smooth",
        block: "start",
      }});
    }}
  }});
}};
</script>
""")

# CandidateDetailPanel.vue
with open(os.path.join(BASE_DIR, "app/components/applicants/CandidateDetailPanel.vue"), "w", encoding="utf-8") as f:
    f.write(f"""<template>
{right_html}</template>

<script setup lang="ts">
import {{ useApplicants }} from '~/composables/useApplicants'
import {{ useApplicantActions }} from '~/composables/useApplicantActions'

const {{ selectedCandidate, candidateDetailPanel, isPdfViewerOpen, selectedPdfUrl, selectedPdfCandidateName }} = useApplicants()
const {{ getStatusBadgeClass, getStatusLabel, advanceCandidateStage, triggerReject }} = useApplicantActions()

const openPdfViewer = (candidate: any) => {{
  selectedPdfUrl.value = candidate.cvUrl || "";
  selectedPdfCandidateName.value = candidate.name || "";
  isPdfViewerOpen.value = true;
}};
</script>
""")

# CandidateModals.vue
with open(os.path.join(BASE_DIR, "app/components/applicants/CandidateModals.vue"), "w", encoding="utf-8") as f:
    f.write(f"""<template>
{modals_html}</template>

<script setup lang="ts">
import AppModal from "~/components/common/AppModal.vue";
import {{ useApplicants }} from '~/composables/useApplicants'
import {{ useApplicantActions }} from '~/composables/useApplicantActions'

const {{ selectedCandidate, isMobileDetailModalOpen, isPdfViewerOpen, selectedPdfUrl, selectedPdfCandidateName }} = useApplicants()
const {{ 
  isInterviewModalOpen, interviewDetails, isRejectModalOpen, rejectionReason,
  getStatusBadgeClass, getStatusLabel, advanceCandidateStage, triggerReject,
  submitInterviewTransition, submitRejection
}} = useApplicantActions()

const openPdfViewer = (candidate: any) => {{
  selectedPdfUrl.value = candidate.cvUrl || "";
  selectedPdfCandidateName.value = candidate.name || "";
  isPdfViewerOpen.value = true;
}};
</script>
""")

# Now construct the new applicants.vue
new_vue_content = """<template>
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
          <strong>"Entrevista"</strong> o <strong>"Seleccionado"</strong>.
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
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSeoMeta } from '#imports';
import ApplicantsKpiCards from '~/components/applicants/ApplicantsKpiCards.vue';
import ApplicantsFilterBar from '~/components/applicants/ApplicantsFilterBar.vue';
import CandidateList from '~/components/applicants/CandidateList.vue';
import CandidateDetailPanel from '~/components/applicants/CandidateDetailPanel.vue';
import CandidateModals from '~/components/applicants/CandidateModals.vue';
import { useApplicants } from '~/composables/useApplicants';
import { useApplicantActions } from '~/composables/useApplicantActions';

useSeoMeta({
  title: "Tablero ATS - JobNet",
  description:
    "Análisis individual de candidatos, cartas de presentación y CVs por vacante en JobNet",
});

const applicants = useApplicants();
const actions = useApplicantActions();

const { isLoading, fetchApplicants, fetchMyJobs, isPdfViewerOpen, selectedPdfUrl, selectedPdfCandidateName } = applicants;
const { successMsg } = actions;

// Expose to template
onMounted(async () => {
  await fetchMyJobs();
});
</script>
"""

with open(os.path.join(BASE_DIR, "app/pages/applicants.vue"), "w", encoding="utf-8") as f:
    f.write(new_vue_content)

print("Refactoring complete.")
