<template>
  <div
    class="flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-3xl my-4 shadow-sm"
  >
    <div
      :class="iconBgClass || 'bg-primary/10 text-primary'"
      class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner"
    >
      <span class="material-symbols-outlined text-3xl sm:text-4xl">{{
        icon
      }}</span>
    </div>

    <h3
      class="text-base sm:text-lg font-bold text-on-background dark:text-slate-100 mb-1"
    >
      {{ title }}
    </h3>

    <p
      v-if="description"
      class="text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 max-w-md mb-6"
    >
      {{ description }}
    </p>

    <div v-if="$slots.action || actionLabel" class="flex items-center gap-3">
      <slot name="action">
        <button
          v-if="actionLabel"
          type="button"
          @click="$emit('action')"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition shadow-sm active:scale-95 cursor-pointer"
        >
          <span v-if="actionIcon" class="material-symbols-outlined text-sm">{{
            actionIcon
          }}</span>
          {{ actionLabel }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string;
    iconBgClass?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    actionIcon?: string;
  }>(),
  {
    icon: "inbox",
  },
);

defineEmits<{
  (e: "action"): void;
}>();
</script>
