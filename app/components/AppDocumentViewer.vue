<template>
  <AppPdfPreviewModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :url="url"
    :title="title"
    :candidate-id="candidateId"
    :vacancy-title="vacancyTitle"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  url: string;
  title?: string;
  candidateId?: string;
  vacancyTitle?: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>
