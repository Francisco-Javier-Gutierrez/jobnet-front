<template>
  <div class="space-y-3">
    <!-- Header Bar with Location Name and Current Location Action -->
    <div
      v-if="showHeader"
      class="flex items-center justify-between flex-wrap gap-2"
    >
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-primary text-lg"
          >location_on</span
        >
        <h3 class="text-xs font-bold text-on-background">
          {{ label || "Ubicación Geográfica" }}
        </h3>
      </div>

      <button
        v-if="showUseCurrentLocation"
        type="button"
        @click="useCurrentLocation"
        :disabled="isLocating"
        class="bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[11px] px-3 py-1.5 rounded-lg transition flex items-center gap-1 active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        <span v-if="isLocating" class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" aria-hidden="true"></span>
        <span v-else class="material-symbols-outlined text-xs"
          >my_location</span
        >
        <span>{{
          isLocating ? "Obteniendo GPS..." : "Usar mi ubicación actual"
        }}</span>
      </button>
    </div>

    <!-- Map Container -->
    <div
      class="relative rounded-2xl overflow-hidden border border-outline-variant/60 shadow-sm"
    >
      <div
        :id="mapContainerId"
        class="w-full z-0"
        :style="{ height: height }"
      ></div>

      <!-- Warning Toast for Geofence Boundary Limit -->
      <transition name="fade">
        <div
          v-if="geofenceWarning"
          class="absolute bottom-3 left-3 right-3 bg-amber-500/90 text-amber-950 text-xs font-bold p-2.5 rounded-xl shadow-lg border border-amber-400 backdrop-blur-md flex items-center justify-between gap-2 z-10"
        >
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">warning</span>
            <span>{{ geofenceWarning }}</span>
          </div>
          <button
            type="button"
            @click="geofenceWarning = ''"
            class="text-amber-950 hover:bg-amber-600/20 p-1 rounded-md transition"
          >
            ✕
          </button>
        </div>
      </transition>
    </div>

    <!-- Address & Coordinates Summary Badge -->
    <div
      class="flex items-center justify-between p-3 bg-surface-container-low/40 dark:bg-slate-900/60 border border-outline-variant/40 rounded-xl text-xs"
    >
      <div class="flex items-center gap-2 min-w-0">
        <span
          class="material-symbols-outlined text-primary text-base flex-shrink-0"
          >explore</span
        >
        <div class="min-w-0">
          <p class="font-bold text-on-background truncate">
            {{ detectedLocationName || "Cargando ubicación..." }}
          </p>
          <p
            class="text-[10px] text-on-surface-variant dark:text-slate-400 font-mono"
          >
            Lat: {{ currentLat.toFixed(6) }}, Lng: {{ currentLng.toFixed(6) }}
          </p>
        </div>
      </div>
      <span
        class="text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20 flex-shrink-0"
      >
        Sur EdoMex
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import * as turf from "@turf/turf";

useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      crossorigin: "",
    },
  ],
});

const props = withDefaults(
  defineProps<{
    lat?: number;
    lng?: number;
    draggable?: boolean;
    zoom?: number;
    height?: string;
    label?: string;
    showHeader?: boolean;
    showUseCurrentLocation?: boolean;
    containerId?: string;
  }>(),
  {
    lat: 19.2826, // Toluca center
    lng: -99.6557,
    draggable: true,
    zoom: 11,
    height: "320px",
    label: "",
    showHeader: true,
    showUseCurrentLocation: true,
    containerId: "",
  },
);

const emit = defineEmits<{
  (e: "update:lat", value: number): void;
  (e: "update:lng", value: number): void;
  (e: "locationName", value: string): void;
  (
    e: "change",
    payload: { lat: number; lng: number; locationName: string },
  ): void;
}>();

const uniqueId = Math.random().toString(36).substring(2, 9);
const mapContainerId = computed(
  () => props.containerId || `leaflet-map-${uniqueId}`,
);

const currentLat = ref(props.lat || 19.2826);
const currentLng = ref(props.lng || -99.6557);
const detectedLocationName = ref("");
const geofenceWarning = ref("");
const isLocating = ref(false);

let map: any = null;
let marker: any = null;
let resizeObserver: ResizeObserver | null = null;

// South Estado de México Geofence Polygon (Toluca to South boundary)
const SOUTH_EDOMEX_BOUNDS = {
  minLat: 18.3,
  maxLat: 19.4,
  minLng: -100.7,
  maxLng: -99.2,
};

const SOUTH_EDOMEX_POLYGON = turf.polygon([
  [
    [-100.7, 19.4],
    [-99.2, 19.4],
    [-99.2, 18.3],
    [-100.7, 18.3],
    [-100.7, 19.4],
  ],
]);

/**
 * Validates if coordinates are inside South Estado de México using Turf.js
 */
function isValidLocation(latVal: number, lngVal: number): boolean {
  try {
    const pt = turf.point([lngVal, latVal]);
    return turf.booleanPointInPolygon(pt, SOUTH_EDOMEX_POLYGON);
  } catch (e) {
    return (
      latVal >= SOUTH_EDOMEX_BOUNDS.minLat &&
      latVal <= SOUTH_EDOMEX_BOUNDS.maxLat &&
      lngVal >= SOUTH_EDOMEX_BOUNDS.minLng &&
      lngVal <= SOUTH_EDOMEX_BOUNDS.maxLng
    );
  }
}

/**
 * Snaps coordinates to closest valid point inside South Estado de México
 */
function clampToSouthEdoMex(
  latVal: number,
  lngVal: number,
): { lat: number; lng: number } {
  const clampedLat = Math.min(
    Math.max(latVal, SOUTH_EDOMEX_BOUNDS.minLat),
    SOUTH_EDOMEX_BOUNDS.maxLat,
  );
  const clampedLng = Math.min(
    Math.max(lngVal, SOUTH_EDOMEX_BOUNDS.minLng),
    SOUTH_EDOMEX_BOUNDS.maxLng,
  );
  return {
    lat: Number(clampedLat.toFixed(6)),
    lng: Number(clampedLng.toFixed(6)),
  };
}

import { getNativeLocationName } from "~/utils/southEdoMexGeoJSON";

/**
 * Resolves location name natively using Turf.js spatial index
 */
function resolveLocationName(latVal: number, lngVal: number) {
  const resolvedName = getNativeLocationName(latVal, lngVal);
  detectedLocationName.value = resolvedName;
  emit("locationName", resolvedName);
  emit("change", { lat: latVal, lng: lngVal, locationName: resolvedName });
}

function updateCoordinates(newLat: number, newLng: number) {
  let finalLat = newLat;
  let finalLng = newLng;

  if (!isValidLocation(newLat, newLng)) {
    const clamped = clampToSouthEdoMex(newLat, newLng);
    finalLat = clamped.lat;
    finalLng = clamped.lng;
    geofenceWarning.value = "Ubicación limitada al Sur del Estado de México.";
  } else {
    geofenceWarning.value = "";
  }

  currentLat.value = finalLat;
  currentLng.value = finalLng;

  emit("update:lat", finalLat);
  emit("update:lng", finalLng);

  if (marker) {
    marker.setLatLng([finalLat, finalLng]);
  }
  if (map) {
    map.setView([finalLat, finalLng], map.getZoom());
  }

  // Fire async resolve but no need to await inside sync function flow
  resolveLocationName(finalLat, finalLng);
}

function useCurrentLocation() {
  if (!navigator.geolocation) return;
  isLocating.value = true;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const latVal = Number(pos.coords.latitude.toFixed(6));
      const lngVal = Number(pos.coords.longitude.toFixed(6));
      updateCoordinates(latVal, lngVal);
      isLocating.value = false;
    },
    () => {
      isLocating.value = false;
    },
  );
}

onMounted(async () => {
  if (!import.meta.client) return;

  const L = await import("leaflet");

  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  // Format bounds for Leaflet map restriction
  const southWest = L.latLng(18.2, -100.7);
  const northEast = L.latLng(19.5, -99.1);
  const maxBounds = L.latLngBounds(southWest, northEast);

  // Validate initial location
  if (!isValidLocation(currentLat.value, currentLng.value)) {
    const clamped = clampToSouthEdoMex(currentLat.value, currentLng.value);
    currentLat.value = clamped.lat;
    currentLng.value = clamped.lng;
  }

  map = L.map(mapContainerId.value, {
    attributionControl: false,
    maxBounds: maxBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 9,
    maxZoom: 18,
  }).setView([currentLat.value, currentLng.value], props.zoom);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 18,
      attribution: "",
    },
  ).addTo(map);

  marker = L.marker([currentLat.value, currentLng.value], {
    draggable: props.draggable,
  }).addTo(map);

  if (props.draggable) {
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      updateCoordinates(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
    });

    map.on("click", (e: any) => {
      updateCoordinates(
        Number(e.latlng.lat.toFixed(6)),
        Number(e.latlng.lng.toFixed(6)),
      );
    });
  }

  resolveLocationName(currentLat.value, currentLng.value);

  // Use ResizeObserver to fix tile cutoff issues when container resizes
  const mapEl = document.getElementById(mapContainerId.value);
  if (mapEl) {
    resizeObserver = new ResizeObserver(() => {
      if (map && mapEl.isConnected) {
        try {
          map.invalidateSize();
        } catch (e) {}
      }
    });
    resizeObserver.observe(mapEl);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (map) {
    map.remove();
    map = null as any;
  }
});

watch(
  () => [props.lat, props.lng],
  ([newLat, newLng]) => {
    if (
      newLat &&
      newLng &&
      (newLat !== currentLat.value || newLng !== currentLng.value)
    ) {
      updateCoordinates(newLat, newLng);
    }
  },
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
/* Leaflet Tailwind overrides */
.leaflet-container {
  z-index: 1;
}
.leaflet-container img {
  max-width: none !important;
  max-height: none !important;
}
</style>
