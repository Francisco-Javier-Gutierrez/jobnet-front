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
      v-else-if="store.jobs.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm px-6"
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
        No hay vacantes disponibles
      </h2>
      <p class="text-on-surface-variant text-sm max-w-sm">
        Aún no se han publicado ofertas de empleo en la plataforma. ¡Vuelve pronto para explorar nuevas oportunidades!
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
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useJobsStore } from "../stores/jobs";

const router = useRouter();
const store = useJobsStore();
onMounted(() => {
  store.fetchJobs();
});
</script>
