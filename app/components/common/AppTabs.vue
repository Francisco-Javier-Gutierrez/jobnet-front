<template>
  <div
    class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      @click="selectTab(tab.id)"
      :class="[
        modelValue === tab.id
          ? 'bg-primary text-on-primary font-bold shadow-sm'
          : 'bg-surface-container-low dark:bg-slate-900 border border-outline-variant/60 text-on-surface-variant dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800 font-medium',
        'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition cursor-pointer flex-shrink-0',
      ]"
    >
      <span
        v-if="tab.icon"
        class="material-symbols-outlined text-sm leading-none"
        >{{ tab.icon }}</span
      >
      <span>{{ tab.label }}</span>
      <span
        v-if="tab.count !== undefined"
        :class="[
          modelValue === tab.id
            ? 'bg-white/20 text-white'
            : tab.badgeClass ||
              'bg-surface-container-high dark:bg-slate-800 text-on-surface-variant dark:text-slate-300',
          'px-2 py-0.5 rounded-full text-[10px] font-bold',
        ]"
      >
        {{ tab.count }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TabItem } from "~/composables/useTabsNav";

defineProps<{
  tabs: TabItem[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", id: string): void;
  (e: "change", id: string): void;
}>();

function selectTab(id: string) {
  emit("update:modelValue", id);
  emit("change", id);
}
</script>
