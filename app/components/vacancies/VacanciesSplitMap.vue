<template>
  <div class="space-y-3 flex flex-col h-full">
    <!-- Map Header / Info Bar -->
    <div class="flex items-center justify-between flex-wrap gap-2 px-1">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-primary text-lg">explore</span>
        <h3 class="text-xs font-bold text-on-background dark:text-slate-200">
          Mapa de Oportunidades · Estado de México
        </h3>
      </div>
      <div class="flex items-center gap-1.5 text-[11px] text-on-surface-variant dark:text-slate-400">
        <span class="inline-flex items-center gap-1 font-semibold text-primary dark:text-indigo-400">
          <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          {{ mappedJobs.length }} geolocalizadas
        </span>
        <span v-if="remoteJobsCount > 0" class="text-on-surface-variant/60 dark:text-slate-500">
          · {{ remoteJobsCount }} remotas
        </span>
      </div>
    </div>

    <!-- Map Container -->
    <div
      class="relative rounded-2xl overflow-hidden border border-outline-variant/60 dark:border-slate-800 shadow-sm flex-1 min-h-[380px] lg:min-h-[500px]"
    >
      <div
        :id="mapContainerId"
        class="w-full h-full z-0 min-h-[380px] lg:min-h-[500px]"
      ></div>

      <!-- Floating Active Job Card Overlay (when selected or hovered) -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="activePreviewJob"
          class="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm bg-surface-container-lowest/95 dark:bg-slate-900/95 backdrop-blur-md border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-[500] space-y-2"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <span class="text-[9px] font-bold uppercase tracking-wider text-primary dark:text-indigo-400">
                {{ activePreviewJob.modalidad || "Presencial" }}
              </span>
              <h4 class="text-xs font-bold text-on-surface dark:text-slate-100 truncate">
                {{ activePreviewJob.title }}
              </h4>
              <p class="text-[11px] text-on-surface-variant dark:text-slate-400 truncate">
                {{ activePreviewJob.company }}
              </p>
            </div>
            <button
              type="button"
              @click="activePreviewJob = null"
              class="text-on-surface-variant hover:text-on-surface p-1 rounded-md transition"
            >
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div class="flex items-center justify-between text-[11px] pt-1 border-t border-outline-variant/30">
            <span class="font-bold text-emerald-600 dark:text-emerald-400">
              {{ formatSalary(activePreviewJob) }}
            </span>
            <button
              type="button"
              @click="$emit('select-job', activePreviewJob)"
              class="px-2.5 py-1 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-primary-container transition active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver vacante</span>
              <span class="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import type { Job } from "~/stores/jobs";

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
    jobs: Job[];
    highlightedJobId?: string | null;
  }>(),
  {
    highlightedJobId: null,
  }
);

const emit = defineEmits<{
  (e: "hover-job", jobId: string | null): void;
  (e: "select-job", job: Job): void;
}>();

const uniqueId = Math.random().toString(36).substring(2, 9);
const mapContainerId = `split-leaflet-map-${uniqueId}`;

const activePreviewJob = ref<Job | null>(null);

let LInstance: any = null;
let mapInstance: any = null;
let markersMap = new Map<string, any>();
let resizeObserver: ResizeObserver | null = null;

// Filter only jobs with valid latitude and longitude
const mappedJobs = computed(() => {
  return (props.jobs || []).filter(
    (j) => typeof j.lat === "number" && typeof j.lng === "number" && j.lat !== 0 && j.lng !== 0
  );
});

const remoteJobsCount = computed(() => {
  return (props.jobs || []).filter(
    (j) => j.modalidad === "Remoto" || (!j.lat && !j.lng)
  ).length;
});

const formatSalary = (job: Job) => {
  if (job.salarioMinimo && job.salarioMaximo) {
    return `$${job.salarioMinimo.toLocaleString()} - $${job.salarioMaximo.toLocaleString()} MXN`;
  }
  if (job.salario) {
    return `$${job.salario.toLocaleString()} MXN`;
  }
  return "Salario a convenir";
};

// Create custom SVG/HTML pin marker
const createPinIcon = (job: Job, isHighlighted: boolean) => {
  if (!LInstance) return null;

  const bgClass = isHighlighted
    ? "bg-indigo-600 ring-4 ring-indigo-400/40 text-white scale-125 z-50 shadow-xl"
    : "bg-indigo-600 text-white shadow-md hover:scale-110 hover:bg-indigo-700";

  const iconName = job.modalidad === "Remoto" ? "laptop" : "location_on";

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transition-all duration-200 ${bgClass} rounded-full w-9 h-9 border-2 border-white">
      <span class="material-symbols-outlined text-[18px]">${iconName}</span>
      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-indigo-600 border-r border-b border-white"></div>
    </div>
  `;

  return LInstance.divIcon({
    className: "jobnet-custom-pin",
    html: html,
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -36],
  });
};

const updateMarkers = () => {
  if (!mapInstance || !LInstance) return;

  // Clear existing markers
  markersMap.forEach((marker) => {
    mapInstance.removeLayer(marker);
  });
  markersMap.clear();

  if (mappedJobs.value.length === 0) return;

  const latLngs: any[] = [];

  mappedJobs.value.forEach((job) => {
    const isHighlighted = job.id === props.highlightedJobId;
    const pinIcon = createPinIcon(job, isHighlighted);

    const marker = LInstance.marker([job.lat, job.lng], {
      icon: pinIcon,
      zIndexOffset: isHighlighted ? 1000 : 100,
    }).addTo(mapInstance);

    // Hover tooltip
    marker.bindTooltip(
      `<div class="p-1 font-sans text-xs">
        <p class="font-bold text-slate-900">${job.title}</p>
        <p class="text-[10px] text-slate-600">${job.company} · ${job.modalidad || "Presencial"}</p>
      </div>`,
      { direction: "top", offset: [0, -30], opacity: 0.95 }
    );

    marker.on("mouseover", () => {
      emit("hover-job", job.id);
      activePreviewJob.value = job;
    });

    marker.on("mouseout", () => {
      emit("hover-job", null);
    });

    marker.on("click", () => {
      activePreviewJob.value = job;
      emit("select-job", job);
      mapInstance.panTo([job.lat, job.lng], { animate: true });
    });

    markersMap.set(job.id, marker);
    latLngs.push([job.lat, job.lng]);
  });

  // Fit bounds if markers exist
  if (latLngs.length > 0) {
    const bounds = LInstance.latLngBounds(latLngs);
    mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }
};

// Watch highlightedJobId from parent card list
watch(
  () => props.highlightedJobId,
  (newId) => {
    if (!mapInstance || !LInstance) return;

    markersMap.forEach((marker, jobId) => {
      const job = mappedJobs.value.find((j) => j.id === jobId);
      if (!job) return;

      const isHigh = jobId === newId;
      marker.setIcon(createPinIcon(job, isHigh));
      marker.setZIndexOffset(isHigh ? 1000 : 100);

      if (isHigh) {
        activePreviewJob.value = job;
        marker.openTooltip();
        mapInstance.panTo([job.lat, job.lng], { animate: true });
      }
    });
  }
);

// Re-render markers when filtered jobs list changes
watch(
  () => props.jobs,
  () => {
    nextTick(() => {
      updateMarkers();
    });
  },
  { deep: true }
);

onMounted(async () => {
  if (!import.meta.client) return;

  const L = await import("leaflet");
  LInstance = L;

  // Default Toluca / Estado de México center
  const initialLat = 19.2826;
  const initialLng = -99.6557;

  const southWest = L.latLng(18.2, -100.7);
  const northEast = L.latLng(20.4, -98.5);
  const maxBounds = L.latLngBounds(southWest, northEast);

  mapInstance = L.map(mapContainerId, {
    attributionControl: false,
    maxBounds: maxBounds,
    maxBoundsViscosity: 0.8,
    minZoom: 8,
    maxZoom: 18,
  }).setView([initialLat, initialLng], 10);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapInstance);

  updateMarkers();

  // ResizeObserver to ensure tiles render smoothly without gray cuts
  const el = document.getElementById(mapContainerId);
  if (el) {
    resizeObserver = new ResizeObserver(() => {
      if (mapInstance && el.isConnected) {
        try {
          mapInstance.invalidateSize();
        } catch (e) {}
      }
    });
    resizeObserver.observe(el);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
});
</script>

<style>
.jobnet-custom-pin {
  background: transparent;
  border: none;
}
</style>
