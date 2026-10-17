<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[1000] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-6 select-none"
        @click="handleOverlayClick"
        @keydown.esc="handleEsc"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
      >
        <!-- Modal / Sheet Container -->
        <Transition
          enter-active-class="transition duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
          enter-from-class="translate-y-full md:translate-y-4 md:opacity-0 md:scale-95"
          enter-to-class="translate-y-0 md:translate-y-0 md:opacity-100 md:scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="translate-y-0 md:translate-y-0 md:opacity-100 md:scale-100"
          leave-to-class="translate-y-full md:translate-y-4 md:opacity-0 md:scale-95"
        >
          <div
            v-if="modelValue"
            ref="sheetContainerRef"
            :class="[
              maxWidthClass,
              customClass ||
                'bg-surface-container-lowest dark:bg-slate-900 border-t md:border border-outline-variant/60 dark:border-slate-800 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden',
            ]"
            class="relative w-full flex flex-col max-h-[88vh] pb-[env(safe-area-inset-bottom,0px)] md:pb-0"
            :style="sheetTransformStyle"
            @click.stop
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
          >
            <!-- Mobile Drag Handle -->
            <div
              class="w-full flex justify-center pt-2.5 pb-1 md:hidden cursor-grab active:cursor-grabbing flex-shrink-0"
              aria-label="Arrastrar hacia abajo para cerrar"
            >
              <div
                class="w-12 h-1.5 rounded-full bg-outline-variant/60 dark:bg-slate-700 transition-colors"
              ></div>
            </div>

            <!-- Header (Slot or Props) -->
            <slot name="header">
              <div
                v-if="title || icon || showCloseButton"
                class="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-outline-variant/40 dark:border-slate-800/80 flex items-center justify-between bg-surface-container/30 dark:bg-slate-900/50 flex-shrink-0"
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

                  <!-- Title & Description -->
                  <div class="min-w-0 text-left">
                    <h3
                      v-if="title"
                      class="font-bold text-on-surface dark:text-slate-100 text-sm sm:text-base truncate"
                    >
                      {{ title }}
                    </h3>
                    <p
                      v-if="description"
                      class="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5 truncate"
                    >
                      {{ description }}
                    </p>
                  </div>
                </div>

                <!-- Close Button -->
                <button
                  v-if="showCloseButton"
                  type="button"
                  @click="close"
                  class="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high dark:bg-slate-800 dark:hover:bg-slate-700 text-on-surface-variant dark:text-slate-400 flex items-center justify-center transition flex-shrink-0 cursor-pointer"
                  title="Cerrar"
                  aria-label="Cerrar panel"
                >
                  <span class="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </slot>

            <!-- Sheet / Modal Body Content -->
            <div
              ref="bodyScrollRef"
              class="p-5 sm:p-6 flex-grow overflow-y-auto space-y-4 overscroll-contain"
            >
              <slot />
            </div>

            <!-- Sheet Footer -->
            <div
              v-if="$slots.footer"
              class="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-outline-variant/40 dark:border-slate-800/80 bg-surface-container/40 dark:bg-slate-900/80 flex items-center justify-end gap-2.5 flex-shrink-0"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    description?: string;
    icon?: string;
    iconBgClass?: string;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    showCloseButton?: boolean;
    customClass?: string;
    snapThreshold?: number;
  }>(),
  {
    maxWidth: "md",
    closeOnOverlay: true,
    closeOnEsc: true,
    showCloseButton: true,
    snapThreshold: 90,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
}>();

const sheetContainerRef = ref<HTMLElement | null>(null);
const bodyScrollRef = ref<HTMLElement | null>(null);

// Touch drag-to-dismiss states
const startY = ref(0);
const currentTranslateY = ref(0);
const isDragging = ref(false);

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case "xs":
      return "md:max-w-xs";
    case "sm":
      return "md:max-w-sm";
    case "md":
      return "md:max-w-md";
    case "lg":
      return "md:max-w-lg";
    case "xl":
      return "md:max-w-xl";
    case "2xl":
      return "md:max-w-2xl";
    case "full":
      return "md:max-w-full";
    default:
      return "md:max-w-md";
  }
});

const sheetTransformStyle = computed(() => {
  if (isDragging.value && currentTranslateY.value > 0) {
    return {
      transform: `translateY(${currentTranslateY.value}px)`,
      transition: "none",
    };
  }
  return undefined;
});

const close = () => {
  currentTranslateY.value = 0;
  isDragging.value = false;
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

// Touch gestures handlers
const onTouchStart = (e: TouchEvent) => {
  // Only start drag if inner body is scrolled to the very top (or dragging handle)
  if (bodyScrollRef.value && bodyScrollRef.value.scrollTop > 5) {
    return;
  }
  if (e.touches.length === 1) {
    startY.value = e.touches[0].clientY;
    isDragging.value = true;
  }
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || e.touches.length !== 1) return;
  const currentY = e.touches[0].clientY;
  const deltaY = currentY - startY.value;

  // Only allow downward drag
  if (deltaY > 0) {
    currentTranslateY.value = deltaY;
    if (e.cancelable && deltaY > 10) {
      // Prevent browser native pull-to-refresh
      e.preventDefault();
    }
  } else {
    currentTranslateY.value = 0;
  }
};

const onTouchEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;

  if (currentTranslateY.value > props.snapThreshold) {
    // Dismiss!
    close();
  } else {
    // Snap back with spring
    currentTranslateY.value = 0;
  }
};
</script>
