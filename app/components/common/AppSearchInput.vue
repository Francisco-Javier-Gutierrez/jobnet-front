<template>
  <div class="relative w-full">
    <div
      class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant dark:text-slate-400"
    >
      <span class="material-symbols-outlined text-lg">search</span>
    </div>

    <input
      type="text"
      :value="modelValue"
      @input="onInput"
      :placeholder="placeholder"
      class="w-full pl-10 pr-9 py-2.5 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-xl text-xs text-on-background dark:text-slate-100 placeholder:text-on-surface-variant/60 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition shadow-sm"
    />

    <button
      v-if="modelValue"
      type="button"
      @click="clear"
      class="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-background dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer"
      title="Limpiar búsqueda"
    >
      <span class="material-symbols-outlined text-base">close</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
  }>(),
  {
    placeholder: "Buscar...",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "clear"): void;
}>();

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}

function clear() {
  emit("update:modelValue", "");
  emit("clear");
}
</script>
