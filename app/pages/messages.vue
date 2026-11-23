<template>
  <div
    class="max-w-6xl mx-auto px-4 py-8 w-full flex-grow flex flex-col min-h-[calc(100vh-8rem)] bg-background"
  >
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1
          class="text-2xl font-bold text-on-background dark:text-slate-100 mb-2"
        >
          Mensajes y Chat Privado
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Gestiona tus comunicaciones con la organización y candidatos en tiempo
          real.
        </p>
      </div>
      <!-- Connection status badge with truthful real-time state -->
      <div class="flex items-center gap-2">
        <span
          :class="[
            'w-2.5 h-2.5 rounded-full',
            wsStatus === 'connected'
              ? 'bg-emerald-500'
              : wsStatus === 'connecting' || wsStatus === 'reconnecting'
                ? 'bg-amber-500 animate-pulse'
                : 'bg-rose-500',
          ]"
        ></span>
        <span
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
        >
          {{
            wsStatus === "connected"
              ? "En línea"
              : wsStatus === "connecting"
                ? "Conectando..."
                : wsStatus === "reconnecting"
                  ? "Reconectando..."
                  : "Sin conexión"
          }}
        </span>
      </div>
    </div>

    <!-- Main Chat/ATS Workspace Grid -->
    <div
      class="h-[calc(100dvh-11rem)] sm:h-[calc(100vh-10rem)] min-h-[520px] flex flex-col lg:grid lg:grid-cols-12 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl flex-grow overflow-hidden shadow-sm animate-fadeIn"
    >
      <ChatList
        v-model:searchQuery="searchQuery"
        :isLoadingChats="isLoadingChats"
        :filteredChats="filteredChats"
        :activeChat="activeChat"
        @select-chat="selectChat"
      />

      <ChatDetail
        v-model:newMessage="newMessage"
        :activeChat="activeChat"
        :messages="messages"
        :isLoadingMessages="isLoadingMessages"
        :userId="userId"
        :isUploading="isUploading"
        :stagedFile="stagedFile"
        :previewModal="previewModal"
        :isImageUrl="isImageUrl"
        :openImagePreview="openImagePreview"
        :openPdfViewer="openPdfViewer"
        :closePreviewModal="closePreviewModal"
        :downloadAttachment="downloadAttachment"
        :formatTime="formatTime"
        @back-to-list="activeChat = null"
        @handle-send="handleSend"
        @handle-file-upload="handleFileUpload"
        @cancel-staged-file="cancelStagedFile"
        @set-message-container="messageContainer = $event"
        @set-file-input="fileInput = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from "#imports";
import { useMessages } from "~/composables/useMessages";

useSeoMeta({
  title: "Mensajes y Chat Privado - JobNet",
  description: "Bandeja de chat interactiva en tiempo real de JobNet",
});

const {
  userId,
  searchQuery,
  activeChat,
  newMessage,
  messages,
  isLoadingChats,
  isLoadingMessages,
  wsStatus,
  filteredChats,
  fileInput,
  isUploading,
  stagedFile,
  previewModal,
  messageContainer,
  selectChat,
  handleSend,
  handleFileUpload,
  cancelStagedFile,
  triggerFileInput,
  isImageUrl,
  openImagePreview,
  openPdfViewer,
  closePreviewModal,
  downloadAttachment,
  formatTime,
} = useMessages();
</script>
