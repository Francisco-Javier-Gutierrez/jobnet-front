<template>
  <div class="max-w-7xl mx-auto px-4 py-8 w-full bg-background min-h-screen">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">
        Bandeja de Reclutamiento (ATS)
      </h1>
      <p class="text-on-surface-variant text-sm">
        Organiza a tus candidatos a lo largo del proceso de selección de forma
        ágil y visual.
      </p>
    </div>

    <!-- Job filter dropdown -->
    <div class="mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex items-center gap-3">
        <label
          class="text-xs font-bold text-on-surface-variant"
          for="job-select"
          >Filtrar por Vacante:</label
        >
        <select
          id="job-select"
          v-model="selectedJobId"
          class="bg-surface-container-lowest border border-outline-variant/60 hover:border-primary text-xs text-on-background rounded-lg px-3 py-2 outline-none transition"
        >
          <option value="">Todas las vacantes</option>
          <option v-for="job in myJobs" :key="job.id" :value="job.id">
            {{ job.title }}
          </option>
        </select>
      </div>

      <!-- Quick counts -->
      <span class="text-xs text-on-surface-variant font-bold"
        >Total de Postulaciones: {{ totalCandidates }}</span
      >
    </div>

    <!-- Kanban Board Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Column component -->
      <div
        v-for="column in boardColumns"
        :key="column.id"
        class="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-4 flex flex-col min-h-[450px]"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/60"
        >
          <h2
            class="text-xs font-bold uppercase tracking-wider text-on-background"
          >
            {{ column.title }}
          </h2>
          <span
            class="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-bold"
            >{{ column.items.length }}</span
          >
        </div>

        <!-- Candidate Cards Container -->
        <div class="flex flex-col gap-3 flex-grow overflow-y-auto">
          <div
            v-for="item in column.items"
            :key="item.name"
            class="bg-surface-container-lowest border border-outline-variant/60 hover:border-primary p-4 rounded-xl cursor-pointer transition shadow-sm"
          >
            <h3 class="text-xs font-bold text-on-background mb-1">
              {{ item.name }}
            </h3>
            <p class="text-[10px] text-primary font-semibold mb-2">
              {{ item.job }}
            </p>

            <div
              class="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/40"
            >
              <span class="text-[9px] text-on-surface-variant font-semibold">{{
                item.time
              }}</span>

              <!-- Simple drag simulation actions -->
              <div class="flex gap-1.5">
                <button
                  v-if="column.id !== 'applied'"
                  @click="moveCandidate(item, column.id, 'prev')"
                  class="w-6 h-6 rounded-md bg-surface border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary flex items-center justify-center transition"
                  title="Mover atrás"
                >
                  <span class="material-symbols-outlined text-xs"
                    >chevron_left</span
                  >
                </button>
                <button
                  v-if="column.id !== 'hired'"
                  @click="moveCandidate(item, column.id, 'next')"
                  class="w-6 h-6 rounded-md bg-primary hover:bg-primary-container text-white flex items-center justify-center transition shadow-sm"
                  title="Mover adelante"
                >
                  <span class="material-symbols-outlined text-xs"
                    >chevron_right</span
                  >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

useSeoMeta({
  title: "Bandeja ATS - JobNet",
  description:
    "Gestión interactiva de candidatos y procesos de selección en JobNet",
});

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { data: session, status } = useAuth();

const selectedJobId = ref("");
const myJobs = ref<any[]>([]);

const candidates = ref([
  {
    id: 1,
    name: "Alejandro Silva",
    job: "Senior Frontend Developer",
    jobId: "1",
    stage: "applied",
    time: "Hace 10 mins",
  },
  {
    id: 2,
    name: "Lucía Fernández",
    job: "UX/UI Designer",
    jobId: "2",
    stage: "interview",
    time: "Hace 2 horas",
  },
  {
    id: 3,
    name: "Carlos Ortega",
    job: "Product Manager",
    jobId: "3",
    stage: "offer",
    time: "Ayer",
  },
  {
    id: 4,
    name: "Maria Jose",
    job: "Senior Frontend Developer",
    jobId: "1",
    stage: "interview",
    time: "Hace 3 días",
  },
  {
    id: 5,
    name: "Daniel Martinez",
    job: "Senior Frontend Developer",
    jobId: "1",
    stage: "hired",
    time: "Hace 1 semana",
  },
]);

const fetchMyJobs = async () => {
  if (status.value !== "authenticated" || !session.value?.user?.id) {
    router.push("/login");
    return;
  }

  const companyId = session.value.user.id;

  try {
    const allJobs = await $fetch<any[]>(`${config.public.apiUrl}/jobs`).catch(
      () => [],
    );
    myJobs.value = allJobs.filter((j) => j.empresaUuid === companyId);
  } catch (e) {
    console.error("Error fetching company jobs for ATS filtering:", e);
  }
};

onMounted(() => {
  fetchMyJobs();
  if (route.query.jobId) {
    selectedJobId.value = route.query.jobId as string;
  }
});

const filteredCandidates = computed(() => {
  if (!selectedJobId.value) return candidates.value;
  return candidates.value.filter((c) => c.jobId === selectedJobId.value);
});

const boardColumns = computed(() => [
  {
    id: "applied",
    title: "Aplicados",
    items: filteredCandidates.value.filter((c) => c.stage === "applied"),
  },
  {
    id: "interview",
    title: "Entrevista",
    items: filteredCandidates.value.filter((c) => c.stage === "interview"),
  },
  {
    id: "offer",
    title: "Oferta",
    items: filteredCandidates.value.filter((c) => c.stage === "offer"),
  },
  {
    id: "hired",
    title: "Contratados",
    items: filteredCandidates.value.filter((c) => c.stage === "hired"),
  },
]);

const totalCandidates = computed(() => filteredCandidates.value.length);

const moveCandidate = (
  candidate: any,
  currentStage: string,
  direction: "next" | "prev",
) => {
  const stages = ["applied", "interview", "offer", "hired"];
  const currIndex = stages.indexOf(currentStage);
  if (currIndex === -1) return;

  let nextIndex = direction === "next" ? currIndex + 1 : currIndex - 1;
  if (nextIndex >= 0 && nextIndex < stages.length) {
    const found = candidates.value.find((c) => c.id === candidate.id);
    if (found) {
      found.stage = stages[nextIndex];
    }
  }
};
</script>
