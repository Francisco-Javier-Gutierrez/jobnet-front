<template>
  <div
    :class="[
      'lg:col-span-7 flex flex-col h-full bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 relative min-h-0',
      activeChat ? 'flex' : 'hidden lg:flex',
    ]"
  >
    <template v-if="activeChat">
      <!-- Header for active chat -->
      <div
        class="p-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/20 flex-shrink-0"
      >
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="$emit('back-to-list')"
            class="lg:hidden p-1.5 -ml-1 text-on-surface-variant hover:text-on-background rounded-lg hover:bg-surface-container-high transition flex items-center justify-center cursor-pointer"
            title="Volver a la lista de conversaciones"
            aria-label="Volver a la lista"
          >
            <span class="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div
            class="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs"
          >
            {{ activeChat.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h2
              class="text-xs font-bold text-on-background dark:text-slate-100"
            >
              {{ activeChat.name }}
            </h2>
            <p class="text-[11px] text-on-surface-variant dark:text-slate-300">
              {{ activeChat.jobTitle }} •
              <span class="text-primary font-semibold">{{
                activeChat.status
              }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="isReportModalOpen = true"
            class="px-2.5 py-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50"
            title="Reportar esta conversación ante moderación"
            aria-label="Reportar conversación"
          >
            <span class="material-symbols-outlined text-base">flag</span>
            <span class="hidden sm:inline">Reportar</span>
          </button>
        </div>
      </div>

      <!-- Chat messages area -->
      <div
        ref="messageContainer"
        class="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-950/40"
      >
        <AppSkeletonLoader
          v-if="isLoadingMessages"
          type="chat-thread"
          :count="5"
          label="Cargando mensajes..."
        />
        <div
          v-else-if="messages.length === 0"
          class="text-center text-xs text-slate-400 my-8"
        >
          ¡Di hola! Escribe un mensaje o adjunta un archivo para iniciar la
          conversación.
        </div>

        <!-- Messages list -->
        <div
          v-for="(msg, index) in messages"
          :key="
            msg.messageId ||
            (msg.createdAt
              ? msg.createdAt + '-' + (msg.senderId || '')
              : 'msg-' + index)
          "
          :class="[
            'flex gap-3 max-w-[85%]',
            msg.senderId === userId ? 'ml-auto justify-end' : '',
          ]"
        >
          <!-- Avatar only for recipient message -->
          <div
            v-if="msg.senderId !== userId"
            class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0"
          >
            {{ activeChat.name.charAt(0).toUpperCase() }}
          </div>

          <!-- Message container -->
          <div
            :class="[
              'p-3.5 rounded-2xl text-xs leading-relaxed transition shadow-2xs',
              msg.senderId === userId
                ? 'bg-primary text-white rounded-tr-none shadow-primary/15'
                : 'bg-surface-container-low dark:bg-slate-800 border border-outline-variant/30 rounded-tl-none text-on-surface dark:text-slate-100',
            ]"
          >
            <p v-if="msg.text" class="whitespace-pre-wrap">
              {{ msg.text }}
            </p>

            <!-- Attachment Rendering -->
            <div v-if="msg.attachmentUrl" class="mt-2">
              <!-- Image attachment -->
              <div
                v-if="
                  msg.attachmentType === 'image' ||
                  isImageUrl(msg.attachmentUrl)
                "
                class="rounded-xl overflow-hidden border border-white/20 max-w-[240px] group relative bg-black/5"
              >
                <img
                  :src="msg.attachmentUrl"
                  :alt="msg.attachmentName || 'Adjunto'"
                  class="w-full h-auto object-cover max-h-[190px] cursor-pointer group-hover:scale-102 transition duration-200"
                  @click="
                    openImagePreview(
                      msg.attachmentUrl,
                      msg.attachmentName || 'Imagen adjunta',
                    )
                  "
                />
                <button
                  type="button"
                  @click="
                    openImagePreview(
                      msg.attachmentUrl,
                      msg.attachmentName || 'Imagen adjunta',
                    )
                  "
                  class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white gap-1 font-medium text-[11px]"
                >
                  <span class="material-symbols-outlined text-base"
                    >zoom_in</span
                  >
                  <span>Ver pantalla completa</span>
                </button>
              </div>

              <!-- PDF / Document attachment -->
              <div
                v-else
                class="p-2.5 rounded-xl bg-black/10 dark:bg-white/5 border border-white/10 flex flex-col gap-2 max-w-[260px]"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span
                    class="material-symbols-outlined text-rose-500 text-xl flex-shrink-0"
                    >picture_as_pdf</span
                  >
                  <span class="truncate text-[11px] font-medium">{{
                    msg.attachmentName || "Documento PDF"
                  }}</span>
                </div>
                <div
                  class="flex items-center gap-2 pt-1 border-t border-white/10"
                >
                  <button
                    type="button"
                    @click="
                      openPdfViewer(
                        msg.attachmentUrl,
                        msg.attachmentName || 'Documento PDF',
                      )
                    "
                    class="flex-1 text-center py-1 px-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-current text-[10px] font-semibold transition flex items-center justify-center gap-1"
                  >
                    <span class="material-symbols-outlined text-xs"
                      >visibility</span
                    >
                    <span>Ver</span>
                  </button>
                  <AppActionButton
                    type="button"
                    @click="
                      downloadAttachment(
                        msg.attachmentUrl,
                        msg.attachmentName || 'documento.pdf',
                      )
                    "
                    :loading="isAttachmentDownloading(msg.attachmentUrl)"
                    icon="download"
                    spinner-size="xs"
                    icon-class="text-xs"
                    loading-text="Descargando..."
                    label="Descargar"
                    class="flex-1 text-center py-1 px-2 rounded-lg bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-current text-[10px] font-semibold"
                  />
                </div>
              </div>
            </div>

            <span
              :class="[
                'block text-[9px] mt-1.5 text-right',
                msg.senderId === userId
                  ? 'text-white/80'
                  : 'text-on-surface-variant dark:text-slate-300/80',
              ]"
            >
              {{ formatTime(msg.createdAt) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Read-only banner -->
      <div
        v-if="isChatClosed"
        class="p-4 border-t border-outline-variant/60 bg-surface-container-lowest flex items-center justify-center text-center"
      >
        <p
          class="text-xs text-on-surface-variant font-medium flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-sm">lock</span>
          Este chat es de solo lectura porque el proceso ha concluido.
        </p>
      </div>

      <!-- Active Message Input Area -->
      <div
        v-else
        class="flex-shrink-0 sticky bottom-0 z-10 flex flex-col border-t border-outline-variant/60 bg-surface-container-lowest dark:bg-slate-900"
      >
        <!-- Staged File Pre-send Preview Bar -->
        <div
          v-if="stagedFile"
          class="px-4 py-2 bg-primary/5 dark:bg-slate-800/80 border-b border-outline-variant/40 flex items-center justify-between gap-3 animate-fadeIn"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div
              v-if="stagedFile.isImage && stagedFile.previewUrl"
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-outline-variant/60 flex-shrink-0"
            >
              <img
                :src="stagedFile.previewUrl"
                alt="Vista previa"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center flex-shrink-0"
            >
              <span class="material-symbols-outlined text-xl"
                >picture_as_pdf</span
              >
            </div>
            <div class="truncate">
              <p
                class="text-xs font-semibold text-on-surface dark:text-slate-100 truncate"
              >
                {{ stagedFile.name }}
              </p>
              <p
                class="text-[10px] text-on-surface-variant dark:text-slate-400"
              >
                {{ stagedFile.sizeFormatted }} • Adjunto preparado para enviar
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="cancelStagedFile"
            class="p-1 rounded-lg text-on-surface-variant hover:text-rose-500 hover:bg-rose-500/10 transition flex-shrink-0"
            title="Quitar archivo adjunto"
          >
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <!-- Input Row -->
        <div class="p-2.5 sm:p-3.5 flex items-center gap-2 sm:gap-3">
          <!-- Hidden File Input -->
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            @change="handleFileUpload"
          />

          <!-- Attachment Button -->
          <button
            @click="triggerFileInput"
            :disabled="isUploading"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface border border-outline-variant/60 hover:border-primary text-on-surface-variant dark:text-slate-300 flex items-center justify-center transition disabled:opacity-50 flex-shrink-0"
            title="Adjuntar PDF o Imagen (máx. 5MB)"
          >
            <span
              v-if="isUploading"
              class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
              aria-hidden="true"
            ></span>
            <span v-else class="material-symbols-outlined text-lg"
              >attach_file</span
            >
          </button>

          <input
            v-model="newMessage"
            @keyup.enter="handleSend"
            type="text"
            placeholder="Escribe un mensaje o añade una descripción..."
            class="flex-grow bg-surface dark:bg-slate-800 border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs text-on-background dark:text-slate-100 outline-none transition"
          />
          <button
            @click="handleSend"
            :disabled="(!newMessage.trim() && !stagedFile) || isUploading"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary hover:bg-primary-container text-white flex items-center justify-center transition active:scale-95 flex-shrink-0 disabled:opacity-50 shadow-sm"
            title="Enviar mensaje"
          >
            <span
              v-if="isUploading"
              class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"
            ></span>
            <span v-else class="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </div>
    </template>

    <!-- Welcome detail view when no chat active -->
    <template v-else>
      <div
        class="flex-grow flex flex-col items-center justify-center p-8 text-center text-on-surface-variant dark:text-slate-300"
      >
        <span class="material-symbols-outlined text-[48px] text-outline mb-4"
          >forum</span
        >
        <p class="text-sm font-bold text-on-background dark:text-slate-100">
          Selecciona una conversación
        </p>
        <p class="text-xs text-on-surface-variant dark:text-slate-300 mt-1">
          Elige una postulación de la lista de la izquierda para conversar en
          tiempo real.
        </p>
      </div>
    </template>

    <!-- Modal Lightbox para Imágenes -->
    <div
      v-if="previewModal.isOpen && previewModal.type === 'image'"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4"
      @click.self="closePreviewModal"
    >
      <div
        class="bg-surface dark:bg-slate-900 border border-outline-variant/60 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div
          class="p-3.5 border-b border-outline-variant/50 flex items-center justify-between bg-surface-container-low/40"
        >
          <div class="flex items-center gap-2 truncate">
            <span class="material-symbols-outlined text-primary text-base"
              >image</span
            >
            <span class="text-xs font-bold truncate">{{
              previewModal.name
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <AppActionButton
              type="button"
              @click="downloadAttachment(previewModal.url, previewModal.name)"
              :loading="isAttachmentDownloading(previewModal.url)"
              icon="download"
              icon-class="text-lg"
              class="p-1.5 text-on-surface-variant hover:text-primary rounded-lg"
              title="Descargar imagen"
            />
            <button
              type="button"
              @click="closePreviewModal"
              class="p-1.5 text-on-surface-variant hover:text-rose-500 rounded-lg transition"
              title="Cerrar vista previa"
            >
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
        <div
          class="p-4 flex items-center justify-center overflow-auto bg-slate-950/20 min-h-[250px]"
        >
          <div
            v-if="previewModal.isLoading"
            class="flex flex-col items-center gap-2 text-xs text-slate-400"
          >
            <span
              class="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"
            ></span>
            <span>Generando enlace seguro...</span>
          </div>
          <img
            v-else
            :src="previewModal.url"
            :alt="previewModal.name"
            class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm"
          />
        </div>
      </div>
    </div>

    <!-- Modal Visor Integrado para PDF -->
    <div
      v-if="previewModal.isOpen && previewModal.type === 'pdf'"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4"
      @click.self="closePreviewModal"
    >
      <div
        class="bg-surface dark:bg-slate-900 border border-outline-variant/60 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col h-[88vh]"
      >
        <div
          class="p-3.5 border-b border-outline-variant/50 flex items-center justify-between bg-surface-container-low/40 flex-shrink-0"
        >
          <div class="flex items-center gap-2 truncate">
            <span class="material-symbols-outlined text-rose-500 text-base"
              >picture_as_pdf</span
            >
            <span class="text-xs font-bold truncate">{{
              previewModal.name
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <AppActionButton
              type="button"
              @click="downloadAttachment(previewModal.url, previewModal.name)"
              :loading="isAttachmentDownloading(previewModal.url)"
              icon="download"
              icon-class="text-lg"
              class="p-1.5 text-on-surface-variant hover:text-primary rounded-lg"
              title="Descargar PDF"
            />
            <button
              type="button"
              @click="closePreviewModal"
              class="p-1.5 text-on-surface-variant hover:text-rose-500 rounded-lg transition"
              title="Cerrar visor"
            >
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
        <div class="flex-grow bg-slate-900 relative overflow-hidden">
          <div
            v-if="previewModal.isLoading"
            class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs text-slate-300"
          >
            <span
              class="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"
            ></span>
            <span>Cargando documento PDF seguro...</span>
          </div>
          <iframe
            v-else
            :src="previewModal.url"
            class="w-full h-full border-0"
            title="Visor PDF"
          ></iframe>
        </div>
      </div>
    </div>

    <!-- Report Modal for Dispute / Chat Audit -->
    <ReportModal
      v-if="activeChat"
      :is-open="isReportModalOpen"
      target-type="CHAT"
      :target-id="`${activeChat.jobId}#${activeChat.candidateId}`"
      :target-title="`Conversación con ${activeChat.name} (${activeChat.jobTitle})`"
      :job-id="activeChat.jobId"
      :job-title="activeChat.jobTitle"
      :candidate-id="activeChat.candidateId"
      :candidate-name="activeChat.name"
      :company-id="activeChat.companyId"
      :company-name="activeChat.name"
      @close="isReportModalOpen = false"
      @submitted="onReportSubmitted"
    />
  </div>
</template>

<script setup lang="ts">
import ReportModal from "~/components/ReportModal.vue";
import { useAppFeedback } from "~/composables/useAppFeedback";
import type { ChatConversation, ChatMessage } from "~/types";
import type {
  StagedFile,
  FilePreviewModalState,
} from "~/composables/useMessages";

const props = defineProps<{
  activeChat: ChatConversation | null;
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  userId: string;
  isUploading: boolean;
  stagedFile: StagedFile | null;
  previewModal: FilePreviewModalState;
  newMessage: string;
  isImageUrl: (url?: string) => boolean;
  openImagePreview: (url: string, name?: string) => void;
  openPdfViewer: (url: string, name?: string) => void;
  closePreviewModal: () => void;
  downloadAttachment: (url: string, name?: string) => void;
  isDownloadingAttachment?: (url?: string | null) => boolean;
  formatTime: (isoString?: string) => string;
}>();

const isAttachmentDownloading = (url?: string | null) =>
  Boolean(props.isDownloadingAttachment?.(url));

const emit = defineEmits<{
  (e: "back-to-list"): void;
  (e: "update:newMessage", value: string): void;
  (e: "handle-send"): void;
  (e: "handle-file-upload", event: Event): void;
  (e: "cancel-staged-file"): void;
  (e: "set-message-container", el: HTMLElement | null): void;
  (e: "set-file-input", el: HTMLInputElement | null): void;
}>();

const newMessage = computed({
  get: () => props.newMessage,
  set: (val) => emit("update:newMessage", val),
});

const fileInput = ref<HTMLInputElement | null>(null);
const messageContainer = ref<HTMLElement | null>(null);

watch(fileInput, (val) => emit("set-file-input", val));
watch(messageContainer, (val) => emit("set-message-container", val));

onMounted(() => {
  emit("set-file-input", fileInput.value);
  emit("set-message-container", messageContainer.value);
});

const handleSend = () => emit("handle-send");
const handleFileUpload = (e: Event) => emit("handle-file-upload", e);
const cancelStagedFile = () => emit("cancel-staged-file");
const triggerFileInput = () => fileInput.value?.click();

const isChatClosed = computed(() => {
  if (!props.activeChat) return false;
  const status = props.activeChat.status?.toUpperCase() || "";
  return [
    "RECHAZADO",
    "CONTRATADO",
    "CERRADO",
    "RESUELTO",
    "APROBADO",
  ].includes(status);
});

const isReportModalOpen = ref(false);
const { showSuccess } = useAppFeedback();

const onReportSubmitted = () => {
  showSuccess(
    "Reporte Registrado",
    "La conversación ha sido reportada ante el equipo de moderación para su auditoría.",
  );
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
