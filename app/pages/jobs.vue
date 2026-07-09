<template>
  <div
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full bg-background min-h-screen"
    role="main"
  >
    <div class="mb-10">
      <h1 class="text-3xl font-bold tracking-tight text-on-background mb-2">
        Ofertas de Empleo
      </h1>
      <p class="text-on-surface-variant text-sm">
        Explora las posiciones abiertas de las principales empresas de
        tecnología.
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="store.loading"
      class="flex justify-center items-center py-20"
      role="status"
      aria-label="Cargando ofertas de empleo"
      aria-live="polite"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
        aria-hidden="true"
      ></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="store.jobs.length === 0"
      class="text-center py-20 border border-dashed border-outline-variant rounded-2xl bg-surface-container-lowest shadow-sm"
      role="status"
    >
      <p class="text-on-surface-variant">
        No se encontraron empleos disponibles en este momento.
      </p>
    </div>

    <!-- Jobs Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-label="Listado de vacantes de empleo"
    >
      <div
        v-for="job in store.jobs"
        :key="job.id"
        class="border border-outline-variant/60 rounded-2xl p-6 bg-surface-container-lowest hover:border-primary transition duration-300 flex flex-col justify-between group hover:shadow-md"
        role="article"
        :aria-label="`Vacante de ${job.title} en ${job.company}`"
      >
        <div>
          <div class="flex items-center gap-2 mb-4">
            <span
              class="px-2.5 py-1 text-xs font-bold rounded-full bg-secondary/10 text-secondary border border-secondary/20"
            >
              Activo
            </span>
            <span
              class="px-2.5 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary"
            >
              {{ job.modalidad || "Remoto" }}
            </span>
          </div>
          <h2
            class="text-lg font-bold text-on-background group-hover:text-primary transition mb-2"
          >
            {{ job.title }}
          </h2>
          <p class="text-on-surface-variant text-sm font-semibold mb-6">
            {{ job.company }}
          </p>
        </div>
        <div
          class="border-t border-outline-variant/30 pt-4 mt-4 flex items-center justify-between"
        >
          <div
            class="text-[10px] text-on-surface-variant font-semibold"
            aria-label="Coordenadas geográficas"
          >
            Lat: {{ job.lat }}, Lng: {{ job.lng }}
          </div>
          <NuxtLink
            :to="`/map?lat=${job.lat}&lng=${job.lng}`"
            class="text-primary hover:text-primary-container text-xs font-bold transition"
            :aria-label="`Ver ubicación de ${job.title} en el mapa`"
          >
            Ver Ubicación
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useJobsStore } from "../stores/jobs";

const store = useJobsStore();
onMounted(() => {
  store.fetchJobs();
});
</script>
