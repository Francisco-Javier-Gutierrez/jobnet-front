<template>
  <AppModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="title"
    :icon="computedIcon"
    :icon-bg-class="iconBgClass"
    max-width="sm"
    @close="$emit('cancel')"
  >
    <p
      class="text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed"
    >
      {{ message }}
    </p>

    <template #footer>
      <button
        type="button"
        @click="onCancel"
        :disabled="isLoading"
        class="px-4 py-2 rounded-xl text-xs font-bold bg-surface-container-low hover:bg-surface border border-outline-variant/60 text-on-background dark:text-slate-200 transition disabled:opacity-50 cursor-pointer"
      >
        {{ cancelText }}
      </button>

      <button
        type="button"
        @click="onConfirm"
        :disabled="isLoading"
        :class="[
          confirmBtnClass,
          'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer',
        ]"
      >
        <span
          v-if="isLoading"
          class="material-symbols-outlined text-sm animate-spin"
          >progress_activity</span
        >
        {{ confirmText }}
      </button>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    icon?: string;
    variant?: "danger" | "warning" | "info" | "success";
    isLoading?: boolean;
  }>(),
  {
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    variant: "warning",
    isLoading: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const computedIcon = computed(() => {
  if (props.icon) return props.icon;
  switch (props.variant) {
    case "danger":
      return "delete";
    case "warning":
      return "warning";
    case "success":
      return "check_circle";
    default:
      return "info";
  }
});

const iconBgClass = computed(() => {
  switch (props.variant) {
    case "danger":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
    case "warning":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "success":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    default:
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400";
  }
});

const confirmBtnClass = computed(() => {
  switch (props.variant) {
    case "danger":
      return "bg-rose-600 hover:bg-rose-700 text-white";
    case "warning":
      return "bg-amber-600 hover:bg-amber-700 text-white";
    case "success":
      return "bg-emerald-600 hover:bg-emerald-700 text-white";
    default:
      return "bg-primary hover:bg-primary/90 text-on-primary";
  }
});

function onCancel() {
  emit("update:modelValue", false);
  emit("cancel");
}

function onConfirm() {
  emit("confirm");
}
</script>
