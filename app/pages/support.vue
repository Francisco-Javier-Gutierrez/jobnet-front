<template>
  <div
    class="max-w-6xl mx-auto px-4 py-8 w-full flex-grow flex flex-col min-h-[calc(100vh-8rem)] bg-background"
    role="main"
  >
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-on-background dark:text-slate-100 mb-2 flex items-center gap-2">
          <span class="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl">gavel</span>
          Soporte y Canales de Apelación 1-a-1
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Atención privada y resolución de disputas en tiempo real vía WebSocket con Moderación JobNet.
        </p>
      </div>
      <!-- Connection status badge -->
      <div class="flex items-center gap-2">
        <span :class="['w-2.5 h-2.5 rounded-full', wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse']"></span>
        <span class="text-xs font-bold text-on-surface-variant dark:text-slate-300">
          {{ wsConnected ? "En línea (WebSocket)" : "Conectando..." }}
        </span>
      </div>
    </div>

    <!-- Main Chat Workspace Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl flex-grow overflow-hidden min-h-[580px] shadow-sm animate-fadeIn">
      
      <!-- Left Panel: Chat List (5 Cols) -->
      <SupportChatList
        v-model:searchQuery="searchQuery"
        :is-loading-chats="isLoadingChats"
        :filtered-chats="filteredChats"
        :active-chat="activeChat"
        @selectChat="selectChat"
      />

      <!-- Right Panel: 1-on-1 Chat Detail (7 Cols) -->
      <SupportChatDetail
        :active-chat="activeChat"
        :is-moderator-role="isModeratorRole"
        :is-processing-action="isProcessingAction"
        :org-message-count="orgMessageCount"
        :is-organization="isOrganization"
        :is-loading-messages="isLoadingMessages"
        :messages="messages"
        :is-my-message="isMyMessage"
        :is-uploading="isUploading"
        :pending-attachment="pendingAttachment"
        v-model:newMessageText="newMessageText"
        :is-image-url="isImageUrl"
        :format-time="formatTime"
        @resolveOrgAppeal="resolveOrgAppeal"
        @triggerFileInput="triggerFileInput"
        @handleFileUpload="handleFileUpload"
        @sendMessage="sendMessage"
        @openImagePreview="openImagePreview"
        @updateContainerRef="chatContainer = $event"
        @updateFileInputRef="fileInput = $event"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import SupportChatList from "~/components/support/SupportChatList.vue";
import SupportChatDetail from "~/components/support/SupportChatDetail.vue";
import { useSupport } from "~/composables/useSupport";

useSeoMeta({
  title: "Soporte y Apelaciones 1-a-1 - JobNet",
  description:
    "Atención directa y canal de soporte 1-a-1 en tiempo real vía WebSocket para organizaciones y usuarios en JobNet",
});

const {
  fileInput,
  isUploading,
  pendingAttachment,
  searchQuery,
  activeChat,
  newMessageText,
  chatContainer,
  messages,
  isLoadingChats,
  isLoadingMessages,
  isProcessingAction,
  socket,
  wsConnected,
  orgMessageCount,
  filteredChats,
  isOrganization,
  isModeratorRole,
  isMyMessage,
  fetchConversations,
  selectChat,
  resolveOrgAppeal,
  connectWebSocket,
  triggerFileInput,
  handleFileUpload,
  sendMessage,
  isImageUrl,
  openImagePreview,
  formatTime,
} = useSupport();

onMounted(async () => {
  await fetchConversations();
  await connectWebSocket();
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});
</script>
