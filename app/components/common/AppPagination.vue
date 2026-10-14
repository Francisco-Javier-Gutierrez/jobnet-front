<template>
  <div
    v-if="totalPages > 1"
    class="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1 text-xs text-on-surface-variant dark:text-slate-400 select-none"
  >
    <!-- Left info -->
    <div class="flex items-center gap-1 font-medium">
      <span>Mostrando</span>
      <span class="font-bold text-on-background dark:text-slate-200">{{
        startIndex
      }}</span>
      <span>a</span>
      <span class="font-bold text-on-background dark:text-slate-200">{{
        endIndex
      }}</span>
      <span>de</span>
      <span class="font-bold text-on-background dark:text-slate-200">{{
        totalItems
      }}</span>
      <span>resultados</span>
    </div>

    <!-- Page Controls -->
    <div class="flex items-center gap-1.5">
      <!-- Previous Button -->
      <button
        type="button"
        @click="prevPage"
        :disabled="currentPage <= 1"
        class="inline-flex items-center justify-center p-2 rounded-xl border border-outline-variant/60 bg-surface-container-lowest dark:bg-slate-900 text-on-background dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
        title="Página Anterior"
      >
        <span class="material-symbols-outlined text-base">chevron_left</span>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          type="button"
          @click="goToPage(page)"
          :class="[
            page === currentPage
              ? 'bg-primary text-on-primary font-bold shadow-sm'
              : 'bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 text-on-background dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800 font-medium',
            'w-8 h-8 rounded-xl flex items-center justify-center transition text-xs',
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        type="button"
        @click="nextPage"
        :disabled="currentPage >= totalPages"
        class="inline-flex items-center justify-center p-2 rounded-xl border border-outline-variant/60 bg-surface-container-lowest dark:bg-slate-900 text-on-background dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
        title="Siguiente Página"
      >
        <span class="material-symbols-outlined text-base">chevron_right</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    startIndex?: number;
    endIndex?: number;
    maxVisiblePages?: number;
  }>(),
  {
    startIndex: 1,
    endIndex: 10,
    maxVisiblePages: 5,
  },
);

const emit = defineEmits<{
  (e: "update:currentPage", page: number): void;
  (e: "change", page: number): void;
}>();

const visiblePages = computed(() => {
  const pages: number[] = [];
  const max = props.maxVisiblePages;
  let start = Math.max(1, props.currentPage - Math.floor(max / 2));
  let end = start + max - 1;

  if (end > props.totalPages) {
    end = props.totalPages;
    start = Math.max(1, end - max + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

function goToPage(page: number) {
  if (page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit("update:currentPage", page);
    emit("change", page);
  }
}

function prevPage() {
  if (props.currentPage > 1) {
    goToPage(props.currentPage - 1);
  }
}

function nextPage() {
  if (props.currentPage < props.totalPages) {
    goToPage(props.currentPage + 1);
  }
}
</script>
