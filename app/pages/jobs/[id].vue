<template>
  <div
    class="max-w-4xl mx-auto px-4 py-8 pb-28 md:pb-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <!-- Top Breadcrumb -->
    <div class="mb-6 flex items-center justify-between">
      <NuxtLink
        to="/vacancies"
        class="inline-flex items-center gap-1.5 text-primary hover:text-primary-container text-xs font-bold transition px-3 py-1.5 bg-primary/10 rounded-xl"
      >
        <span class="material-symbols-outlined text-sm">arrow_back</span>
        Volver a vacantes
      </NuxtLink>

      <div class="flex items-center gap-2">
        <button
          v-if="job"
          @click="shareJob(job)"
          class="inline-flex items-center gap-1 text-primary hover:text-primary-container text-xs font-bold transition px-3 py-1.5 bg-primary/10 rounded-xl border border-primary/20"
          title="Copiar enlace de esta vacante"
        >
          <span class="material-symbols-outlined text-sm">share</span>
          Compartir vacante
        </button>

        <button
          v-if="job"
          @click="showReportModal = true"
          class="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 text-xs font-bold transition px-3 py-1.5 bg-rose-500/10 rounded-xl border border-rose-500/20"
        >
          <span class="material-symbols-outlined text-sm">flag</span>
          Reportar vacante
        </button>
      </div>
    </div>

    <!-- Skeleton Loading Detail Page -->
    <div
      v-if="loading"
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 rounded-3xl border border-outline-variant/60 p-8 space-y-6 animate-pulse shadow-sm"
      role="status"
    >
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-outline/10 animate-pulse"></div>
        <div class="space-y-2 flex-grow">
          <div class="h-6 w-1/2 bg-outline/20 rounded animate-pulse"></div>
          <div class="h-4 w-1/4 bg-outline/10 rounded animate-pulse"></div>
        </div>
      </div>
      <div class="h-4 w-full bg-outline/10 rounded animate-pulse"></div>
      <div class="h-4 w-5/6 bg-outline/10 rounded animate-pulse"></div>
      <div class="h-48 bg-outline/10 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Vacancy Not Found State -->
    <div
      v-else-if="!job"
      class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-3xl shadow-sm px-6"
    >
      <div
        class="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-4"
      >
        <span class="material-symbols-outlined text-[32px]">work_off</span>
      </div>
      <h2 class="text-lg font-bold text-on-background mb-2">
        Vacante no encontrada
      </h2>
      <p
        class="text-on-surface-variant dark:text-slate-300 text-xs max-w-sm mb-6"
      >
        La oferta de empleo que estás buscando no existe, ha sido desactivada o
        el enlace es incorrecto.
      </p>
      <NuxtLink
        to="/vacancies"
        class="bg-primary text-white hover:bg-primary-container font-semibold text-xs px-5 py-2.5 rounded-xl transition"
      >
        Volver a la Bolsa de Trabajo
      </NuxtLink>
    </div>

    <!-- Vacancy Suspended State -->
    <div
      v-else-if="job.suspendida || job.estatus === 'Oculta'"
      class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-3xl shadow-sm px-6"
    >
      <div
        class="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 text-rose-600 flex items-center justify-center mb-4"
      >
        <span class="material-symbols-outlined text-[32px]">visibility_off</span>
      </div>
      <h2 class="text-lg font-bold text-on-background mb-2">
        Vacante no disponible
      </h2>
      <p
        class="text-on-surface-variant dark:text-slate-300 text-xs max-w-sm mb-6"
      >
        Esta oferta laboral ha sido ocultada automáticamente del portal debido a la suspensión de la organización publicadora.
      </p>
      <NuxtLink
        to="/vacancies"
        class="bg-primary text-white hover:bg-primary-container font-semibold text-xs px-5 py-2.5 rounded-xl transition"
      >
        Volver a la Bolsa de Trabajo
      </NuxtLink>
    </div>

    <!-- UNIFIED MASTER DETAIL CARD -->
    <div
      v-else
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-8"
    >
      <div
        class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-emerald-500"
      ></div>

      <!-- 1-4. Header & Details -->
      <JobDetails
        :job="job"
        :hasApplied="hasApplied"
        :isApplying="isApplying"
        :isBookmarked="isJobBookmarked"
        :formatSalaryDisplay="formatSalaryDisplay"
        @easyApply="handleEasyApplyClick"
        @bookmark="toggleJobBookmark"
      />

      <hr class="border-outline-variant/30" />

      <!-- 5. Location Map Section -->
      <div v-if="job && job.lat && job.lng" class="space-y-3 text-left">
        <ClientOnly>
          <AppLocationMap
            :lat="job.lat"
            :lng="job.lng"
            :draggable="false"
            label="Ubicación de la Oferta"
            height="280px"
            :show-use-current-location="false"
          />
          <template #fallback>
            <div class="h-[280px] w-full rounded-2xl bg-surface-container-low/40 dark:bg-slate-900/60 border border-outline-variant/40 animate-pulse flex items-center justify-center">
              <span class="text-xs text-on-surface-variant dark:text-slate-400">Cargando mapa de ubicación...</span>
            </div>
          </template>
        </ClientOnly>
      </div>

      <hr v-if="job && job.lat && job.lng" class="border-outline-variant/30" />

      <!-- 6. Application Form Section -->
      <JobApplyForm
        :job="job"
        :jobId="jobId"
        :hasApplied="hasApplied"
        :isApplying="isApplying"
        :session="session"
        :profileCvUrl="profileCvUrl"
        :profileCvName="profileCvName"
        v-model:coverLetterInput="coverLetterInput"
        :candidateProfileLinks="candidateProfileLinks"
        :candidateProfileDocs="candidateProfileDocs"
        v-model:selectedProfileLinks="selectedProfileLinks"
        v-model:selectedProfileDocs="selectedProfileDocs"
        v-model:filterAnswers="filterAnswers"
        @easyApply="handleEasyApplyClick"
      />

      <hr class="border-outline-variant/30" />

      <!-- 7. Public Q&A Section -->
      <JobComments
        :totalComments="totalComments"
        v-model:newCommentText="newCommentText"
        :isCreatingComment="isCreatingComment"
        :commentTree="commentTree"
        :replyingToCommentId="replyingToCommentId"
        v-model:replyContentText="replyContentText"
        :canDeleteComment="canDeleteComment"
        :formatDate="formatDate"
        @submitComment="submitComment"
        @deleteComment="deleteComment"
        @toggleReplyForm="toggleReplyForm"
        @submitReply="submitReply"
      />
    </div>

    <!-- Mobile Sticky Apply Bar -->
    <div
      v-if="job && !job.suspendida && job.estatus !== 'Oculta'"
      class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-outline-variant/60 dark:border-slate-800 px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] shadow-2xl flex items-center justify-between gap-3 transition-transform duration-200"
      aria-label="Barra de postulación rápida"
    >
      <!-- Left: Salary & Company/Location -->
      <div class="min-w-0 flex-1">
        <p class="text-xs font-extrabold text-on-surface dark:text-slate-100 truncate">
          {{ formatSalaryDisplay(job) }}
        </p>
        <p class="text-[10px] text-on-surface-variant dark:text-slate-400 truncate flex items-center gap-1">
          <span class="material-symbols-outlined text-[13px] text-primary">apartment</span>
          <span>{{ job.empresaNombre || (job as any).companyName || 'Empresa' }}</span>
          <span v-if="(job as any).modalidad || (job as any).modality" class="text-outline-variant">·</span>
          <span v-if="(job as any).modalidad || (job as any).modality">{{ (job as any).modalidad || (job as any).modality }}</span>
        </p>
      </div>

      <!-- Right: Bookmark + Apply Actions -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <!-- Bookmark Toggle -->
        <button
          type="button"
          @click="toggleJobBookmark"
          class="w-10 h-10 rounded-xl border border-outline-variant/60 dark:border-slate-800 flex items-center justify-center transition active:scale-95 cursor-pointer"
          :class="[
            isJobBookmarked
              ? 'bg-primary/10 border-primary/30 text-primary dark:text-indigo-400'
              : 'bg-surface-container/60 dark:bg-slate-800 text-on-surface-variant dark:text-slate-400 hover:text-primary'
          ]"
          :aria-label="isJobBookmarked ? 'Eliminar de favoritos' : 'Guardar vacante en favoritos'"
          :title="isJobBookmarked ? 'Guardada' : 'Guardar'"
        >
          <span
            class="material-symbols-outlined text-[20px]"
            :class="{ 'font-fill-1 text-primary dark:text-indigo-400': isJobBookmarked }"
          >
            {{ isJobBookmarked ? 'bookmark' : 'bookmark_border' }}
          </span>
        </button>

        <!-- Applied State -->
        <div
          v-if="hasApplied"
          class="h-10 px-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Postulado</span>
        </div>

        <!-- Paused State -->
        <div
          v-else-if="job.estado === 'PAUSADA' || job.estado === 'EVALUACION'"
          class="h-10 px-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-[18px]">pause_circle</span>
          <span>Pausada</span>
        </div>

        <!-- Apply CTA Button -->
        <button
          v-else
          type="button"
          @click="scrollToApplySection"
          class="h-10 px-4 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 text-white font-bold text-xs shadow-md shadow-primary/20 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <span>Postularme</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de Reporte -->
  <ReportModal
    :is-open="showReportModal"
    target-type="VACANTE"
    :target-id="job?.id || ''"
    :target-title="job?.title || 'Vacante'"
    @close="showReportModal = false"
  />

  <!-- Modal de Perfil Desactualizado (Falta CV) -->
  <div
    v-if="showMissingCvModal"
    class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
  >
    <div
      class="bg-white border border-outline-variant/60 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-left"
    >
      <div
        class="flex items-center justify-between border-b border-outline-variant/30 pb-4"
      >
        <div class="flex items-center gap-2 text-amber-600">
          <span class="material-symbols-outlined text-2xl">warning</span>
          <h3 class="text-base font-extrabold text-on-background">
            Perfil desactualizado
          </h3>
        </div>
        <button
          @click="showMissingCvModal = false"
          class="text-on-surface-variant dark:text-slate-300 hover:bg-surface-container rounded-lg p-1.5 transition"
        >
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <div class="space-y-3">
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
        >
          Para realizar una
          <strong class="text-on-background"
            >Postulación en 1-Clic (Easy Apply)</strong
          >, es requisito indispensable tener tu
          <strong>Currículum Vitae (PDF)</strong> cargado en tu perfil digital.
        </p>
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-amber-900 font-semibold"
        >
          💡 Al subir tu CV en tu perfil una sola vez, podrás postularte de
          forma instantánea a cualquier vacante sin necesidad de volver a cargar
          archivos.
        </p>
      </div>

      <div class="flex flex-col gap-2.5 pt-2">
        <NuxtLink
          to="/profile"
          class="w-full bg-primary hover:bg-primary-container text-white font-bold text-xs py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-md shadow-primary/20 text-center"
        >
          <span class="material-symbols-outlined text-sm">badge</span>
          <span>Ir a mi Perfil a subir mi CV</span>
        </NuxtLink>

        <button
          type="button"
          @click="showMissingCvModal = false"
          class="w-full bg-surface border border-outline-variant hover:bg-surface-container text-on-surface-variant dark:text-slate-300 font-semibold text-xs py-3 rounded-2xl transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJobDetails } from "~/composables/useJobDetails";
import { useJobApplication } from "~/composables/useJobApplication";
import { useJobComments } from "~/composables/useJobComments";
import { useRoute } from "#imports";

const route = useRoute();
const jobId = route.params.id as string;
const { shareJob } = useShare();

const { job, loading, formatSalaryDisplay, showReportModal, loadJob } =
  useJobDetails(jobId);

const {
  profileCvUrl,
  profileCvName,
  showMissingCvModal,
  coverLetterInput,
  selectedProfileLinks,
  selectedProfileDocs,
  candidateProfileLinks,
  candidateProfileDocs,
  filterAnswers,
  isApplying,
  hasApplied,
  fetchCandidateProfile,
  handleEasyApplyClick,
  checkAppliedStatus,
  session,
} = useJobApplication(jobId, job);

const {
  totalComments,
  newCommentText,
  replyContentText,
  replyingToCommentId,
  isCreatingComment,
  commentTree,
  loadComments,
  submitComment,
  toggleReplyForm,
  submitReply,
  deleteComment,
  canDeleteComment,
  formatDate,
} = useJobComments(jobId, job);

const { status } = useAuth();
const { openProtectedModal } = useProtectedAction();

const currentUserId = computed(() => (session.value?.user as any)?.id || "");
const isJobBookmarked = computed(() => {
  if (!job.value || !currentUserId.value) return false;
  const list = (job.value as any).bookmarksList || [];
  return list.includes(currentUserId.value);
});

const toggleJobBookmark = async () => {
  if (status.value !== "authenticated") {
    openProtectedModal();
    return;
  }
  if (!job.value || !currentUserId.value) return;
  const j = job.value as any;
  if (!j.bookmarksList) j.bookmarksList = [];
  const idx = j.bookmarksList.indexOf(currentUserId.value);
  if (idx !== -1) {
    j.bookmarksList.splice(idx, 1);
  } else {
    j.bookmarksList.push(currentUserId.value);
  }
  try {
    await $fetch(`/api/jobs/${jobId}/bookmark`, {
      method: "POST",
      body: { userUuid: currentUserId.value },
    });
  } catch (e) {
    console.error("Error toggling job bookmark:", e);
  }
};

const scrollToApplySection = () => {
  if (process.client) {
    const el = document.getElementById("apply-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      crossorigin: "",
    },
  ],
});

onMounted(async () => {
  checkAppliedStatus();
  loadComments();
  await fetchCandidateProfile();
  await loadJob();
});
</script>
