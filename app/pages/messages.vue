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
      <!-- Connection status badge -->
      <div class="flex items-center gap-2">
        <span
          :class="[
            'w-2.5 h-2.5 rounded-full',
            wsStatus === 'connected'
              ? 'bg-emerald-500 animate-pulse'
              : wsStatus === 'connecting'
                ? 'bg-amber-500 animate-pulse'
                : 'bg-emerald-500',
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
                : "En línea"
          }}
        </span>
      </div>
    </div>

    <!-- Main Chat/ATS Workspace Grid -->
    <div
      class="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl flex-grow overflow-hidden min-h-[550px] shadow-sm animate-fadeIn"
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
        :pendingAttachment="pendingAttachment"
        :isImageUrl="isImageUrl"
        :openImagePreview="openImagePreview"
        :formatTime="formatTime"
        @handle-send="handleSend"
        @handle-file-upload="handleFileUpload"
        @set-message-container="messageContainer = $event"
        @set-file-input="fileInput = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from "#imports";
import { useMessages } from "~/composables/useMessages";
import ChatList from "~/components/messages/ChatList.vue";
import ChatDetail from "~/components/messages/ChatDetail.vue";

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
  pendingAttachment,
  messageContainer,
  selectChat,
  handleSend,
  handleFileUpload,
  isImageUrl,
  openImagePreview,
  formatTime,
} = useMessages();
</script>
