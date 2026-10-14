<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <AppLocationMap
      :lat="lat"
      :lng="lng"
      @update:lat="(v) => $emit('update:lat', v)"
      @update:lng="(v) => $emit('update:lng', v)"
      @locationName="(name) => $emit('locationName', name)"
      label="Ubicación Geográfica en Mapa"
      height="260px"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  lat: number;
  lng: number;
}>();

defineEmits<{
  (e: "update:lat", value: number): void;
  (e: "update:lng", value: number): void;
  (e: "locationName", value: string): void;
}>();
</script>
