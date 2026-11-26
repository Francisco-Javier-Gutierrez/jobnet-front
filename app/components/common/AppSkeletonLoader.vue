<template>
  <div
    class="animate-pulse w-full"
    role="status"
    aria-busy="true"
    :aria-label="label"
  >
    <!-- Card Variant -->
    <div v-if="type === 'card'" :class="cardGridClass">
      <div
        v-for="i in count"
        :key="i"
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-xl skeleton-shimmer flex-shrink-0"
          ></div>
          <div class="space-y-2 flex-grow">
            <div class="h-4 skeleton-shimmer rounded-md w-3/4"></div>
            <div class="h-3 skeleton-shimmer rounded-md w-1/2"></div>
          </div>
        </div>
        <div class="space-y-2">
          <div class="h-3 skeleton-shimmer rounded-md w-full"></div>
          <div class="h-3 skeleton-shimmer rounded-md w-5/6"></div>
        </div>
        <div
          class="pt-2 flex items-center justify-between border-t border-outline-variant/30 dark:border-slate-800"
        >
          <div class="h-6 w-20 skeleton-shimmer rounded-full"></div>
          <div class="h-8 w-24 skeleton-shimmer rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Table Row Variant -->
    <div
      v-else-if="type === 'table'"
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
    >
      <div
        class="px-4 py-3 bg-surface-container-low/60 dark:bg-slate-800/40 border-b border-outline-variant/40 dark:border-slate-800 flex items-center justify-between gap-4"
      >
        <div class="h-3 w-28 skeleton-shimmer rounded"></div>
        <div class="h-3 w-20 skeleton-shimmer rounded hidden sm:block"></div>
        <div class="h-3 w-16 skeleton-shimmer rounded"></div>
      </div>
      <div
        v-for="i in count"
        :key="i"
        class="p-4 border-b last:border-b-0 border-outline-variant/30 dark:border-slate-800/60 flex items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3 flex-grow">
          <div
            class="w-8 h-8 rounded-full skeleton-shimmer flex-shrink-0"
          ></div>
          <div class="space-y-1.5 flex-grow max-w-md">
            <div class="h-3.5 skeleton-shimmer rounded w-2/3"></div>
            <div class="h-2.5 skeleton-shimmer rounded w-1/3"></div>
          </div>
        </div>
        <div
          class="h-6 w-20 skeleton-shimmer rounded-full hidden sm:block"
        ></div>
        <div class="h-8 w-16 skeleton-shimmer rounded-xl"></div>
      </div>
    </div>

    <!-- Stats / KPI Grid Variant -->
    <div v-else-if="type === 'stats'" :class="statsGridClass">
      <div
        v-for="i in count"
        :key="i"
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div class="w-11 h-11 rounded-xl skeleton-shimmer flex-shrink-0"></div>
        <div class="space-y-2 flex-grow min-w-0">
          <div class="h-3 w-2/3 skeleton-shimmer rounded"></div>
          <div class="h-6 w-1/3 skeleton-shimmer rounded-md"></div>
        </div>
      </div>
    </div>

    <!-- Detail Card / Post Variant -->
    <div v-else-if="type === 'detail'" class="space-y-6">
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5"
      >
        <div class="flex items-center gap-3.5">
          <div
            class="w-12 h-12 rounded-full skeleton-shimmer flex-shrink-0"
          ></div>
          <div class="space-y-2 flex-grow">
            <div class="h-4 w-44 skeleton-shimmer rounded"></div>
            <div class="h-3 w-28 skeleton-shimmer rounded"></div>
          </div>
        </div>
        <div class="space-y-2.5">
          <div class="h-3.5 w-full skeleton-shimmer rounded"></div>
          <div class="h-3.5 w-11/12 skeleton-shimmer rounded"></div>
          <div class="h-3.5 w-3/4 skeleton-shimmer rounded"></div>
        </div>
        <div class="h-44 w-full skeleton-shimmer rounded-2xl"></div>
        <div
          class="pt-3 border-t border-outline-variant/30 flex items-center gap-3"
        >
          <div class="h-7 w-16 skeleton-shimmer rounded-lg"></div>
          <div class="h-7 w-16 skeleton-shimmer rounded-lg"></div>
          <div class="h-7 w-16 skeleton-shimmer rounded-lg ml-auto"></div>
        </div>
      </div>
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
      >
        <div class="h-4 w-48 skeleton-shimmer rounded"></div>
        <div class="h-20 w-full skeleton-shimmer rounded-xl"></div>
      </div>
    </div>

    <!-- Form / Settings Tabs Variant -->
    <div v-else-if="type === 'form'" class="space-y-6">
      <div class="flex gap-2 overflow-hidden pb-1">
        <div
          v-for="i in 4"
          :key="i"
          class="h-10 w-28 skeleton-shimmer rounded-xl flex-shrink-0"
        ></div>
      </div>
      <div
        v-for="i in count"
        :key="i"
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
      >
        <div class="h-4 w-40 skeleton-shimmer rounded"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="h-3 w-24 skeleton-shimmer rounded"></div>
            <div class="h-10 w-full skeleton-shimmer rounded-xl"></div>
          </div>
          <div class="space-y-2">
            <div class="h-3 w-28 skeleton-shimmer rounded"></div>
            <div class="h-10 w-full skeleton-shimmer rounded-xl"></div>
          </div>
        </div>
        <div class="h-24 w-full skeleton-shimmer rounded-xl"></div>
      </div>
    </div>

    <!-- Chat / Ticket Sidebar List Variant -->
    <div
      v-else-if="type === 'chat-list'"
      class="divide-y divide-outline-variant/30"
    >
      <div v-for="i in count" :key="i" class="p-4 flex items-start gap-3">
        <div
          class="w-10 h-10 rounded-full skeleton-shimmer flex-shrink-0"
        ></div>
        <div class="space-y-2 flex-grow min-w-0">
          <div class="flex items-center justify-between gap-2">
            <div class="h-3.5 w-3/5 skeleton-shimmer rounded"></div>
            <div class="h-3 w-12 skeleton-shimmer rounded-full"></div>
          </div>
          <div class="h-3 w-4/5 skeleton-shimmer rounded"></div>
        </div>
      </div>
    </div>

    <!-- Chat Thread Messages Variant -->
    <div v-else-if="type === 'chat-thread'" class="space-y-4 p-4">
      <div
        v-for="i in count"
        :key="i"
        class="flex"
        :class="i % 2 === 0 ? 'justify-end' : 'justify-start'"
      >
        <div
          class="rounded-2xl p-3.5 space-y-2 border border-outline-variant/30 dark:border-slate-800"
          :class="[
            i % 2 === 0
              ? 'w-2/3 sm:w-1/2 bg-primary/5 dark:bg-indigo-950/30'
              : 'w-3/4 sm:w-3/5 bg-surface-container-low/60 dark:bg-slate-800/50',
          ]"
        >
          <div class="h-3 w-full skeleton-shimmer rounded"></div>
          <div class="h-3 w-2/3 skeleton-shimmer rounded"></div>
        </div>
      </div>
    </div>

    <!-- Chart / Analytics Card Variant -->
    <div
      v-else-if="type === 'chart'"
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
    >
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <div class="h-4 w-44 skeleton-shimmer rounded"></div>
          <div class="h-3 w-64 skeleton-shimmer rounded"></div>
        </div>
        <div class="w-9 h-9 rounded-xl skeleton-shimmer"></div>
      </div>
      <div class="space-y-3 pt-2">
        <div v-for="i in count" :key="i" class="space-y-1.5">
          <div class="flex justify-between">
            <div class="h-3 w-28 skeleton-shimmer rounded"></div>
            <div class="h-3 w-12 skeleton-shimmer rounded"></div>
          </div>
          <div class="h-2.5 w-full skeleton-shimmer rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- MFA QR Setup Variant -->
    <div
      v-else-if="type === 'qr'"
      class="flex flex-col items-center p-6 bg-surface-container-low/50 dark:bg-slate-800/40 rounded-2xl border border-outline-variant/40 dark:border-slate-700/60 space-y-4"
    >
      <div class="h-3.5 w-48 skeleton-shimmer rounded"></div>
      <div class="w-44 h-44 rounded-2xl skeleton-shimmer"></div>
      <div class="h-9 w-full max-w-xs skeleton-shimmer rounded-xl"></div>
      <div class="h-11 w-full skeleton-shimmer rounded-xl"></div>
    </div>

    <!-- Default List Variant -->
    <div v-else class="space-y-3">
      <div
        v-for="i in count"
        :key="i"
        class="p-4 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl flex items-center gap-4"
      >
        <div class="w-10 h-10 rounded-xl skeleton-shimmer flex-shrink-0"></div>
        <div class="space-y-2 flex-grow">
          <div class="h-3.5 skeleton-shimmer rounded w-1/2"></div>
          <div class="h-2.5 skeleton-shimmer rounded w-1/4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

export type SkeletonType =
  | "card"
  | "table"
  | "list"
  | "stats"
  | "detail"
  | "form"
  | "chat-list"
  | "chat-thread"
  | "chart"
  | "qr";

const props = withDefaults(
  defineProps<{
    type?: SkeletonType;
    count?: number;
    columns?: 1 | 2 | 3;
    label?: string;
  }>(),
  {
    type: "card",
    count: 3,
    columns: 3,
    label: "Cargando contenido...",
  },
);

const cardGridClass = computed(() => {
  if (props.columns === 1) return "grid grid-cols-1 gap-4";
  if (props.columns === 2) return "grid grid-cols-1 md:grid-cols-2 gap-4";
  return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
});

const statsGridClass = computed(() => {
  if (props.count <= 2) return "grid grid-cols-1 sm:grid-cols-2 gap-4";
  return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
});
</script>
