<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-base font-bold text-on-background flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-secondary"
          >location_on</span
        >
        Ubicación Geográfica en Mapa
      </h2>
      <span class="text-xs text-on-surface-variant font-mono">
        Lat: {{ lat.toFixed(4) }}, Lng: {{ lng.toFixed(4) }}
      </span>
    </div>
    <p
      class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
    >
      Haz clic en el mapa para fijar tus coordenadas de residencia/trabajo y
      mejorar el cálculo de distancia con ofertas laborales.
    </p>

    <div
      id="settings-leaflet-map"
      class="h-60 w-full rounded-2xl overflow-hidden border border-outline-variant/60 shadow-inner bg-slate-100 dark:bg-slate-900 z-0"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";

const props = defineProps<{
  lat: number;
  lng: number;
}>();

const emit = defineEmits<{
  (e: "update:lat", value: number): void;
  (e: "update:lng", value: number): void;
}>();

let map: any = null;
let marker: any = null;

onMounted(async () => {
  if (!import.meta.client) return;
  const L = (await import("leaflet")).default;
  import("leaflet/dist/leaflet.css");

  const initialLat = props.lat || 19.4326;
  const initialLng = props.lng || -99.1332;

  map = L.map("settings-leaflet-map").setView([initialLat, initialLng], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);

  marker.on("dragend", () => {
    const pos = marker.getLatLng();
    emit("update:lat", pos.lat);
    emit("update:lng", pos.lng);
  });

  map.on("click", (e: any) => {
    const { lat, lng } = e.latlng;
    marker.setLatLng([lat, lng]);
    emit("update:lat", lat);
    emit("update:lng", lng);
  });
});

watch(
  () => [props.lat, props.lng],
  ([newLat, newLng]) => {
    if (map && marker && newLat && newLng) {
      marker.setLatLng([newLat, newLng]);
      map.panTo([newLat, newLng]);
    }
  },
);
</script>
