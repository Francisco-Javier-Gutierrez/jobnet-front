<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <AppProtectedModal />
      <AppFeedbackModal />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import AppFeedbackModal from "~/components/common/AppFeedbackModal.vue";
</script>
