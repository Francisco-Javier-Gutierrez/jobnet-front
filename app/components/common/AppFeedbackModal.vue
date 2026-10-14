<template>
  <AppModal
    :model-value="isOpen"
    @update:model-value="handleClose"
    :title="displayTitle"
    :icon="typeIcon"
    :icon-bg-class="typeIconBg"
    max-width="md"
    :close-on-overlay="!isAutoClosing"
  >
    <div class="space-y-4 py-1">
      <div class="p-4 rounded-2xl border" :class="typeBannerBg">
        <p
          class="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium select-text"
        >
          {{ displayMessage }}
        </p>
      </div>

      <!-- Auto-close Progress Bar (Shown only if autoCloseTimeout is set and > 0) -->
      <div
        v-if="hasAutoClose && progressWidth > 0"
        class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden mt-3"
      >
        <div
          :class="progressColorClass"
          class="h-full transition-all duration-100 ease-linear rounded-full"
          :style="{ width: `${progressWidth}%` }"
        ></div>
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        @click="handleConfirm"
        :class="confirmBtnClass"
        class="w-full font-bold text-sm py-2.5 px-5 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-100"
      >
        <span class="material-symbols-outlined text-lg">check_circle</span>
        <span>{{ confirmText || "Aceptar" }}</span>
      </button>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import {
  useAppFeedback,
  type FeedbackType,
} from "~/composables/useAppFeedback";

const props = defineProps<{
  type?: FeedbackType;
  title?: string;
  message?: string;
  confirmText?: string;
  autoCloseTimeout?: number | null; // ms (0 or null = NEVER auto-close)
}>();

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "close"): void;
}>();

const { feedbackState, closeFeedback, confirmFeedback } = useAppFeedback();

// Resolve state from global composable or local props
const isOpen = computed({
  get: () => feedbackState.value.show,
  set: (val: boolean) => {
    if (!val) closeFeedback();
  },
});

const activeType = computed<FeedbackType>(
  () => props.type || feedbackState.value.type || "info",
);
const displayTitle = computed(
  () => props.title || feedbackState.value.title || "Notificación",
);
const displayMessage = computed(
  () => props.message || feedbackState.value.message || "",
);
const confirmText = computed(
  () => props.confirmText || feedbackState.value.confirmText || "Aceptar",
);
const timeoutDuration = computed(() =>
  props.autoCloseTimeout !== undefined
    ? props.autoCloseTimeout
    : feedbackState.value.autoCloseTimeout,
);

const hasAutoClose = computed(
  () => typeof timeoutDuration.value === "number" && timeoutDuration.value > 0,
);

// Timer & Progress state
let timer: ReturnType<typeof setTimeout> | null = null;
let progressInterval: ReturnType<typeof setInterval> | null = null;
const progressWidth = ref(100);
const isAutoClosing = ref(false);

const clearTimers = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  progressWidth.value = 100;
  isAutoClosing.value = false;
};

const startAutoCloseTimer = () => {
  clearTimers();
  const ms = timeoutDuration.value;
  if (!hasAutoClose.value || !ms) return;

  isAutoClosing.value = true;
  const stepMs = 50;
  let elapsed = 0;

  progressInterval = setInterval(() => {
    elapsed += stepMs;
    const remaining = Math.max(0, 100 - (elapsed / ms) * 100);
    progressWidth.value = remaining;

    if (elapsed >= ms) {
      clearInterval(progressInterval!);
      progressInterval = null;
    }
  }, stepMs);

  timer = setTimeout(() => {
    handleClose();
  }, ms);
};

watch(
  isOpen,
  (val) => {
    if (val) {
      startAutoCloseTimer();
    } else {
      clearTimers();
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  clearTimers();
});

const handleClose = () => {
  clearTimers();
  closeFeedback();
  emit("close");
};

const handleConfirm = () => {
  clearTimers();
  confirmFeedback();
  emit("confirm");
};

// Styling helpers
const typeIcon = computed(() => {
  switch (activeType.value) {
    case "success":
      return "check_circle";
    case "error":
      return "error";
    case "warning":
      return "warning";
    case "info":
    default:
      return "info";
  }
});

const typeIconBg = computed(() => {
  switch (activeType.value) {
    case "success":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "error":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
    case "warning":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "info":
    default:
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400";
  }
});

const typeBannerBg = computed(() => {
  switch (activeType.value) {
    case "success":
      return "bg-emerald-500/10 border-emerald-500/20";
    case "error":
      return "bg-rose-500/10 border-rose-500/20";
    case "warning":
      return "bg-amber-500/10 border-amber-500/20";
    case "info":
    default:
      return "bg-indigo-500/10 border-indigo-500/20";
  }
});

const progressColorClass = computed(() => {
  switch (activeType.value) {
    case "success":
      return "bg-emerald-500";
    case "error":
      return "bg-rose-500";
    case "warning":
      return "bg-amber-500";
    case "info":
    default:
      return "bg-indigo-500";
  }
});

const confirmBtnClass = computed(() => {
  switch (activeType.value) {
    case "success":
      return "bg-emerald-600 hover:bg-emerald-700 text-white";
    case "error":
      return "bg-rose-600 hover:bg-rose-700 text-white";
    case "warning":
      return "bg-amber-600 hover:bg-amber-700 text-white";
    case "info":
    default:
      return "bg-primary hover:bg-primary-container text-white";
  }
});
</script>
