<template>
  <div class="max-w-7xl mx-auto px-4 py-8 w-full flex-grow flex flex-col min-h-[calc(100vh-8rem)] bg-background" role="main">
    <!-- Page Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-on-background dark:text-slate-100 mb-2 flex items-center gap-2">
          <span class="material-symbols-outlined text-rose-600 dark:text-rose-400 text-2xl">gavel</span>
          Gestión de Apelaciones y Dictámenes
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Audita y resuelve en tiempo real las apelaciones presentadas por organizaciones y reclutadores.
        </p>
      </div>
      <!-- Connection status badge -->
      <div class="flex items-center gap-2">
        <span :class="['w-2.5 h-2.5 rounded-full', wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse']"></span>
        <span class="text-xs font-bold text-on-surface-variant dark:text-slate-300">
          {{ wsConnected ? "Canal Live WS Conectado" : "Conectando..." }}
        </span>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl flex-grow overflow-hidden min-h-[600px] shadow-sm animate-fadeIn">
      <AppealsList
        v-model:search-query="searchQuery"
        v-model:filter-type="filterType"
        :appeals-length="appeals.length"
        :filtered-appeals="filteredAppeals"
        :is-loading="isLoading"
        :selected-appeal-id="selectedAppealId"
        @select-appeal="selectAppeal"
      />
      
      <AppealWorkspace
        :active-appeal="activeAppeal"
        :is-processing-action="isProcessingAction"
        :org-message-count="orgMessageCount"
        :is-moderator-sender="isModeratorSender"
        @resolve-org="resolveOrgAppeal"
        @resolve-vacancy="resolveVacancyAppeal"
        @send-message="sendMessage"
        @chat-ref="chatContainer = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import AppealsList from '~/components/appeals/AppealsList.vue';
import AppealWorkspace from '~/components/appeals/AppealWorkspace.vue';
import { useAppeals } from '~/composables/useAppeals';

useSeoMeta({
  title: "Gestión de Apelaciones - Moderación JobNet",
  description: "Bandeja de moderación para evaluar y resolver apelaciones de empresas y vacantes",
});

const {
  searchQuery,
  filterType,
  appeals,
  selectedAppealId,
  isLoading,
  isProcessingAction,
  wsConnected,
  filteredAppeals,
  activeAppeal,
  orgMessageCount,
  chatContainer,
  fetchAppeals,
  connectWebSocket,
  closeWebSocket,
  selectAppeal,
  resolveOrgAppeal,
  resolveVacancyAppeal,
  sendMessage,
  isModeratorSender,
} = useAppeals();

onMounted(async () => {
  await fetchAppeals();
  await connectWebSocket();
});

onUnmounted(() => {
  closeWebSocket();
});
</script>

