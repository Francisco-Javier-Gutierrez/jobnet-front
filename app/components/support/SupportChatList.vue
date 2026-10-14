<template>
  <div
    class="lg:col-span-5 border-r border-outline-variant/60 flex flex-col h-full bg-surface-container-low/40"
  >
    <!-- Search bar -->
    <div class="p-4 border-b border-outline-variant/60">
      <div class="relative">
        <span
          class="absolute left-3 top-2.5 material-symbols-outlined text-on-surface-variant dark:text-slate-300 text-lg"
          >search</span
        >
        <input
          :value="searchQuery"
          @input="
            $emit(
              'update:searchQuery',
              ($event.target as HTMLInputElement).value,
            )
          "
          type="text"
          placeholder="Buscar apelaciones o chats..."
          class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-background dark:text-slate-100 outline-none transition"
        />
      </div>
    </div>

    <!-- Conversations List -->
    <div
      class="flex-grow overflow-y-auto max-h-[550px] divide-y divide-outline-variant/30"
    >
      <div
        v-if="isLoadingChats"
        class="p-8 text-center text-xs text-on-surface-variant dark:text-slate-300/80"
      >
        <span
          class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
          aria-hidden="true"
        ></span>
        Cargando conversaciones de soporte...
      </div>
      <div
        v-else-if="filteredChats.length === 0"
        class="p-8 text-center text-xs text-on-surface-variant dark:text-slate-300"
      >
        No hay canales de apelación activos por el momento.
      </div>
      <div
        v-for="chat in filteredChats"
        :key="chat.id"
        @click="$emit('selectChat', chat)"
        :class="[
          'p-4 flex items-start gap-3 cursor-pointer transition hover:bg-surface-container-high/40',
          activeChat?.id === chat.id
            ? 'bg-amber-500/10 border-l-4 border-amber-600 font-semibold'
            : '',
        ]"
      >
        <div
          class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-700 dark:text-amber-300 font-bold text-sm"
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
          <p
            class="text-[11px] text-amber-700 dark:text-amber-400 font-semibold truncate mb-1"
          >
            {{ chat.reason }}
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
import type { SupportChat } from "~/types";

defineProps<{
  searchQuery: string;
  isLoadingChats: boolean;
  filteredChats: SupportChat[];
  activeChat: SupportChat | null;
}>();

defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "selectChat", chat: SupportChat): void;
}>();
</script>
