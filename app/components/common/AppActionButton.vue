<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
    class="inline-flex items-center justify-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <span
      v-if="loading"
      :class="[
        'border-2 border-current/25 border-t-current rounded-full animate-spin flex-shrink-0',
        spinnerSizeClass,
      ]"
      aria-hidden="true"
    ></span>
    <span
      v-else-if="icon"
      :class="['material-symbols-outlined flex-shrink-0', iconClass]"
      aria-hidden="true"
    >
      {{ icon }}
    </span>
    <slot>{{ loading && loadingText ? loadingText : label }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset";
    loading?: boolean;
    disabled?: boolean;
    icon?: string;
    iconClass?: string;
    label?: string;
    loadingText?: string;
    spinnerSize?: "xs" | "sm" | "md";
  }>(),
  {
    type: "button",
    loading: false,
    disabled: false,
    icon: undefined,
    iconClass: "text-sm",
    label: "",
    loadingText: undefined,
    spinnerSize: "sm",
  },
);

const spinnerSizeClass = computed(() => {
  if (props.spinnerSize === "xs") return "w-3 h-3";
  if (props.spinnerSize === "md") return "w-4 h-4";
  return "w-3.5 h-3.5";
});
</script>
