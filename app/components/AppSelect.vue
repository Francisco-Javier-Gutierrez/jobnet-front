<template>
  <div class="flex flex-col gap-1.5 w-full relative" ref="selectContainer">
    <label
      v-if="label"
      :for="selectId"
      class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1"
    >
      <span
        v-if="labelIcon"
        class="material-symbols-outlined text-sm text-primary"
        >{{ labelIcon }}</span
      >
      {{ label }}
    </label>

    <!-- Select Combobox Trigger -->
    <button
      :id="selectId"
      type="button"
      role="combobox"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      :aria-label="ariaLabel || label || placeholder"
      :aria-disabled="disabled"
      :disabled="disabled"
      @click="toggleOpen"
      @keydown="handleKeyDown"
      :class="[
        isOpen
          ? 'border-primary ring-2 ring-primary/20 shadow-sm'
          : 'border-outline-variant/60 hover:border-outline focus:border-primary',
        disabled
          ? 'opacity-50 cursor-not-allowed bg-surface-container-low'
          : 'bg-surface cursor-pointer',
        error ? 'border-rose-500 text-rose-600' : 'text-on-background',
      ]"
      class="w-full border rounded-xl px-3.5 py-2.5 text-xs text-left transition flex items-center justify-between gap-2 outline-none select-none"
    >
      <div class="flex items-center gap-2 min-w-0">
        <span
          v-if="icon"
          class="material-symbols-outlined text-sm text-on-surface-variant dark:text-slate-400 flex-shrink-0"
        >
          {{ icon }}
        </span>
        <span
          v-if="selectedOption?.icon"
          class="material-symbols-outlined text-sm text-primary flex-shrink-0"
        >
          {{ selectedOption.icon }}
        </span>
        <span
          :class="
            selectedOption
              ? 'font-semibold text-on-background dark:text-slate-100'
              : 'text-on-surface-variant/70 dark:text-slate-400'
          "
          class="truncate"
        >
          {{ selectedOption ? selectedOption.label : placeholder }}
        </span>
      </div>

      <span
        class="material-symbols-outlined text-sm text-on-surface-variant dark:text-slate-400 transition-transform duration-200 flex-shrink-0"
        :class="{ 'rotate-180 text-primary': isOpen }"
      >
        expand_more
      </span>
    </button>

    <!-- Dropdown Listbox -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-y-1"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        :id="listboxId"
        role="listbox"
        tabindex="-1"
        :aria-labelledby="selectId"
        class="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-xl shadow-xl max-h-60 overflow-y-auto p-1.5 space-y-0.5"
      >
        <div
          v-for="(option, index) in normalizedOptions"
          :key="option.value"
          :id="`${listboxId}-option-${index}`"
          role="option"
          :aria-selected="isSelected(option.value)"
          :aria-disabled="option.disabled"
          @click="selectOption(option)"
          @mouseenter="highlightedIndex = index"
          :class="[
            isSelected(option.value)
              ? 'bg-primary/10 text-primary font-bold dark:bg-primary/20'
              : highlightedIndex === index
                ? 'bg-surface-container-low dark:bg-slate-800 text-on-background dark:text-slate-100'
                : 'text-on-surface dark:text-slate-200 hover:bg-surface-container-low dark:hover:bg-slate-800/60',
            option.disabled
              ? 'opacity-40 cursor-not-allowed'
              : 'cursor-pointer',
          ]"
          class="w-full px-3 py-2 text-xs rounded-lg transition flex items-center justify-between gap-2"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              v-if="option.icon"
              class="material-symbols-outlined text-sm flex-shrink-0"
            >
              {{ option.icon }}
            </span>
            <span class="truncate">{{ option.label }}</span>
          </div>

          <span
            v-if="isSelected(option.value)"
            class="material-symbols-outlined text-sm text-primary font-bold flex-shrink-0"
          >
            check
          </span>
        </div>

        <div
          v-if="normalizedOptions.length === 0"
          class="px-3 py-2 text-xs text-on-surface-variant dark:text-slate-400 italic text-center"
        >
          Sin opciones disponibles
        </div>
      </div>
    </Transition>

    <span
      v-if="error"
      class="text-[11px] font-semibold text-rose-600 dark:text-rose-400"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
export interface SelectOption {
  value: string | number;
  label: string;
  icon?: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null;
    options: Array<SelectOption | string | number>;
    placeholder?: string;
    label?: string;
    labelIcon?: string;
    icon?: string;
    id?: string;
    disabled?: boolean;
    error?: string;
    ariaLabel?: string;
  }>(),
  {
    modelValue: "",
    placeholder: "Seleccionar...",
    label: "",
    disabled: false,
    options: () => [],
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "change", value: string | number): void;
}>();

const selectContainer = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const highlightedIndex = ref(-1);

const generatedId = useId
  ? useId()
  : `app-select-${Math.random().toString(36).substring(2, 9)}`;
const selectId = computed(() => props.id || generatedId);
const listboxId = computed(() => `${selectId.value}-listbox`);

// Normalize options array into standard SelectOption objects
const normalizedOptions = computed<SelectOption[]>(() => {
  return props.options.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return {
        value: opt.value,
        label: opt.label,
        icon: opt.icon,
        disabled: opt.disabled || false,
      };
    }
    return {
      value: opt,
      label: String(opt),
      disabled: false,
    };
  });
});

// Currently selected option object
const selectedOption = computed<SelectOption | undefined>(() => {
  return normalizedOptions.value.find((opt) => opt.value === props.modelValue);
});

const isSelected = (val: string | number) => {
  return props.modelValue === val;
};

const toggleOpen = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    const currentIndex = normalizedOptions.value.findIndex(
      (opt) => opt.value === props.modelValue,
    );
    highlightedIndex.value = currentIndex >= 0 ? currentIndex : 0;
  }
};

const selectOption = (option: SelectOption) => {
  if (option.disabled) return;
  emit("update:modelValue", option.value);
  emit("change", option.value);
  isOpen.value = false;
};

// Keyboard navigation (ARIA guidelines)
const handleKeyDown = (event: KeyboardEvent) => {
  if (props.disabled) return;

  switch (event.key) {
    case "Enter":
    case " ":
      event.preventDefault();
      if (!isOpen.value) {
        toggleOpen();
      } else if (
        highlightedIndex.value >= 0 &&
        highlightedIndex.value < normalizedOptions.value.length
      ) {
        selectOption(normalizedOptions.value[highlightedIndex.value]);
      }
      break;

    case "ArrowDown":
      event.preventDefault();
      if (!isOpen.value) {
        isOpen.value = true;
        highlightedIndex.value = 0;
      } else {
        highlightedIndex.value =
          (highlightedIndex.value + 1) % normalizedOptions.value.length;
      }
      break;

    case "ArrowUp":
      event.preventDefault();
      if (!isOpen.value) {
        isOpen.value = true;
        highlightedIndex.value = normalizedOptions.value.length - 1;
      } else {
        highlightedIndex.value =
          (highlightedIndex.value - 1 + normalizedOptions.value.length) %
          normalizedOptions.value.length;
      }
      break;

    case "Escape":
      if (isOpen.value) {
        event.preventDefault();
        isOpen.value = false;
      }
      break;

    case "Tab":
      if (isOpen.value) {
        isOpen.value = false;
      }
      break;
  }
};

// Close dropdown on click outside
const handleClickOutside = (event: MouseEvent) => {
  if (
    selectContainer.value &&
    !selectContainer.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

onMounted(() => {
  if (import.meta.client) {
    document.addEventListener("click", handleClickOutside);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener("click", handleClickOutside);
  }
});
</script>
