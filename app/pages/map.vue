<template>
  <div
    class="flex-grow flex flex-col min-h-[calc(100vh-4rem-65px)]"
    role="main"
  >
    <div class="h-[500px] sm:h-auto flex-grow relative" id="map-container">
      <div
        id="leaflet-map"
        class="absolute inset-0 z-10"
        role="application"
        aria-label="Mapa interactivo de ofertas de empleo"
      ></div>
      <div
        class="absolute top-4 right-4 z-20 bg-slate-950/90 border border-slate-800 p-4 rounded-xl max-w-sm backdrop-blur"
        role="complementary"
        aria-label="Información del filtro geográfico"
      >
        <h2 class="text-sm font-bold text-white mb-2">Filtro Geográfico</h2>
        <p class="text-xs text-slate-400">
          Haga clic en los marcadores para ver los detalles de los empleos.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useJobsStore } from "../stores/jobs";

const route = useRoute();
const store = useJobsStore();
let map: any = null;

useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      crossorigin: "",
    },
  ],
});

onMounted(async () => {
  if (process.client) {
    const L = await import("leaflet");
    await store.fetchJobs();

    const initialLat = route.query.lat
      ? parseFloat(route.query.lat as string)
      : 19.4326;
    const initialLng = route.query.lng
      ? parseFloat(route.query.lng as string)
      : -99.1332;
    const zoom = route.query.lat ? 14 : 12;

    map = L.map("leaflet-map", { attributionControl: false }).setView(
      [initialLat, initialLng],
      zoom,
    );

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "",
      },
    ).addTo(map);

    // Request user location to center the map if not specified in query params
    if (!route.query.lat && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          map.setView([lat, lng], 12);
        },
        (error) => {
          console.log(
            "Geolocation permission denied or failed:",
            error.message,
          );
        },
      );
    }

    store.jobs.forEach((job) => {
      const marker = L.marker([job.lat, job.lng]).addTo(map);
      marker.bindPopup(`
        <div class="text-slate-900 font-sans p-1">
          <h3 class="font-bold text-sm mb-1">${job.title}</h3>
          <p class="text-xs text-slate-600 mb-2">${job.company}</p>
          <a href="/jobs" class="inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition">Ver más detalles</a>
        </div>
      `);
    });
  }
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>
