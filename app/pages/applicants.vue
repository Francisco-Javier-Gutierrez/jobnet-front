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
          @change="fetchApplicants"
          class="bg-surface-container-lowest border border-outline-variant/60 hover:border-primary text-xs text-on-background rounded-lg px-3 py-2 outline-none transition"
        >
          <option value="">Selecciona una vacante...</option>
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

    <div
      v-if="successMsg"
      class="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold"
    >
      <span class="material-symbols-outlined text-sm">check_circle</span>
      {{ successMsg }}
    </div>

    <!-- RF-47 Recruitment Chat Informative Banner -->
    <div class="mb-6 bg-sky-500/10 border border-sky-500/20 p-4 rounded-2xl flex items-start gap-3 text-xs text-sky-900 shadow-sm">
      <span class="material-symbols-outlined text-sky-600 text-xl flex-shrink-0">info</span>
      <div>
        <p class="font-bold text-sky-950">Mensajería Privada en Tiempo Real (RF-47)</p>
        <p class="text-sky-800">El canal de chat privado e integrado con cada aspirante se desbloquea automáticamente cuando avanzas su postulación al estatus <strong>"Seleccionado"</strong> o <strong>"Entrevista"</strong>.</p>
      </div>
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
            :key="item.id"
            class="bg-surface-container-lowest border border-outline-variant/60 hover:border-primary p-4 rounded-xl cursor-pointer transition shadow-sm"
          >
            <div class="flex justify-between items-start gap-2 mb-1">
              <h3 class="text-xs font-bold text-on-background">
                {{ item.name }}
              </h3>
              <!-- Status indicator -->
              <span
                v-if="item.status === 'RECHAZADO'"
                class="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide bg-rose-100 text-rose-800"
              >
                Rechazado
              </span>
            </div>

            <p class="text-[10px] text-primary font-semibold mb-2">
              {{ item.job }}
            </p>

            <div class="text-[10px] text-on-surface-variant mb-3">
              {{ item.email }}
            </div>

            <!-- CV integrated viewer button -->
            <div v-if="item.cvUrl" class="mb-3">
              <button
                @click.stop="openPdfViewer(item)"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition w-full justify-center"
              >
                <span class="material-symbols-outlined text-[14px]"
                  >picture_as_pdf</span
                >
                Ver CV Integrado
              </button>
            </div>

            <!-- Action panel for candidates -->
            <div
              class="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/40"
            >
              <span class="text-[9px] text-on-surface-variant font-semibold">
                {{ item.time }}
              </span>

              <!-- Simple drag simulation actions -->
              <div class="flex items-center gap-1.5">
                <!-- Chat link if selected/interview -->
                <nuxt-link
                  v-if="
                    ['SELECCIONADO', 'ENTREVISTA', 'ACEPTADO', 'CONTRATADO'].includes(item.status)
                  "
                  :to="`/messages?jobId=${item.jobId}&candidateId=${item.id}`"
                  class="w-6 h-6 rounded-md bg-sky-500 text-white hover:bg-sky-600 flex items-center justify-center transition shadow-sm"
                  title="💬 Chat Privado Activo (Haz clic para conversar con el aspirante)"
                >
                  <span class="material-symbols-outlined text-xs">forum</span>
                </nuxt-link>

                <!-- Locked chat indicator when pending evaluation -->
                <span
                  v-else
                  class="w-6 h-6 rounded-md bg-surface border border-outline-variant/40 text-on-surface-variant/40 flex items-center justify-center cursor-help"
                  title="🔒 Chat bloqueado: Se desbloquea automáticamente al mover el candidato a 'Seleccionado' (RF-47)"
                >
                  <span class="material-symbols-outlined text-xs">lock</span>
                </span>

                <!-- Move back button -->
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

                <!-- Move forward button -->
                <button
                  v-if="column.id !== 'hired' && item.status !== 'RECHAZADO'"
                  @click="moveCandidate(item, column.id, 'next')"
                  class="w-6 h-6 rounded-md bg-primary hover:bg-primary-container text-white flex items-center justify-center transition shadow-sm"
                  title="Mover adelante"
                >
                  <span class="material-symbols-outlined text-xs"
                    >chevron_right</span
                  >
                </button>

                <!-- Reject button -->
                <button
                  v-if="item.status !== 'RECHAZADO'"
                  @click="triggerReject(item)"
                  class="w-6 h-6 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center transition"
                  title="Rechazar Postulante"
                >
                  <span class="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals Section -->
    <!-- Interview Details Modal -->
    <div
      v-if="isInterviewModalOpen"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        class="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-xl"
      >
        <h3
          class="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-primary text-lg"
            >calendar_month</span
          >
          Agendar Entrevista de Selección
        </h3>
        <p class="text-xs text-slate-500 mb-4">
          Indica los detalles de la entrevista para notificar al candidato por
          correo electrónico de forma automática.
        </p>

        <div class="space-y-4">
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1"
              >Detalles de la Cita (Ej: Fecha, Hora, Link de Meet/Zoom):</label
            >
            <textarea
              v-model="interviewDetails"
              rows="4"
              class="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-primary rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition"
              placeholder="Ej: Lunes 24 de Julio a las 10:00 AM (GMT-6). Reunión de Teams: https://teams.microsoft.com/l/meetup-join/..."
            ></textarea>
          </div>
        </div>

        <div
          class="flex justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100"
        >
          <button
            @click="isInterviewModalOpen = false"
            class="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs transition"
          >
            Cancelar
          </button>
          <button
            @click="submitInterviewTransition"
            :disabled="!interviewDetails.trim()"
            class="px-4 py-2 bg-primary hover:bg-primary-container text-white disabled:opacity-50 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Confirmar y Agendar
          </button>
        </div>
      </div>
    </div>

    <!-- Rejection Reason Modal -->
    <div
      v-if="isRejectModalOpen"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        class="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-xl"
      >
        <h3
          class="text-sm font-bold text-rose-900 mb-2 flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-rose-600 text-lg"
            >cancel</span
          >
          Descartar Postulante
        </h3>
        <p class="text-xs text-slate-500 mb-4">
          Ingresa el motivo del descarte. Esto se enviará de forma automática e
          individual al candidato por correo electrónico.
        </p>

        <div class="space-y-4">
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1"
              >Motivo de Rechazo:</label
            >
            <textarea
              v-model="rejectionReason"
              rows="4"
              class="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-rose-500 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none transition"
              placeholder="Ej: Agradecemos tu participación en el proceso, pero hemos decidido avanzar con perfiles que se alinean más estrechamente con la experiencia requerida en arquitecturas en la nube."
            ></textarea>
          </div>
        </div>

        <div
          class="flex justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100"
        >
          <button
            @click="isRejectModalOpen = false"
            class="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs transition"
          >
            Cancelar
          </button>
          <button
            @click="submitRejection"
            :disabled="!rejectionReason.trim()"
            class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Confirmar Descarte
          </button>
        </div>
      </div>
    </div>

    <!-- PDF Viewer Modal -->
    <div
      v-if="isPdfViewerOpen"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 max-w-4xl w-full h-[85vh] flex flex-col shadow-xl"
      >
        <div
          class="flex items-center justify-between pb-4 border-b border-outline-variant/40 mb-4"
        >
          <h3
            class="text-sm font-bold text-on-background flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-primary"
              >picture_as_pdf</span
            >
            CV de {{ selectedPdfCandidateName }}
          </h3>
          <div class="flex items-center gap-2">
            <a
              :href="selectedPdfUrl"
              download
              target="_blank"
              class="px-3 py-1.5 rounded-lg border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary text-xs font-bold transition flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[16px]"
                >download</span
              >
              Descargar
            </a>
            <button
              @click="isPdfViewerOpen = false"
              class="text-on-surface-variant hover:text-error transition flex items-center gap-1 font-semibold text-xs"
              aria-label="Cerrar visor PDF"
            >
              <span class="material-symbols-outlined text-sm">close</span>
              Cerrar
            </button>
          </div>
        </div>

        <div
          class="flex-grow w-full border border-outline-variant/30 rounded-xl overflow-hidden bg-surface relative"
        >
          <iframe
            :src="selectedPdfUrl"
            class="w-full h-full border-none"
            title="Visor PDF Integrado"
          ></iframe>
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
const candidates = ref<any[]>([]);
const successMsg = ref("");

// Modal States
const isInterviewModalOpen = ref(false);
const interviewDetails = ref("");
const pendingCandidateItem = ref<any>(null);
const pendingStageMove = ref<any>(null);

const isRejectModalOpen = ref(false);
const rejectionReason = ref("");

// PDF Viewer State
const isPdfViewerOpen = ref(false);
const selectedPdfUrl = ref("");
const selectedPdfCandidateName = ref("");

const openPdfViewer = (candidate: any) => {
  selectedPdfUrl.value = candidate.cvUrl || "";
  selectedPdfCandidateName.value = candidate.name || "";
  isPdfViewerOpen.value = true;
};

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

    // Auto-select first job if query param is missing
    if (myJobs.value.length > 0 && !selectedJobId.value) {
      selectedJobId.value = myJobs.value[0].id;
      await fetchApplicants();
    }
  } catch (e) {
    console.error("Error fetching company jobs for ATS filtering:", e);
  }
};

const fetchApplicants = async () => {
  if (!selectedJobId.value) {
    candidates.value = [];
    return;
  }

  try {
    const apps = await $fetch<any[]>(
      `${config.public.apiUrl}/jobs/${selectedJobId.value}/applicants`,
    ).catch(() => []);

    const resolvedCandidates = await Promise.all(
      apps.map(async (app) => {
        const profile = await $fetch<any>(
          `${config.public.apiUrl}/profile/${app.candidateId}`,
        ).catch(() => ({}));
        let stage = "applied";
        if (app.status === "ENTREVISTA") {
          stage = "interview";
        } else if (app.status === "ACEPTADO") {
          stage = app.stage || "offer";
        }

        return {
          id: app.candidateId,
          name: profile.nombre || "Candidato sin nombre",
          email: profile.email || app.candidateId,
          job:
            myJobs.value.find((j) => j.id === selectedJobId.value)?.title ||
            "Vacante",
          jobId: selectedJobId.value,
          stage: stage,
          status: app.status,
          time: new Date(app.appliedAt || Date.now()).toLocaleDateString(),
          cvUrl: profile.cvUrl || null,
        };
      }),
    );

    candidates.value = resolvedCandidates;
  } catch (e) {
    console.error("Error fetching job applicants:", e);
  }
};

onMounted(async () => {
  if (route.query.jobId) {
    selectedJobId.value = route.query.jobId as string;
  }
  await fetchMyJobs();
});

const filteredCandidates = computed(() => {
  if (!selectedJobId.value) return [];
  return candidates.value;
});

const boardColumns = computed(() => [
  {
    id: "applied",
    title: "Aplicados",
    items: filteredCandidates.value.filter(
      (c) => c.stage === "applied" && c.status !== "RECHAZADO",
    ),
  },
  {
    id: "interview",
    title: "Entrevista",
    items: filteredCandidates.value.filter(
      (c) => c.stage === "interview" && c.status !== "RECHAZADO",
    ),
  },
  {
    id: "offer",
    title: "Oferta",
    items: filteredCandidates.value.filter(
      (c) => c.stage === "offer" && c.status !== "RECHAZADO",
    ),
  },
  {
    id: "hired",
    title: "Contratados",
    items: filteredCandidates.value.filter(
      (c) => c.stage === "hired" && c.status !== "RECHAZADO",
    ),
  },
]);

const totalCandidates = computed(() => filteredCandidates.value.length);

const moveCandidate = async (
  candidate: any,
  currentStage: string,
  direction: "next" | "prev",
) => {
  const stages = ["applied", "interview", "offer", "hired"];
  const currIndex = stages.indexOf(currentStage);
  if (currIndex === -1) return;

  const nextIndex = direction === "next" ? currIndex + 1 : currIndex - 1;
  if (nextIndex >= 0 && nextIndex < stages.length) {
    const targetStage = stages[nextIndex];

    // Check if transitioning to interview stage
    if (targetStage === "interview") {
      pendingCandidateItem.value = candidate;
      pendingStageMove.value = targetStage;
      interviewDetails.value = "";
      isInterviewModalOpen.value = true;
      return;
    }

    // Direct transition for other stages (applied, offer, hired)
    await submitStatusUpdate(candidate, targetStage);
  }
};

const submitStatusUpdate = async (
  candidate: any,
  targetStage: string,
  details?: string,
) => {
  let backendStatus = "PENDIENTE";
  if (targetStage === "interview") {
    backendStatus = "ENTREVISTA";
  } else if (targetStage === "offer" || targetStage === "hired") {
    backendStatus = "ACEPTADO";
  }

  try {
    await $fetch(
      `${config.public.apiUrl}/applications/${candidate.jobId}/${candidate.id}/status`,
      {
        method: "PUT",
        body: {
          status: backendStatus,
          detallesEntrevista: details || null,
          stage: targetStage, // Keep track of frontend stage
        },
      },
    );

    successMsg.value = `Estado de candidato ${candidate.name} actualizado con éxito a ${backendStatus}.`;
    setTimeout(() => (successMsg.value = ""), 4500);
    await fetchApplicants();
  } catch (e) {
    console.error("Error updating candidate application status:", e);
  }
};

const submitInterviewTransition = async () => {
  if (!pendingCandidateItem.value || !pendingStageMove.value) return;

  await submitStatusUpdate(
    pendingCandidateItem.value,
    pendingStageMove.value,
    interviewDetails.value,
  );

  isInterviewModalOpen.value = false;
  pendingCandidateItem.value = null;
  pendingStageMove.value = null;
};

// Rejection actions
const triggerReject = (candidate: any) => {
  pendingCandidateItem.value = candidate;
  rejectionReason.value = "";
  isRejectModalOpen.value = true;
};

const submitRejection = async () => {
  if (!pendingCandidateItem.value) return;
  const candidate = pendingCandidateItem.value;

  try {
    await $fetch(
      `${config.public.apiUrl}/applications/${candidate.jobId}/${candidate.id}/status`,
      {
        method: "PUT",
        body: {
          status: "RECHAZADO",
          motivoRechazo: rejectionReason.value,
        },
      },
    );

    successMsg.value = `Postulante ${candidate.name} descartado con éxito. Se le ha enviado un correo electrónico.`;
    setTimeout(() => (successMsg.value = ""), 4500);
    await fetchApplicants();
  } catch (e) {
    console.error("Error rejecting candidate application:", e);
  } finally {
    isRejectModalOpen.value = false;
    pendingCandidateItem.value = null;
  }
};
</script>
