<template>
  <div
    :class="[
      'lg:col-span-5 border-b lg:border-b-0 lg:border-r border-outline-variant/60 flex flex-col h-full bg-surface-container-low/40 min-h-0',
      activeChat ? 'hidden lg:flex' : 'flex',
    ]"
  >
    <!-- Search bar -->
    <div class="p-4 border-b border-outline-variant/60">
      <div class="relative">
        <span
          class="absolute left-3 top-2.5 material-symbols-outlined text-on-surface-variant dark:text-slate-300 text-lg"
          >search</span
        >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar conversaciones..."
          class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-background dark:text-slate-100 outline-none transition"
        />
      </div>
    </div>

    <!-- Chat List Items -->
    <div
      class="flex-grow overflow-y-auto max-h-[550px] divide-y divide-outline-variant/30"
    >
      <AppSkeletonLoader
        v-if="isLoadingChats"
        type="chat-list"
        :count="5"
        label="Cargando conversaciones..."
      />
      <div
        v-else-if="filteredChats.length === 0"
        class="p-8 text-center text-xs text-on-surface-variant dark:text-slate-300"
      >
        No tienes chats activos por el momento.
      </div>
      <div
        v-for="chat in filteredChats"
        :key="chat.id"
        @click="selectChat(chat)"
        :class="[
          'p-4 flex items-start gap-3 cursor-pointer transition hover:bg-surface-container-high/40',
          activeChat?.id === chat.id
            ? 'bg-primary/10 border-l-4 border-primary font-semibold'
            : '',
        ]"
      >
        <div
          class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm"
        >
          {{ chat.name.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-grow min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h3
              class="text-xs font-bold text-on-background dark:text-slate-100 truncate"
            >
              {{ chat.name }}
            </h3>
            <span
              class="text-[10px] text-on-surface-variant dark:text-slate-300/80"
              >{{ chat.time }}</span
            >
          </div>
          <p class="text-[11px] text-primary font-semibold truncate mb-1">
            {{ chat.jobTitle }}
          </p>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 truncate"
          >
            {{ chat.lastMessage || "Sin mensajes aún" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatConversation } from "~/types";

const props = defineProps<{
  searchQuery: string;
  isLoadingChats: boolean;
  filteredChats: ChatConversation[];
  activeChat: ChatConversation | null;
}>();

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "select-chat", chat: ChatConversation): void;
}>();

const searchQuery = computed({
  get: () => props.searchQuery,
  set: (val) => emit("update:searchQuery", val),
});

const selectChat = (chat: ChatConversation) => {
  emit("select-chat", chat);
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
