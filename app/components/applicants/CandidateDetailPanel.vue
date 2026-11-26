<template>
  <div
    class="hidden lg:flex lg:col-span-8 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-3xl p-5 flex-col min-h-[650px] shadow-sm animate-fadeIn"
  >
    <template v-if="selectedCandidate">
      <!-- Top Bar -->
      <div
        class="flex items-center justify-between pb-4 border-b border-outline-variant/60 flex-shrink-0"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-primary text-white font-extrabold flex items-center justify-center text-lg"
          >
            {{ selectedCandidate.name.substring(0, 2).toUpperCase() }}
          </div>
          <div>
            <h3
              class="text-base font-bold text-on-background dark:text-slate-100 line-clamp-1"
            >
              {{ selectedCandidate.name }}
            </h3>
            <p class="text-[13px] text-primary font-semibold">
              {{ selectedCandidate.job }}
            </p>
          </div>
        </div>
      </div>

      <!-- Content Area: Tabs / Split View -->
      <div
        class="mt-4 flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden"
      >
        <!-- Column 1: Details -->
        <div class="space-y-4 overflow-y-auto pr-2 pb-4">
          <!-- Status & Actions -->
          <div
            class="flex flex-col gap-3 bg-surface-container-low dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/40"
          >
            <div class="flex items-center justify-between">
              <span
                class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase"
                :class="getStatusBadgeClass(selectedCandidate.status)"
              >
                {{ getStatusLabel(selectedCandidate.status) }}
              </span>
            </div>

            <div class="flex items-center gap-2 flex-wrap">
              <nuxt-link
                v-if="
                  ['EN_CONTACTO', 'SELECCIONADO', 'CONTRATADO'].includes(
                    selectedCandidate.status,
                  )
                "
                :to="`/messages?jobId=${selectedCandidate.jobId}&candidateId=${selectedCandidate.id}`"
                class="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1 transition shadow-sm"
                title="Abrir chat en pantalla completa"
              >
                <span class="material-symbols-outlined text-sm">forum</span>
                Chat
              </nuxt-link>

              <AppActionButton
                v-if="
                  ['PENDIENTE', 'EN_CONTACTO', 'SELECCIONADO'].includes(
                    selectedCandidate.status,
                  )
                "
                type="button"
                @click="advanceCandidateStage(selectedCandidate)"
                :loading="isCandidateUpdating(selectedCandidate.id)"
                icon="trending_up"
                spinner-size="xs"
                loading-text="Actualizando..."
                class="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-sm"
              >
                {{
                  selectedCandidate.status === "PENDIENTE"
                    ? "Contactar"
                    : selectedCandidate.status === "EN_CONTACTO"
                      ? "Seleccionar"
                      : "Contratar"
                }}
              </AppActionButton>

              <AppActionButton
                v-if="
                  !['RECHAZADO', 'CONTRATADO'].includes(
                    selectedCandidate.status,
                  )
                "
                type="button"
                @click="triggerReject(selectedCandidate)"
                :disabled="isCandidateUpdating(selectedCandidate.id)"
                icon="cancel"
                class="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold"
                label="Descartar"
              />
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
              class="text-xs leading-relaxed text-on-background dark:text-slate-300 whitespace-pre-wrap"
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
              <span class="text-xs font-bold dark:text-slate-200"
                >Curriculum Vitae (PDF)</span
              >
            </div>
            <button
              @click="openPdfViewer(selectedCandidate)"
              class="px-3 py-1.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl transition shadow-sm"
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
            <p
              class="text-xs text-on-background dark:text-slate-300 leading-relaxed"
            >
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

        <!-- Column 2: Chat (Only if in contact or later stages) -->
        <div
          class="h-full flex flex-col overflow-hidden border-l border-outline-variant/40 pl-4"
        >
          <template
            v-if="
              ['EN_CONTACTO', 'SELECCIONADO', 'CONTRATADO'].includes(
                selectedCandidate.status,
              )
            "
          >
            <div
              class="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/40 flex-shrink-0"
            >
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-sky-500 text-base"
                  >forum</span
                >
                <span
                  class="text-xs font-bold text-on-background dark:text-slate-200"
                  >Chat con {{ selectedCandidate.name }}</span
                >
              </div>
              <nuxt-link
                :to="`/messages?jobId=${selectedCandidate.jobId}&candidateId=${selectedCandidate.id}`"
                class="text-[11px] font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center gap-1 transition hover:underline"
              >
                <span>Abrir en Mensajería</span>
                <span class="material-symbols-outlined text-xs"
                  >open_in_new</span
                >
              </nuxt-link>
            </div>

            <ChatDetail
              v-if="activeChat"
              v-model:newMessage="newMessage"
              :activeChat="activeChat"
              :messages="messages"
              :isLoadingMessages="isLoadingMessages"
              :userId="userId"
              :isUploading="isUploading"
              :pendingAttachment="pendingAttachment"
              :isImageUrl="isImageUrl"
              :openImagePreview="openImagePreview"
              :downloadAttachment="downloadAttachment"
              :isDownloadingAttachment="isDownloadingAttachment"
              :formatTime="formatTime"
              @handle-send="handleSend"
              @handle-file-upload="handleFileUpload"
              @set-message-container="messageContainer = $event"
              @set-file-input="fileInput = $event"
            />
            <AppSkeletonLoader
              v-else
              type="chat-thread"
              :count="4"
              label="Cargando conversación..."
            />
          </template>
          <template v-else>
            <div
              class="flex-grow flex flex-col items-center justify-center p-8 text-center text-on-surface-variant dark:text-slate-400"
            >
              <span
                class="material-symbols-outlined text-[48px] text-outline/50 dark:text-slate-700 mb-4"
                >lock</span
              >
              <p
                class="text-sm font-bold text-on-background dark:text-slate-200"
              >
                Chat Bloqueado
              </p>
              <p class="text-xs mt-2">
                Avanza a este candidato a la etapa "En Contacto" para habilitar
                la mensajería privada.
              </p>
            </div>
          </template>
        </div>
      </div>
    </template>

    <template v-else>
      <div
        class="flex-grow flex flex-col items-center justify-center p-8 text-center text-on-surface-variant dark:text-slate-400"
      >
        <span
          class="material-symbols-outlined text-[48px] text-outline/50 dark:text-slate-700 mb-4"
          >person_search</span
        >
        <p class="text-sm font-bold text-on-background dark:text-slate-200">
          Ningún candidato seleccionado
        </p>
        <p class="text-xs mt-1">
          Selecciona un perfil de la lista a la izquierda para ver su
          información y chatear.
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useApplicants } from "~/composables/useApplicants";
import { useApplicantActions } from "~/composables/useApplicantActions";
import { useMessages } from "~/composables/useMessages";

const {
  selectedCandidate,
  isPdfViewerOpen,
  selectedPdfUrl,
  selectedPdfCandidateName,
} = useApplicants();
const {
  getStatusBadgeClass,
  getStatusLabel,
  isCandidateUpdating,
  advanceCandidateStage,
  triggerReject,
} = useApplicantActions();

const {
  userId,
  activeChat,
  newMessage,
  messages,
  isLoadingMessages,
  isUploading,
  pendingAttachment,
  messageContainer,
  fileInput,
  selectChat,
  handleSend,
  handleFileUpload,
  isImageUrl,
  openImagePreview,
  downloadAttachment,
  isDownloadingAttachment,
  formatTime,
  chats,
} = useMessages();

// Synchronize chat context when selected candidate changes
watch(
  () => selectedCandidate.value,
  async (newCandidate) => {
    if (
      newCandidate &&
      ["EN_CONTACTO", "SELECCIONADO", "CONTRATADO"].includes(
        newCandidate.status,
      )
    ) {
      // Build a mock chat object or find existing one
      const targetId = `${newCandidate.jobId}#${newCandidate.id}`;
      let chatObj = chats.value.find((c) => c.id === targetId);
      if (!chatObj) {
        chatObj = {
          id: targetId,
          jobId: newCandidate.jobId,
          candidateId: newCandidate.id,
          name: newCandidate.name,
          jobTitle: newCandidate.job,
          status: newCandidate.status,
          lastMessage: "",
          time: new Date().toLocaleDateString(),
        };
      }
      await selectChat(chatObj);
    } else {
      activeChat.value = null;
    }
  },
  { immediate: true, deep: true },
);

import type { ApplicantCandidate } from "~/types";

const { openCandidateCv } = useApplicants();

const openPdfViewer = (candidate: ApplicantCandidate) => {
  openCandidateCv(candidate, "VIEW");
};
</script>

<style scoped>
div::-webkit-scrollbar {
  width: 4px;
}
div::-webkit-scrollbar-thumb {
  background: #c7c4d8;
  border-radius: 9999px;
}
</style>
