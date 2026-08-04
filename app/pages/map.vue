<template>
  <div
    class="flex-grow flex flex-col min-h-[calc(100vh-4rem-65px)] p-4 sm:p-6"
    role="main"
  >
    <div class="max-w-6xl mx-auto w-full space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-extrabold text-on-background">
            Mapa Interactivo de Empleos
          </h1>
          <p class="text-xs text-on-surface-variant dark:text-slate-400">
            Explora ofertas geolocalizadas en el Sur del Estado de México
            (Toluca hacia el sur).
          </p>
        </div>
      </div>

      <AppLocationMap
        v-model:lat="initialLat"
        v-model:lng="initialLng"
        label="Filtro Geográfico — Sur Estado de México"
        height="550px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppLocationMap from "~/components/common/AppLocationMap.vue";

const route = useRoute();
const initialLat = ref(
  route.query.lat ? parseFloat(route.query.lat as string) : 19.2826,
);
const initialLng = ref(
  route.query.lng ? parseFloat(route.query.lng as string) : -99.6557,
);
</script>
