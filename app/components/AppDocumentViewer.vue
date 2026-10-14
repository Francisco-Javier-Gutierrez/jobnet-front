<template>
  <AppPdfPreviewModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :url="url"
    :title="title"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  url: string;
  title?: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>
