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

    <!-- Filter Bar -->
    <div
      class="mb-8 p-4 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl flex flex-col md:flex-row gap-4 shadow-sm"
    >
      <div class="flex-grow relative">
        <span
          class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm"
          aria-hidden="true"
          >search</span
        >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por título, empresa o palabras clave..."
          class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl pl-9 pr-4 py-2.5 text-xs text-on-background outline-none transition"
        />
      </div>

      <div class="flex flex-wrap gap-4">
        <!-- Modality Filter -->
        <select
          v-model="selectedModality"
          class="bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23777587%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.2em_1.2em] pr-8"
        >
          <option value="">Todas las modalidades</option>
          <option value="Remoto">Remoto</option>
          <option value="Híbrido">Híbrido</option>
          <option value="Presencial">Presencial</option>
        </select>

        <!-- Sector Filter -->
        <select
          v-model="selectedSector"
          class="bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23777587%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.2em_1.2em] pr-8"
        >
          <option value="">Todos los sectores</option>
          <option
            v-for="sector in catalogStore.sectors"
            :key="sector.id"
            :value="sector.name"
          >
            {{ sector.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State (Skeleton) -->
    <div
      v-if="store.loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse"
      role="status"
      aria-label="Cargando ofertas de empleo"
      aria-live="polite"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="border border-outline-variant/60 rounded-2xl p-6 bg-surface-container-lowest flex flex-col justify-between h-[230px]"
      >
        <div>
          <!-- Tags Skeleton -->
          <div class="flex items-center gap-2 mb-4">
            <div class="h-6 w-14 bg-outline/20 rounded-full"></div>
            <div class="h-6 w-16 bg-outline/20 rounded-full"></div>
          </div>
          <!-- Title Skeleton -->
          <div class="h-6 w-3/4 bg-outline/20 rounded-lg mb-2"></div>
          <!-- Company Skeleton -->
          <div class="h-4 w-1/3 bg-outline/20 rounded-lg mb-4"></div>
        </div>
        <!-- Footer Skeleton -->
        <div
          class="border-t border-outline-variant/30 pt-4 mt-4 flex justify-between items-center"
        >
          <div class="h-3.5 w-24 bg-outline/20 rounded"></div>
          <div class="h-3.5 w-16 bg-outline/20 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredJobs.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm px-6 w-full"
      role="status"
    >
      <div
        class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
      >
        <span class="material-symbols-outlined text-[40px] text-primary"
          >work</span
        >
      </div>
      <h2 class="text-xl font-bold text-on-background mb-2">
        No se encontraron vacantes
      </h2>
      <p class="text-on-surface-variant text-sm max-w-sm">
        Intenta ajustar tus criterios de búsqueda o filtros para encontrar
        ofertas.
      </p>
    </div>

    <!-- Jobs Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-label="Listado de vacantes de empleo"
    >
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        @click="router.push(`/jobs/${job.id}`)"
        class="border border-outline-variant/60 rounded-2xl p-6 bg-surface-container-lowest hover:border-primary transition duration-300 flex flex-col justify-between group hover:shadow-md cursor-pointer"
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
          <NuxtLink :to="`/jobs/${job.id}`">
            <h2
              class="text-lg font-bold text-on-background hover:text-primary transition mb-2 cursor-pointer"
            >
              {{ job.title }}
            </h2>
          </NuxtLink>
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
            @click.stop
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useJobsStore } from "../stores/jobs";
import { useCatalogStore } from "../stores/catalog";

const router = useRouter();
const store = useJobsStore();
const catalogStore = useCatalogStore();

const searchQuery = ref("");
const selectedModality = ref("");
const selectedSector = ref("");

onMounted(async () => {
  store.fetchJobs();
  await catalogStore.fetchCatalog();
});

const filteredJobs = computed(() => {
  return store.jobs.filter((job) => {
    const matchesSearch =
      !searchQuery.value ||
      job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (job.descripcion &&
        job.descripcion
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()));

    const matchesModality =
      !selectedModality.value || job.modalidad === selectedModality.value;

    const matchesSector =
      !selectedSector.value ||
      (job.sectores &&
        job.sectores.some(
          (s) => s.toLowerCase() === selectedSector.value.toLowerCase(),
        ));

    return matchesSearch && matchesModality && matchesSector;
  });
});
</script>
