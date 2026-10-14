<template>
  <!-- Modals Section -->
  <!-- Mobile Candidate Detail Modal Overlay -->
  <div
    v-if="isMobileDetailModalOpen && selectedCandidate"
    class="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
    @click="isMobileDetailModalOpen = false"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 max-w-2xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      @click.stop
    >
      <!-- Modal Top Bar -->
      <div
        class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-primary text-white font-extrabold flex items-center justify-center"
          >
            {{ selectedCandidate.name.substring(0, 2).toUpperCase() }}
          </div>
          <div>
            <h3 class="text-sm font-bold text-on-background line-clamp-1">
              {{ selectedCandidate.name }}
            </h3>
            <p class="text-[11px] text-primary font-semibold">
              {{ selectedCandidate.job }}
            </p>
          </div>
        </div>

        <button
          @click="isMobileDetailModalOpen = false"
          class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
        >
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <!-- Modal Body Content -->
      <div class="space-y-4 overflow-y-auto flex-grow py-4 pr-1">
        <!-- Status & Actions -->
        <div
          class="flex items-center justify-between gap-2 flex-wrap bg-surface-container-low dark:bg-slate-950 p-3 rounded-2xl"
        >
          <span
            class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase"
            :class="getStatusBadgeClass(selectedCandidate.status)"
          >
            {{ getStatusLabel(selectedCandidate.status) }}
          </span>

          <div class="flex items-center gap-2">
            <nuxt-link
              v-if="
                ['EN_CONTACTO', 'SELECCIONADO', 'CONTRATADO'].includes(
                  selectedCandidate.status,
                )
              "
              :to="`/messages?jobId=${selectedCandidate.jobId}&candidateId=${selectedCandidate.id}`"
              class="px-3 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-bold flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm">forum</span>
              Chat
            </nuxt-link>

            <button
              v-if="
                !['RECHAZADO', 'CONTRATADO'].includes(selectedCandidate.status)
              "
              @click="advanceCandidateStage(selectedCandidate)"
              class="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm">trending_up</span>
              {{
                selectedCandidate.status === "PENDIENTE"
                  ? "Contactar"
                  : selectedCandidate.status === "EN_CONTACTO"
                    ? "Seleccionar"
                    : "Contratar"
              }}
            </button>

            <button
              v-if="
                !['RECHAZADO', 'CONTRATADO'].includes(selectedCandidate.status)
              "
              @click="triggerReject(selectedCandidate)"
              class="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 text-xs font-bold flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

        <!-- Cover Letter -->
        <div
          class="bg-surface-container-low dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/40"
        >
          <h4
            class="text-xs font-bold mb-2 flex items-center gap-1 text-primary"
          >
            <span class="material-symbols-outlined text-sm">description</span>
            Carta de Presentación
          </h4>
          <p
            class="text-xs leading-relaxed text-on-background whitespace-pre-wrap"
          >
            {{
              selectedCandidate.coverLetter ||
              "No adjuntó carta de presentación."
            }}
          </p>
        </div>

        <!-- CV Preview Trigger -->
        <div
          v-if="selectedCandidate.cvUrl"
          class="bg-surface-container-low dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/40 flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-rose-500 text-2xl"
              >picture_as_pdf</span
            >
            <span class="text-xs font-bold">Curriculum Vitae (PDF)</span>
          </div>
          <button
            @click="openPdfViewer(selectedCandidate)"
            class="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl"
          >
            Abrir CV PDF
          </button>
        </div>

        <!-- Bio & Profile -->
        <div
          class="bg-surface-container-low dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/40 space-y-3"
        >
          <h4 class="text-xs font-bold flex items-center gap-1 text-primary">
            <span class="material-symbols-outlined text-sm">badge</span>
            Resumen & Habilidades
          </h4>
          <p class="text-xs text-on-background leading-relaxed">
            {{ selectedCandidate.bio }}
          </p>

          <div
            v-if="
              selectedCandidate.skills && selectedCandidate.skills.length > 0
            "
            class="flex flex-wrap gap-1.5 pt-2"
          >
            <span
              v-for="(skill, i) in selectedCandidate.skills"
              :key="i"
              class="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-[11px] font-bold"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Interview Details Modal -->
  <AppModal
    v-model="isInterviewModalOpen"
    title="Contactar Candidato"
    subtitle="Indica el mensaje inicial y los detalles de contacto para notificar al candidato por correo electrónico."
    icon="calendar_month"
    icon-bg-class="bg-primary/10 text-primary"
    max-width="md"
  >
    <div class="space-y-4">
      <div>
        <label
          class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1"
          >Mensaje Inicial (Ej: Fecha, Hora, Link de Meet/Zoom o
          requerimientos):</label
        >
        <textarea
          v-model="interviewDetails"
          rows="4"
          class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none transition"
          placeholder="Ej: Lunes 24 de Julio a las 10:00 AM (GMT-6). Reunión de Teams: https://teams.microsoft.com/l/meetup-join/..."
        ></textarea>
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        @click="isInterviewModalOpen = false"
        class="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer"
      >
        Cancelar
      </button>
      <button
        type="button"
        @click="submitInterviewTransition"
        :disabled="!interviewDetails.trim()"
        class="px-4 py-2 bg-primary hover:bg-primary-container text-white disabled:opacity-50 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
      >
        Confirmar y Contactar
      </button>
    </template>
  </AppModal>

  <!-- Rejection Reason Modal -->
  <AppModal
    v-model="isRejectModalOpen"
    title="Descartar Postulante"
    subtitle="Ingresa el motivo del descarte para notificar de forma automática por correo."
    icon="cancel"
    icon-bg-class="bg-rose-500/10 text-rose-600"
    max-width="md"
  >
    <div class="space-y-4">
      <div>
        <label
          class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1"
          >Motivo de Rechazo:</label
        >
        <textarea
          v-model="rejectionReason"
          rows="4"
          class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none transition"
          placeholder="Ej: Agradecemos tu participación en el proceso, pero hemos decidido avanzar con perfiles que se alinean más estrechamente con la experiencia requerida."
        ></textarea>
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        @click="isRejectModalOpen = false"
        class="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer"
      >
        Cancelar
      </button>
      <button
        type="button"
        @click="submitRejection"
        :disabled="!rejectionReason.trim()"
        class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
      >
        Confirmar Descarte
      </button>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { useApplicants } from "~/composables/useApplicants";
import { useApplicantActions } from "~/composables/useApplicantActions";

const {
  selectedCandidate,
  isMobileDetailModalOpen,
  isPdfViewerOpen,
  selectedPdfUrl,
  selectedPdfCandidateName,
} = useApplicants();
const {
  isInterviewModalOpen,
  interviewDetails,
  isRejectModalOpen,
  rejectionReason,
  getStatusBadgeClass,
  getStatusLabel,
  advanceCandidateStage,
  triggerReject,
  submitInterviewTransition,
  submitRejection,
} = useApplicantActions();

import type { ApplicantCandidate } from "~/types";

const openPdfViewer = (candidate: ApplicantCandidate) => {
  selectedPdfUrl.value = candidate.cvUrl || "";
  selectedPdfCandidateName.value = candidate.name || "";
  isPdfViewerOpen.value = true;
};
</script>
