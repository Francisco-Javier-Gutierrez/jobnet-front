<template>
  <div class="p-8 text-center">
    <p class="text-xs text-on-surface-variant">Redirigiendo a la bolsa de vacantes...</p>
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  navigateTo("/feed");
});
</script>
