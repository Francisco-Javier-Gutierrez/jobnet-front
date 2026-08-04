<template>
  <div class="animate-pulse w-full">
    <!-- Card Variant -->
    <div
      v-if="type === 'card'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="i in count"
        :key="i"
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-5 shadow-sm space-y-4"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800"
          ></div>
          <div class="space-y-2 flex-grow">
            <div
              class="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"
            ></div>
            <div
              class="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2"
            ></div>
          </div>
        </div>
        <div class="space-y-2">
          <div
            class="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-full"
          ></div>
          <div
            class="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6"
          ></div>
        </div>
        <div
          class="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800"
        >
          <div
            class="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"
          ></div>
          <div class="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Table Row Variant -->
    <div
      v-else-if="type === 'table'"
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
    >
      <div
        v-for="i in count"
        :key="i"
        class="p-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3 flex-grow">
          <div
            class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0"
          ></div>
          <div class="space-y-1.5 flex-grow max-w-md">
            <div
              class="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-2/3"
            ></div>
            <div
              class="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"
            ></div>
          </div>
        </div>
        <div
          class="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full hidden sm:block"
        ></div>
        <div class="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
      </div>
    </div>

    <!-- List Variant -->
    <div v-else class="space-y-3">
      <div
        v-for="i in count"
        :key="i"
        class="p-4 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl flex items-center gap-4"
      >
        <div
          class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex-shrink-0"
        ></div>
        <div class="space-y-2 flex-grow">
          <div class="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          <div class="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: "card" | "table" | "list";
    count?: number;
  }>(),
  {
    type: "card",
    count: 3,
  },
);
</script>
