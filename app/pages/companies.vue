<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  router.replace("/");
});
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center">
    <div
      class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"
    ></div>
  </div>
</template>
