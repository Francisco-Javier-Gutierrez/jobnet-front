<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none"
        @click="handleOverlayClick"
        @keydown.esc="handleEsc"
        tabindex="-1"
      >
        <div
          :class="[
            maxWidthClass,
            customClass ||
              'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden',
          ]"
          class="relative w-full transition-all duration-200 my-auto flex flex-col max-h-[92vh]"
          @click.stop
        >
          <!-- Header (Slot or Standard Props) -->
          <slot name="header">
            <div
              v-if="title || icon || showCloseButton"
              class="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0"
            >
              <div class="flex items-center gap-3 min-w-0 mr-3">
                <!-- Optional Icon -->
                <div
                  v-if="icon"
                  :class="iconBgClass || 'bg-primary/10 text-primary'"
                  class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <span class="material-symbols-outlined text-xl sm:text-2xl">{{
                    icon
                  }}</span>
                </div>

                <!-- Title & Subtitle -->
                <div class="min-w-0 text-left">
                  <h3
                    v-if="title"
                    class="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base truncate"
                  >
                    {{ title }}
                  </h3>
                  <p
                    v-if="subtitle"
                    class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate"
                  >
                    {{ subtitle }}
                  </p>
                </div>
              </div>

              <!-- Close Button -->
              <button
                v-if="showCloseButton"
                type="button"
                @click="close"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition flex-shrink-0 cursor-pointer"
                title="Cerrar modal"
              >
                <span class="material-symbols-outlined text-lg sm:text-xl"
                  >close</span
                >
              </button>
            </div>
          </slot>

          <!-- Modal Body Content -->
          <div class="p-5 sm:p-6 flex-grow overflow-y-auto space-y-4">
            <slot />
          </div>

          <!-- Modal Footer (Slot or Standard Action Buttons) -->
          <div
            v-if="$slots.footer"
            class="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-end gap-2.5 flex-shrink-0"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    subtitle?: string;
    icon?: string;
    iconBgClass?: string;
    maxWidth?:
      "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    showCloseButton?: boolean;
    customClass?: string;
  }>(),
  {
    maxWidth: "md",
    closeOnOverlay: true,
    closeOnEsc: true,
    showCloseButton: true,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
}>();

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case "xs":
      return "max-w-xs";
    case "sm":
      return "max-w-sm";
    case "md":
      return "max-w-md";
    case "lg":
      return "max-w-lg";
    case "xl":
      return "max-w-xl";
    case "2xl":
      return "max-w-2xl";
    case "3xl":
      return "max-w-3xl";
    case "4xl":
      return "max-w-4xl";
    case "5xl":
      return "max-w-5xl";
    case "full":
      return "max-w-full m-2";
    default:
      return "max-w-md";
  }
});

const close = () => {
  emit("update:modelValue", false);
  emit("close");
};

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close();
  }
};

const handleEsc = () => {
  if (props.closeOnEsc) {
    close();
  }
};

// Body scroll lock management
watch(
  () => props.modelValue,
  (val) => {
    if (typeof window !== "undefined") {
      if (val) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (typeof window !== "undefined") {
    document.body.style.overflow = "";
  }
});
</script>
