<template>
  <div
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full"
    role="main"
  >
    <div class="mb-10">
      <h1 class="text-3xl font-bold tracking-tight text-white mb-2">
        Ofertas de Empleo
      </h1>
      <p class="text-slate-400 text-sm">
        Explora las posiciones abiertas de las principales empresas de
        tecnología.
      </p>
    </div>

    <div
      v-if="store.loading"
      class="flex justify-center items-center py-20"
      role="status"
      aria-label="Cargando ofertas de empleo"
      aria-live="polite"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
        aria-hidden="true"
      ></div>
    </div>

    <div
      v-else-if="store.jobs.length === 0"
      class="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20"
      role="status"
    >
      <p class="text-slate-400">
        No se encontraron empleos disponibles en este momento.
      </p>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-label="Listado de vacantes de empleo"
    >
      <div
        v-for="job in store.jobs"
        :key="job.id"
        class="border border-slate-800 rounded-2xl p-6 bg-slate-950/40 hover:border-slate-700 transition duration-300 flex flex-col justify-between group hover:shadow-lg hover:shadow-indigo-500/5"
        role="article"
        :aria-label="`Vacante de ${job.title} en ${job.company}`"
      >
        <div>
          <div class="flex items-center gap-2 mb-4">
            <span
              class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            >
              Activo
            </span>
            <span
              class="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300"
            >
              Remoto
            </span>
          </div>
          <h2
            class="text-xl font-bold text-white group-hover:text-indigo-400 transition mb-2"
          >
            {{ job.title }}
          </h2>
          <p class="text-slate-400 text-sm font-medium mb-6">
            {{ job.company }}
          </p>
        </div>
        <div
          class="border-t border-slate-900 pt-4 mt-4 flex items-center justify-between"
        >
          <div
            class="text-xs text-slate-500"
            aria-label="Coordenadas geográficas"
          >
            Lat: {{ job.lat }}, Lng: {{ job.lng }}
          </div>
          <NuxtLink
            :to="`/map?lat=${job.lat}&lng=${job.lng}`"
            class="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition"
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
const store = useJobsStore();
onMounted(() => {
  store.fetchJobs();
});
</script>
